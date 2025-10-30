"use server";

import {
  fetchPatient,
  getMyPatientCurrentFluidTarget,
  getTotalForToday,
  getOpenDrinks,
  getDrinksForDate,
  getTypicalProgress,
  logNewDrink,
} from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function getPatientData(patientId) {
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

export async function logDrinkForPatient(patientId, millilitres, note = "") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  const userId = session.user.id;

  const now = new Date();
  const time = now.toTimeString().split(" ")[0].slice(0, 5); // e.g. "14:23"

  const hours = now.getHours(); // 0–23
  const minutes = now.getMinutes(); // 0–59
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split("T")[0];

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
