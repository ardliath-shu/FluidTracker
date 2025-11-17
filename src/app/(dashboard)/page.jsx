import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import connection from "@/app/lib/connection";
import DashboardClient from "./DashboardClient";
import {
  fetchUser,
  fetchPatients,
  createNewPatient,
  getMyPatientCurrentFluidTarget,
  getOpenDrinks,
  getDrinksForDate,
  getTypicalProgress,
  getTotalForToday,
  isUserCarer,
} from "../lib/db";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const now = new Date();
  const hours = now.getHours(); // 0–23
  const minutes = now.getMinutes(); // 0–59
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split("T")[0];

  // User is authenticated, get user info.
  const userId = session.user.id;
  const userResult = await fetchUser(userId);
  const user = userResult[0];
  const name = user["name"];

  // Fetch all patients associated with this user (as patient or carer)
  let userPatients = await fetchPatients(userId);

  // Determine if user is a carer
  const isCarer = await isUserCarer(userId);

  // Only create a patient if the user has no patients AND no carer relationships
  if (userPatients.length === 0) {
    // Check if user is a carer (has any relationships as userId)
    const [carerRelationships] = await connection.execute(
      "SELECT * FROM relationships WHERE userId = ?",
      [userId],
    );

    if (!carerRelationships.length) {
      // Only create a patient if not a carer
      await createNewPatient(userId, name);
      userPatients = await fetchPatients(userId);
    }
  }

  const patients = userPatients;
  const patient = patients[0];

  if (!patient) {
    // Handle gracefully
    return <div>No patient found for this user.</div>;
  }

  // Get the patient who is linked to the user
  const patientId = patient.patientId;
  const fluidTarget = await getMyPatientCurrentFluidTarget(userId, patientId);
  patient.fluidTarget = fluidTarget.length ? fluidTarget[0].millilitres : 2500;
  const totalToday = await getTotalForToday(userId, patientId);
  patient.totalToday = totalToday.length ? totalToday[0].totalMillilitres : 0;
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
      username={name}
      patient={patient}
      patients={patients}
      isCarer={isCarer}
    />
  );
}
