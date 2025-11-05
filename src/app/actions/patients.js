"use server";

import {
  fetchPatient,
  getMyPatientCurrentFluidTarget,
  getTotalForToday,
  getOpenDrinks,
  getDrinksForDate,
  getTypicalProgress,
  logNewDrink,
  finishOpenDrink,
  removeOpenDrink,
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

  const patientResult = await fetchPatient(userId, patientId);
  const patient = patientResult[0];
  const fluidTarget = await getMyPatientCurrentFluidTarget(userId, patientId);
  patient.fluidTarget =
    fluidTarget.length > 0 ? fluidTarget[0].millilitres : 2500;

  const totalToday = await getTotalForToday(userId, patientId);
  patient.totalToday = totalToday[0].totalMillilitres || 0;
  patient.openDrinks = await getOpenDrinks(userId, patientId);
  patient.drinksToday = await getDrinksForDate(userId, patientId, day);
  patient.typicalProgress = await getTypicalProgress(
    userId,
    patientId,
    "2025-01-01",
    minutesSinceMidnight,
  );

  return patient;
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
  const day = now.toISOString().split("T")[0];

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
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split("T")[0];

  const changeDate = day; // YYYY-MM-DD

  await setNewPatientFluidTarget(userId, patientId, newTarget, changeDate);

  // Return updated patient stats
  const updatedPatient = await getPatientData(patientId);
  return updatedPatient;
}

// Remove an open drink for a patient
export async function removeOpenDrinkAction(fluidEntryId, patientId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  await removeOpenDrink(userId, patientId, fluidEntryId);

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
