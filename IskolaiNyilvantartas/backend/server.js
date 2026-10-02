import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

const app = express();
app.use(express.json());

let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

app.get("/", (req, res) => {
    return res.send("This is working!");
});

app.get("/osztalyok", (req, res) => {
    con.connect(function(err) {
        if (err) return res.status(500).send(err)

        let sql = "SELECT * FROM osztalyok"
        con.query(sql, function (err, result) {
            if (err) return res.status(500).send(err)
            return res.status(200).json(result)
        });
    });
});

app.post("/osztalyok", (req, res) => {
    const {nev, szak, evfolyam} = req.body;
    if (!nev || !szak || !evfolyam) return res.status(400).send("Missing crutual data.");

    con.connect(function(err) {
        if (err) return res.status(500).send(err)

        let sql = "INSERT INTO osztalyok (nev, szak, evfolyam) values (?, ?, ?)";
        con.query(sql, [nev, szak, evfolyam], function(err, result) {
            if (err) return res.status(500).send(err)
            return res.status(201).send("Osztály létrehozva");
        });
    })
});

app.delete("/osztalyok/:id", (req, res) => {
    const id = req.params.id;

    con.connect(function(err) {
        if (err) throw new Error(err);

        let sql = "SELECT COUNT(id) AS diakszam FROM diakok WHERE osztaly_id = ?";
        con.query(sql, [id], function(err, result) {
            if (err) {
                return res.status(500).send(err)
            } else if (result[0].diakszam > 0) {
                return res.status(400).send("Az osztályt nem lehet törölni, mert még járnak bele diákok")
            } else {
                sql = "DELETE FROM osztalyok WHERE id = ?";
                con.query(sql, [id], function(err, result) {
                    if (err) throw new Error(err);
                    return res.status(200).send("Osztály törölve")
                });
            }
        })
    })
});

app.get("/osztalyok/:id/diakok", async (req, res) => {
    const id = req.params.id

    try {
        const rawData = await fs.readFile("data.json", "utf-8");
        const jsonData = JSON.parse(rawData);

        const diakok = jsonData.diakok;
        const szurtDiakok = [];
        diakok.forEach(element => {
            if (element.osztaly_id === parseInt(id)) {
                szurtDiakok.push(element)
            }
        });
        return res.status(200).json(szurtDiakok);
    } catch (error) {
        return res.status(500).send("Error: " + error);
    }
});

app.get("/diakok", (req, res) => {

});

app.post("/diakok", (req, res) => {

});

app.listen(8080, () => {
    console.log("Server running on: http://localhost:8080/");
});