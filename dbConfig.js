import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database");
});

export async function query(sqlQuery) {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (error, results, fields) => {
      if (error) {
        console.error("Error executing query:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
