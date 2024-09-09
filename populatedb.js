const {Client}=require("pg");

require("dotenv").config();

const SQL = `

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) NOT NULL UNIQUE ,
    firstname VARCHAR(255) NOT NULL ,
    lastname VARCHAR(255) NOT NULL ,
    member BOOLEAN DEFAULT FALSE ,
    admin BOOLEAN DEFAULT FALSE ,
    password VARCHAR(255)

);

CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(id) NOT NULL ,
    title VARChAR(100) NOT NULL ,
    POST TEXT NOT NULL,
    added TIMESTAMP NOT NULL
);

`;



async function main() {
    console.log("seeding...");
    console.log("Starting Connection.....");
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    console.log("Client Created.........")
    await client.connect();
    console.log("Connection Established....")
    await client.query(SQL);
    console.log("Query Executed.........")
    await client.end();
    console.log("done");
  }
  
main();
