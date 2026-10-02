import express from "express";
import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    return res.send("This is working!");
});

app.get("/osztalyok", async (req, res) => {
    try {
        const rawData = await fs.readFile("data.json", "utf-8");
        const jsonData = JSON.parse(rawData);

        return res.status(200).json(jsonData);
    } catch (err) {
        console.error(err)
    }
});

app.post("/osztalyok", async (req, res) => {
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

app.delete("/osztalyok/:id", async (req, res) => {
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
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.get("/diakok", async (req, res) => {
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

app.post("/diakok", (req, res) => {

});

app.listen(8080, () => {
    console.log("Server running on: http://localhost:8080/");
});