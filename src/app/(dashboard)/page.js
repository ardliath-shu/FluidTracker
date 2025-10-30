import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import DashboardClient from "./DashboardClient";
import {
  fetchUser,
  fetchPatient,
  fetchPatients,
  getMyPatientCurrentFluidTarget,
  setNewPatientFluidTarget,
  logNewDrink,
  getOpenDrinks,
  getDrinksForDate,
  finishOpenDrink,
  getTypicalProgress,
  getTotalForToday,
} from "../lib/db";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // User is authenticated, get user info.
  const userId = session.user.id;
  const userResult = await fetchUser(userId);
  const user = userResult[0];
  const username = user["name"];

  const userPatients = await fetchPatients(userId);
  const patients = userPatients || [];

  const now = new Date();
  const hours = now.getHours(); // 0–23
  const minutes = now.getMinutes(); // 0–59
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split("T")[0];

  // Get the patient the user is managing - for now, just get the first one.
  //const patientId = 1; // For testing purposes

  const userPatient = await fetchPatient(userId);
  const patientId = userPatient[0].patientId;

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

  return (
    <DashboardClient
      userId={userId}
      username={username}
      patient={patient}
      patients={patients}
    />
  );
}
