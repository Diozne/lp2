import express from "express";
import { MongoClient } from 'mongodb'

const app = express();
//conectando com o servidor MongoDB
const url = "mongodb://localhost:27017/";



// definindo a rota ajuda
app.get("/aleatoria", function (req, res) {
    MongoClient.connect(url)
        .then(db => {
            const dbo = db.db("musicasdb");
            dbo.collection("musicas").find({}).toArray()
                .then(result => {
                    db.close()
                    res.send(result[parseInt(Math.random()*result.length)])
                })
        });
});

// executando o servidor
app.listen(8081, function () {
    console.log("Servidor na porta 8081");
});
