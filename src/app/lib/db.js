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