import express from 'express';
import bearerToken from 'express-bearer-token';
const app = express()
import cors from 'cors';
import 'dotenv/config'
const port = process.env.PORT || 3000
import path from 'path';
//const octocatImage = path.join(process.cwd(), 'files', 'octocat.png');
const dir = path.resolve('public/octocat.png')


import OpenAI, { toFile } from 'openai';
import fs from 'fs';

const openai = new OpenAI();

var apiURL = "http://localhost:3000"

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.json());
app.use(bearerToken());
const secretKey = process.env.AUTH_KEY ||  "test123"



app.get('/api/octocat', async (req, res) => {
    const imageEdit = await openai.images.edit({
        image: fs.createReadStream(dir),
        prompt: req.query.prompt,
        n: 1,
        size:'1024x1024',
        response_format: 'b64_json'
    })
  res.send(imageEdit)
})


app.get('/api/apiurl', async (req, res) => {
  res.send({ "url": apiURL })
})

app.get('/api/status', async (req, res) => {
    res.send({ "status": "ok" })
  })


app.post('/api/apiurl', async (req, res) => {
    if(req.token == secretKey) {
        apiURL = req.body.url
        res.send({ "url": apiURL })
    }
    else {
        res.status(401).send({ error: 'Unauthorized' })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




