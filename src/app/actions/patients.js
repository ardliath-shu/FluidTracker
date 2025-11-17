"use server";

import {
  fetchPatient,
  fetchPatients,
  getMyPatientCurrentFluidTarget,
  getTotalForToday,
  getOpenDrinks,
  getDrinksForDate,
  getTypicalProgress,
  logNewDrink,
  finishOpenDrink,
  removeDrink,
  setNewPatientFluidTarget,
} from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";
import connection from "@/app/lib/connection";

// Fetch patient data helper
export async function getPatientData(patientId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Not authenticated");

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split("T")[0];

  const userId = session.user.id;

  // Coerce id and fallback to first patient if invalid
  let targetPatientId = Number(patientId);
  if (!Number.isFinite(targetPatientId) || targetPatientId <= 0) {
    const list = await fetchPatients(userId);
    if (!list.length) {
      throw new Error("Patient not found or access denied");
    }
    targetPatientId = list[0].patientId;
  }

  // Retry once to avoid a read-after-write race immediately after linking
  let patientResult = await fetchPatient(userId, targetPatientId);
  if (!patientResult || patientResult.length === 0) {
    await new Promise((r) => setTimeout(r, 150));
    patientResult = await fetchPatient(userId, targetPatientId);
  }
  if (!patientResult || patientResult.length === 0) {
    throw new Error("Patient not found or access denied");
  }

  const patient = patientResult[0];
  const fluidTarget = await getMyPatientCurrentFluidTarget(
    userId,
    targetPatientId,
  );
  patient.fluidTarget =
    fluidTarget.length > 0 ? fluidTarget[0].millilitres : 2500;

  const totalToday = await getTotalForToday(userId, targetPatientId);
  patient.totalToday = totalToday[0].totalMillilitres || 0;
  patient.openDrinks = await getOpenDrinks(userId, targetPatientId);
  patient.drinksToday = await getDrinksForDate(userId, targetPatientId, day);
  patient.typicalProgress = await getTypicalProgress(
    userId,
    targetPatientId,
    "2025-01-01",
    minutesSinceMidnight,
  );

  return patient;
}

export async function addPatientByInviteCode(inviteCode) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  // Validate invite code and get patientId
  const [inviteRows] = await connection.execute(
    `SELECT * FROM carerInvites WHERE code = ? AND used = 0 AND expiresAt > NOW() LIMIT 1`,
    [inviteCode],
  );
  if (!inviteRows.length) {
    return { error: "Invalid or expired invite code." };
  }
  const invite = inviteRows[0];

  // Link this user to the patient
  const [insertRes] = await connection.execute(
    `INSERT IGNORE INTO relationships (userId, patientId, notes) VALUES (?, ?, 'Carer linked via invite code')`,
    [userId, invite.patientId],
  );

  // If nothing was inserted, the relationship already exists; do not consume the invite
  if (!insertRes || insertRes.affectedRows === 0) {
    return { error: "You already have access to this patient." };
  }

  // Ensure link is visible before reading
  await connection.execute(
    `SELECT 1 FROM relationships WHERE userId = ? AND patientId = ? LIMIT 1`,
    [userId, invite.patientId],
  );

  // Mark invite code as used
  await connection.execute(`UPDATE carerInvites SET used = 1 WHERE code = ?`, [
    inviteCode,
  ]);

  // Return a full patient object so the client can refresh safely
  const updatedPatient = await getPatientData(invite.patientId);
  return updatedPatient;
}

// Log a new drink for a patient
export async function logNewDrinkAction(
  patientId,
  millilitres,
  note = "",
  actionType,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split("T")[0];

  let finishTime = null;
  if (actionType === "finished") {
    finishTime = minutesSinceMidnight;
  }

  await logNewDrink(
    userId,
    patientId,
    millilitres,
    day,
    minutesSinceMidnight,
    finishTime,
    note,
  );

  // Return updated patient stats
  return await getPatientData(patientId);
}

// Finish an open drink for a patient
export async function finishOpenDrinkAction(fluidEntryId, patientId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const minutesSinceMidnight = hours * 60 + minutes;

  // Run the DB function to mark drink as finished
  await finishOpenDrink(minutesSinceMidnight, userId, patientId, fluidEntryId);

  // Return updated patient stats
  const updatedPatient = await getPatientData(patientId);

  return updatedPatient;
}

// Update a patient's fluid target
export async function updatePatientFluidTarget(patientId, newTarget) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;
  const now = new Date();
  const day = now.toISOString().split("T")[0];

  const changeDate = day; // YYYY-MM-DD

  await setNewPatientFluidTarget(userId, patientId, newTarget, changeDate);

  // Return updated patient stats
  const updatedPatient = await getPatientData(patientId);
  return updatedPatient;
}

// Remove an open drink for a patient
export async function removeDrinkAction(fluidEntryId, patientId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  await removeDrink(userId, patientId, fluidEntryId);

  // Return updated patient stats
  const updatedPatient = await getPatientData(patientId);
  return updatedPatient;
}

export async function generateCarerInviteAction(patientId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Not authenticated");

  // Check for existing, unexpired, unused code
  const [rows] = await connection.execute(
    `SELECT code, expiresAt FROM carerInvites WHERE patientId = ? AND used = FALSE AND expiresAt > NOW() ORDER BY expiresAt DESC LIMIT 1`,
    [patientId],
  );
  if (rows.length > 0) {
    // Return the existing code and expiry
    return { code: rows[0].code, expiresAt: rows[0].expiresAt };
  }

  // Generate a random 8-character code (URL-safe)
  const code = crypto.randomBytes(6).toString("base64url");

  // Set expiry to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Store in DB
  await connection.execute(
    `INSERT INTO carerInvites (code, patientId, expiresAt) VALUES (?, ?, ?)`,
    [code, patientId, expiresAt],
  );

  return { code, expiresAt };
}
