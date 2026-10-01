import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    return res.send("This is working!");
});

app.listen(8080, () => {
    console.log("Server running on: http://localhost:8080/");
})