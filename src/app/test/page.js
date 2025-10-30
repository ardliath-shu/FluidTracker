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
} from "../lib/db";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import Link from "next/link";

const TestPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let userId = 1;
  let patientId = 1;
  if (session) {
    console.log(session.user.name);
    userId = session.user.id;
  }

  const userResult = await fetchUser(userId);
  const user = userResult[0];
  console.log(user);
  console.log(user["id"]);

  const userPatients = await fetchPatients(userId);
  const patients = userPatients || [];
  console.log(patients);

  const patientResult = await fetchPatient(userId, patientId);
  const patient = patientResult[0];
  console.log(patient);

  const fluidTarget = await getMyPatientCurrentFluidTarget(userId, patientId);
  console.log("initial read " + fluidTarget[0].millilitres);

  await setNewPatientFluidTarget(
    userId,
    patientId,
    2400,
    "2025-12-01 00:00:00",
  );
  const newFluidTarget = await getMyPatientCurrentFluidTarget(
    userId,
    patientId,
  );
  console.log("after update " + newFluidTarget[0].millilitres);

  // await setNewPatientFluidTarget(1, 1, 2600, '2025-12-01 00:00:00');
  // const newFluidTarget = await getMyPatientCurrentFluidTarget(1, 1);
  // console.log("after update " + newFluidTarget[0].millilitres);

  const now = new Date();
  const hours = now.getHours(); // 0–23
  const minutes = now.getMinutes(); // 0–59
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split("T")[0];

  // EXAMPLE FOR: logNewDrink(userId, patientId, millilitres, date, timeStartedMinutes, timeEndedMinutes, note)
  //await logNewDrink(userId, patientId, 200, day, minutesSinceMidnight, minutesSinceMidnight + 30, 'Programatically added drink');

  const openDrinks = await getOpenDrinks(userId, patientId);
  console.log(openDrinks);

  const drinksToday = await getDrinksForDate(userId, patientId, day);
  console.log(drinksToday);

  // EXAMPLE FOR: finishOpenDrink(timeEnded, userId, patientId, fluidEntryId)
  //await finishOpenDrink(1100, userId, patientId, 2);

  const typicalProgress = await getTypicalProgress(
    userId,
    patientId,
    "2025-01-01",
    minutesSinceMidnight,
  );
  console.log(typicalProgress);

  return (
    <main>
      {session ? (
        <p>Signed In As, {session.user.name}!</p>
      ) : (
        <p>
          Please <Link href="login">sign in</Link> to view your data.
        </p>
      )}
      <div>
        <h1>Hello {user.email}</h1>
        <p>
          The fluid target for {patient["firstName"]} is{" "}
          {fluidTarget[0].millilitres}
        </p>

        {/* LIST PATIENTS FROM fetchPatients */}
        <h2>Your Patients:</h2>
        <ul>
          {patients.map((p) => (
            <li key={p.patientId}>
              {p.firstName} {p.lastName} (ID: {p.patientId})
            </li>
          ))}
        </ul>
        <p>
          By this time of day {patient["firstName"]} will typically have drunk{" "}
          {typicalProgress[0].average} however you may have drunk as little as{" "}
          {typicalProgress[0].min} or as much as {typicalProgress[0].max}.
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Started</th>
            <th>Finished</th>
            <th>Millilitres</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {drinksToday.map((drink, fluidEntryId) => (
            <tr key={fluidEntryId}>
              <td>{drink.date.toLocaleString()}</td>
              <td>{drink.timeStarted}</td>
              <td>{drink.timeEnded}</td>
              <td>{drink.millilitres}</td>
              <td>{drink.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default TestPage;
