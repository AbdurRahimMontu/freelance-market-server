const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Server is running')
})



const uri = "mongodb+srv://freelanceDB:Y6EV6vWqWHntom8S@cluster0.juobova.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
   
    const db = client.db('freelancerDB')
    const freelancer = db.collection('freelancers')

 app.get('/allJobs', async (req,res)=>{
    const result = await freelancer.find().toArray()
    res.send(result)
})













    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`Port is Running No ${port}`);
})