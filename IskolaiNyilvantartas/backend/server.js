import express from "express";
import dotenv from "dotenv";
import fs from "fs/promises";
import mysql from "mysql2";
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

app.get("/json/osztalyok", async (req, res) => {
    try {
        const rawData = await fs.readFile("data.json", "utf-8");
        const jsonData = JSON.parse(rawData);

        return res.status(200).json(jsonData);
    } catch (err) {
        console.error(err)
    }
});

app.post("/json/osztalyok", async (req, res) => {
    const {nev, szak, evfolyam} = req.body;

    if (!nev || !szak || !evfolyam) return res.status(400).send("Missing crutual data.");

    try {
        const rawData = await fs.readFile("data.json", "utf-8");
        const jsonData = JSON.parse(rawData);

        const osztalyok = jsonData.osztalyok;
        const diakok = jsonData.diakok;

        const newOsztaly = {
            id: osztalyok.length + 1,
            nev: nev,
            szak: szak,
            evfolyam: evfolyam
        }
        osztalyok.push(newOsztaly);

        const newJson = { osztalyok: osztalyok, diakok: diakok };
        await fs.writeFile("data.json", JSON.stringify(newJson, null, 4), "utf-8");

        return res.status(201).send("Class created.")
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.delete("/json/osztalyok/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const rawData = await fs.readFile("data.json", "utf-8");
        const jsonData = JSON.parse(rawData);

        const osztalyok = jsonData.osztalyok;
        const diakok = jsonData.diakok;

        let deiakExists = false;
        diakok.forEach(element => {
            if (element.id === parseInt(id)) {
                deiakExists = true;
            }
        });

        if (deiakExists) {
            return res.status(400).send("Error: Az osztályt nem lehet törölni, mert még járnak bele diákok.")
        } else {
            let index = 0
            let exists = false
            osztalyok.forEach(element => {
                if (element.id == id) {
                    osztalyok.splice(index, 1);
                    exists = true;
                }
                index += 1;
            });
        }

        const newJson = { osztalyok: osztalyok, diakok: diakok }
        await fs.writeFile("data.json", JSON.stringify(newJson, null, 4), "utf-8")

        if (exists == true) return res.status(200).send("Class deleted.");
        return res.status(400).send("Class does not exist.")
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.get("/json/osztalyok/:id/diakok", async (req, res) => {
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
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.get("/json/diakok", async (req, res) => {
    try {
        const rawData = await fs.readFile("data.json", "utf-8");
        const jsonData = JSON.parse(rawData);

        const osztalyok = jsonData.osztalyok;
        const diakok = jsonData.diakok;

        const diakokOsztalynevvel = [];
        diakok.forEach(diak => {
            osztalyok.forEach(osztaly => {
                if (osztaly.id === diak.osztaly_id) {
                    diakokOsztalynevvel.push({
                        id: diak.id,
                        nev: diak.nev,
                        email: diak.email,
                        osztalynev: osztaly.nev
                    });
                }
            });
        });

        return res.status(200).json(diakokOsztalynevvel);
    } catch (err) {
        return res.status(500).send(err)
    }
});

app.post("/json/diakok", async (req, res) => {
    const { nev, email, osztalyId } = req.body;

    try {
        const rawData = await fs.readFile("data.json", "utf-8");
        const jsonData = JSON.parse(rawData);

        const osztalyok = jsonData.osztalyok;
        const diakok = jsonData.diakok;

        diakok.push({
            id: diakok.length + 1,
            nev: nev,
            email: email,
            osztaly_Id: osztalyId
        });

        const newJson = { osztalyok: osztalyok, diakok: diakok };
        await fs.writeFile("data.json", JSON.stringify(newJson, null, 4), "utf-8");
        return res.status(201).send("Diák hozzáadva")
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.get("/mysql/osztalyok", (req, res) => {
    con.connect(function(err) {
        if (err) return res.status(500).send(err)

        let sql = "SELECT * FROM osztalyok"
        con.query(sql, function (err, result) {
            if (err) return res.status(500).send(err)
            return res.status(200).json(result)
        });
    });
});

app.post("/mysql/osztalyok", (req, res) => {
    const { nev, szak, evfolyam } = req.body;
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

app.delete("/mysql/osztalyok/:id", (req, res) => {
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

app.get("/mysql/osztalyok/:id/diakok", async (req, res) => {
    const id = req.params.id;

    con.connect(function(err) {
        if (err) return res.status(500).send(err);

        let sql = "SELECT * FROM diakok d INNER JOIN osztalyok o ON d.osztaly_id = o.id WHERE o.id = ?";
        con.query(sql, [id], function(err, result) {
            if (err) return res.status(500).send(err);
            return res.status(200).json(result);
        });
    });
});

app.get("/mysql/diakok", (req, res) => {
    con.connect(function(err) {
        if (err) return res.status(500).send(err);

        let sql = "SELECT d.id as id, d.nev as nev, d.email as email, o.nev as osztalynev FROM diakok d INNER JOIN osztalyok o ON d.osztaly_id = o.id";
        con.query(sql, function(err, result) {
            if (err) return res.status(500).send(err);
            return res.status(200).json(result);
        });
    });
});

app.post("/mysql/diakok", (req, res) => {
    const { nev, email, osztalyId } = req.body;

    con.connect(function(err) {
        if (err) return res.status(500).send(err);

        let sql = "INSERT INTO diakok (nev, email, osztaly_id) VALUES (?, ?, ?)";
        con.query(sql, [nev, email, osztalyId], function(err, result) {
            if (err) return res.status(500).send(err);
            return res.status(201).send("Diák felvéve");
        })
    })
});

app.listen(8080, () => {
    console.log("Server running on: http://localhost:8080/");
});