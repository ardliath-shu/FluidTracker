import mysql from "mysql2/promise";
import connection from "./connection";



const fetchUser = async (user_id) => {
  try {
    const query = "select * from users where userId = ?"; 
    const [rows] = await connection.execute(query, [user_id]); 
    return rows;
  } catch (error) {
    console.error("Database Error:", error); 
    throw new Error("Failed to fetch data.");
  }
};

export { fetchUser };


const getMyPatientCurrentFluidTarget = async (user_id, patient_id) => {
  try {
    const query = `select r.userId, r.patientId, t.millilitres, t.effectiveFrom, t.effectiveTo
    from fluidtracker.fluidtargets t
    join fluidtracker.relationships r on t.patientId = r.PatientId
    where t.isActive = 1 and r.patientId = ? and r.userId = ?`; 

    const [rows] = await connection.execute(query, [patient_id, user_id]); 
    return rows;
  } catch (error) {
    console.error("Database Error:", error); 
    throw new Error("Failed to fetch data.");
  }
};

export { getMyPatientCurrentFluidTarget };

const setNewPatientFluidTarget = async (user_id, patient_id, target, change_date) => {
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

    const [updateRows] = await connection.execute(updateQuery, [change_date, patient_id, user_id]); 

const insertQuery = `INSERT INTO fluidtracker.fluidtargets (patientId, userId, effectiveFrom, isActive, millilitres, createdAt)
SELECT r.patientId, r.userId, ?, 1, ?, NOW()
FROM fluidtracker.relationships AS r
WHERE r.patientId = ?
  AND r.userId = ?;`;

  const [insertRows] = await connection.execute(insertQuery, [change_date, target, patient_id, user_id]); 

    await connection.commit();
    
  } catch (error) {
    await connection.rollback();
    console.error("Database Error:", error); 
    throw new Error("Failed to fetch data.");
  }
};

export { setNewPatientFluidTarget };