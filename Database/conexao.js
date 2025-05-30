import mysql from "mysql2/promise";

async function bancoDados() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "etecembu@123",
    port: 3306,
    database: "creativault"
  });
}

export default { bancoDados };
