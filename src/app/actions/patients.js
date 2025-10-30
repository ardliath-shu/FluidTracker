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
  setNewPatientFluidTarget,
} from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const minutesSinceMidnight = hours * 60 + minutes;
const day = now.toISOString().split("T")[0];

export async function getPatientData(patientId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  const patientResult = await fetchPatient(userId, patientId);
  const patient = patientResult[0];
  const fluidTarget = await getMyPatientCurrentFluidTarget(userId, patientId);
  patient.fluidTarget = fluidTarget[0].millilitres;
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

export async function logNewDrinkAction(patientId, millilitres, note = "") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  await logNewDrink(
    userId,
    patientId,
    millilitres,
    day,
    minutesSinceMidnight,
    null,
    note,
  );

  // Return updated patient stats
  return await getPatientData(patientId);
}

export async function finishOpenDrinkAction(fluidEntryId, patientId) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  // Run the DB function to mark drink as finished
  await finishOpenDrink(minutesSinceMidnight, userId, patientId, fluidEntryId);

  // Return updated patient stats
  const updatedPatient = await getPatientData(patientId);

  return updatedPatient;
}

export async function updatePatientFluidTarget(patientId, newTarget) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;
  const changeDate = day; // YYYY-MM-DD

  await setNewPatientFluidTarget(userId, patientId, newTarget, changeDate);

  // Return updated patient stats
  const updatedPatient = await getPatientData(patientId);
  return updatedPatient;
}
