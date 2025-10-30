import mysql from "mysql2/promise";
import connection from "./connection";

const fetchUser = async (user_id) => {
  try {
    const query = "SELECT * FROM user WHERE id = ?";
    const [rows] = await connection.execute(query, [user_id]);
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};
export { fetchUser };

const fetchPatient = async (user_id, patient_id) => {
  try {
    const query = `SELECT * 
    FROM patients p
    JOIN fluidtracker.relationships r ON p.patientId = r.PatientId
    WHERE r.userId = ? AND r.patientId = ?`;
    const [rows] = await connection.execute(query, [user_id, patient_id]);
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};
export { fetchPatient };

// Get list of patients for a user
const fetchPatients = async (user_id) => {
  try {
    const query = `SELECT p.* FROM patients p
    JOIN fluidtracker.relationships r ON p.patientId = r.PatientId
    WHERE r.userId = ?`;
    const [rows] = await connection.execute(query, [user_id]);
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};
export { fetchPatients };

const getMyPatientCurrentFluidTarget = async (user_id, patient_id) => {
  try {
    const query = `SELECT r.userId, r.patientId, t.millilitres, t.effectiveFrom, t.effectiveTo
    FROM fluidtracker.fluidtargets t
    JOIN fluidtracker.relationships r ON t.patientId = r.PatientId
    WHERE t.isActive = 1 AND r.patientId = ? AND r.userId = ?`;

    const [rows] = await connection.execute(query, [patient_id, user_id]);
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

const setNewPatientFluidTarget = async (
  user_id,
  patient_id,
  target,
  change_date,
) => {
  try {
    await connection.beginTransaction();

    const updateQuery = `UPDATE fluidtracker.fluidtargets AS t
JOIN fluidtracker.relationships AS r
  ON t.patientId = r.patientId
SET
  t.isActive = 0,
  t.effectiveTo = ?
WHERE
  t.isActive = 1
  AND r.patientId = ?
  AND r.userId = ?`;

    const [updateRows] = await connection.execute(updateQuery, [
      change_date,
      patient_id,
      user_id,
    ]);

    const insertQuery = `INSERT INTO fluidtracker.fluidtargets (patientId, userId, effectiveFrom, isActive, millilitres, createdAt)
SELECT r.patientId, r.userId, ?, 1, ?, NOW()
FROM fluidtracker.relationships AS r
WHERE r.patientId = ?
  AND r.userId = ?;`;

    const [insertRows] = await connection.execute(insertQuery, [
      change_date,
      target,
      patient_id,
      user_id,
    ]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

const logNewDrink = async (
  user_id,
  patient_id,
  millilitres,
  startDate,
  startTime,
  endTime,
  notes,
) => {
  const insertQuery = `INSERT INTO fluidtracker.fluidentries (patientId, userId, createdAt, millilitres, date, timeStarted, timeEnded, note)
SELECT r.patientId, r.userId, NOW(), ?, ?, ?, ?, ?
FROM fluidtracker.relationships AS r
WHERE r.patientId = ?
  AND r.userId = ?;`;

  const [insertRows] = await connection.execute(insertQuery, [
    millilitres,
    startDate,
    startTime,
    endTime,
    notes,
    patient_id,
    user_id,
  ]);
};

const getOpenDrinks = async (user_id, patient_id) => {
  const query = `SELECT fluidEntryId, millilitres, date, timeStarted, note
FROM fluidtracker.fluidentries e
JOIN fluidtracker.relationships AS r ON e.patientId = r.PatientId
WHERE r.patientId = ?
  AND r.userId = ?
  AND e.timeEnded IS NULL;`;

  const [rows] = await connection.execute(query, [patient_id, user_id]);
  return rows;
};

const finishOpenDrink = async (
  time_ended,
  user_id,
  patient_id,
  fluidEntryId,
) => {
  const updateQuery = `UPDATE fluidtracker.fluidEntries AS e
JOIN fluidtracker.relationships AS r
  ON e.patientId = r.patientId
SET
  e.timeEnded = ?
WHERE
  r.patientId = ?
  AND r.userId = ?
  AND e.timeEnded IS NULL
  AND e.fluidEntryId = ?`;

  const [updateRows] = await connection.execute(updateQuery, [
    time_ended,
    patient_id,
    user_id,
    fluidEntryId,
  ]);
};

const getTypicalProgress = async (user_id, patient_id, since_date, time) => {
  const query = `SELECT MIN(runningTotal) min, MAX(runningTotal) max, AVG(runningTotal) average
FROM
(
    SELECT date, SUM(millilitres) runningTotal
    FROM fluidtracker.fluidentries e
    JOIN fluidtracker.relationships AS r ON e.patientId = r.PatientId
    WHERE r.patientId = ?
    AND r.userId = ?
    AND e.date >= ?
    AND e.timeEnded < ?
    GROUP BY date
) d;`;

  const [rows] = await connection.execute(query, [
    patient_id,
    user_id,
    since_date,
    time,
  ]);
  return rows;
};

const getDrinksForDate = async (user_id, patient_id, date) => {
  const query = `SELECT fluidEntryId, millilitres, date, timeStarted, timeEnded, note
FROM fluidtracker.fluidentries e
JOIN fluidtracker.relationships AS r ON e.patientId = r.PatientId
WHERE r.patientId = ?
  AND r.userId = ?
  AND e.date = ?;`;

  const [rows] = await connection.execute(query, [patient_id, user_id, date]);
  return rows;
};

const getTotalForToday = async (user_id, patient_id) => {
  const query = `SELECT SUM(millilitres) AS totalMillilitres
FROM fluidtracker.fluidentries e
JOIN fluidtracker.relationships AS r ON e.patientId = r.PatientId
WHERE r.patientId = ?
  AND r.userId = ?
  AND e.date = ?
  AND e.timeEnded IS NOT NULL;`;
  const today = new Date().toISOString().split("T")[0];

  const [rows] = await connection.execute(query, [patient_id, user_id, today]);
  return rows;
};

export {
  getTotalForToday,
  getDrinksForDate,
  getOpenDrinks,
  logNewDrink,
  getMyPatientCurrentFluidTarget,
  setNewPatientFluidTarget,
  finishOpenDrink,
  getTypicalProgress,
};
