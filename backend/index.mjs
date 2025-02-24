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

//Express Library builds the HTTP Server
import express from "express";
//MongoDB library for connecting to a Database to store Vectors 
import { MongoClient } from 'mongodb';
//dotenv enables the app to read environment variables
import dotenv from 'dotenv';
//This loads the .env file and system environment variables into process.env
dotenv.config();

//Assign the .env values to variables we can use
const dbuser = process.env.dbUsername; //database username
const dbpwd = process.env.dbPwd; //database password
const dbconnection = process.env.dbConnection || ``; //database connection string with fake code
const HUGGINGFACEHUB_API_KEY = process.env.HUGGINGFACEHUB_API_KEY;

//Uncomment the following line to help debug any .env issues
// console.log(`debug\n${dbuser}\n${dbpwd}\n${dbconn}`);

//create an express app and set the port number for it to 3000
const app = express();
const port = 3000;
//enable to app to send/receive json
app.use(express.json());

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



const greetings = "Hello, I'm your Unreal Debugger Assistant!";
console.log(greetings);

//Express Routes
app.get("/", async (req, res) => {
    res.send(greetings);
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
   let client = new MongoClient(dbconnection);
   await client.connect();
   
   console.log('Connected successfully to server');

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
   
   console.log('thank you, let me review the resources you provided');
    
   //This loads in a variety of resources. Docs: https://llm-tools.mintlify.app/components/data-sources/overview
   req.body.sources.forEach(async (source) => {
       if (source.type == 'pdf') {
           await ragApplication.addLoader(new PdfLoader({ filePathOrUrl: source.link }))
           
       } else if (source.type == 'web') {
           await ragApplication.addLoader(new WebLoader({ urlOrContent: urlencoded.link }))

       } else if (source.type == 'csv') {
           await ragApplication.addLoader(new CsvLoader({ filePathOrUrl: source.link }))

       } else if (source.type == 'json') {
           //query database for data
           //returned info would be in JSON format and loaded for response
           let client = new MongoClient(dbconnection);
           await client.connect();
           console.log('Connected successfully to server');
           const db = client.db(''); //specify database
           const collection = db.collection(''); //specify collection
           const results = await collection.find(); //aggregate 
           await ragApplication.addLoader(new JsonLoader({object: results}));
           console.log('resource loaded: ');
           console.log('results');
       }
   });
   console.log('now let me process this, one moment please...');
   //Ask the AI model your question
   const result = await ragApplication.query(req.body.query);
   //Send the results back
   res.send(result);
});

    //console.log(req.body); //uncomment for debugging purposes


//start the application
  app.listen(port, () => {
    console.log(`Listening @ http://localhost:3000 ...`);
  });