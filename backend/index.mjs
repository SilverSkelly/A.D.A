//Import LLM Tools Libraries
import { JsonLoader, RAGApplicationBuilder } from '@llm-tools/embedjs';
import { Ollama, OllamaEmbeddings } from '@llm-tools/embedjs-ollama';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { PdfLoader } from '@llm-tools/embedjs-loader-pdf';
import { CsvLoader } from '@llm-tools/embedjs-loader-csv';
import { MongoDb } from '@llm-tools/embedjs-mongodb';
import { HNSWDb } from '@llm-tools/embedjs-hnswlib';
import { HuggingFace } from '@llm-tools/embedjs-huggingface';
import { HuggingFaceEmbeddings } from '@llm-tools/embedjs-huggingface';
import CORS from 'cors';
import multer from 'multer';
// import upload from './uploadfiles.mjs';
import parseLargeUProject from './uploadfiles.mjs';

//Express Library builds the HTTP Server
import express from "express";
//MongoDB library for connecting to a Database to store Vectors 
import { MongoClient } from 'mongodb';
//dotenv enables the app to read environment variables
import dotenv from 'dotenv';
// import { fstat } from 'fs-extra';
//This loads the .env file and system environment variables into process.env
dotenv.config();

//Assign the .env values to variables we can use
const dbuser = process.env.dbUsername; //database username
const dbpwd = process.env.dbPwd; //database password
const dbconnection = process.env.dbConnection || ``; //database connection string
const HUGGINGFACEHUB_API_KEY = process.env.HUGGINGFACEHUB_API_KEY;

var upload = multer({storage :storage});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        /**
         * @param {function} cb: callback function
         */
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
      }
});

//Uncomment the following line to help debug any .env issues
// console.log(`debug\n${dbuser}\n${dbpwd}\n${dbconn}`);

//create an express app and set the port number for it to 3000
const app = express();
const port = 3000;
//enable to app to send/receive json
app.use(express.json());
app.use(CORS());

const local = true; // if false, it will call the Azure Link, which is pretty slow

// const deepseekUrl = local ? "http://localhost:11434" : "https://llama.delightfulwater-6fda5743.centralus.azurecontainerapps.io/"

//Initialize the EmbedJS RAG object
const ragApplication = await new RAGApplicationBuilder()
.setModel(new HuggingFace({ modelName: "deepseek-ai/deepseek-coder-1.3b-instruct"}))
.setEmbeddingModel(new HuggingFaceEmbeddings({key: HUGGINGFACEHUB_API_KEY, modelName: "deepseek-ai/deepseek-coder-1.3b-instruct"}))
.setVectorDatabase(new MongoDb({
    connectionString: dbconnection,
}))
.build();

// console.log(typeof upload.array);

let client = new MongoClient(dbconnection);
await client.connect();
// Evol data

const evol_db = client.db('Evol80k'); //specify database
const evol_collection = evol_db.collection('evol80k'); //specify collection
const evol_data = await evol_collection.find().toArray(); //

// Unreal Data
const unreal_db = client.db('UnrealCode');
const unreal_collection = unreal_db.collection('unreal_code_data');
const unreal_data = await unreal_collection.find().toArray();

await ragApplication.addLoader(new JsonLoader({object: evol_data}));
await ragApplication.addLoader(new JsonLoader({object: unreal_data}));

await client.close()


const greetings = "Hello, I'm your Unreal Debugger Assistant!";
console.log(greetings);

//Express Routes
app.get("/", async (req, res) => {
    res.send(greetings);
  });

  //route to handle file upload
// app.post('upload', upload.single(file), async (req, res, next) => {
//   //TODO
  
//   res.send(`file uploaded: ${req.file}`) 
// })

app.post("/upload-multiple", upload.array("files", 5) , async function (req, res, next){
  const stringified_Files = []
  
  req.files.forEach(file => {
    const project = parseLargeUProject(req, file);
    const projectString = JSON.stringify(project);
    stringified_Files.push(projectString)
  })


  ragApplication.query(` ${req.body.query} for the following array of files: ${JSON.stringify(stringified_Files)}`);
  res.send(`File uploaded: ${req.files.length} files.`);
});

app.post('/ask', async (req, res) => {

    /*
    This POST route takes in input with the following schema:
    {
        "query": "",
        "sources": [{
            "type": "",
            "link": "data OR http..."
        }]
    } 
    */
    console.log(req.body)
   
    console.log('Connected successfully to server');
   
    console.log('now let me process this, one moment please...');
    //Ask the AI model your question
    const result = await ragApplication.query(req.body.query);
    //Send the results back
    res.send(result);
});


//start the application
  app.listen(port, () => {
    console.log(`Listening @ http://localhost:3000 ...`);
  });