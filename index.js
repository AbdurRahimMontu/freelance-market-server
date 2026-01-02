const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config()


app.use(cors());
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.juobova.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const db = client.db('freelancerDB')
    const freelancer = db.collection('freelancers')

 app.get('/allJobs', async (req,res)=>{
    const result = await freelancer.find().toArray()
    res.send(result)
})

 app.get('/allJobs/:id', async (req,res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await freelancer.findOne(query)
    res.send(result)
})

app.put('/updateJobs/:id', async(req,res)=>{
  const id = req.params.id 
  const data = req.body
  const query = {_id: new ObjectId(id)}
  const update ={
    $set : data,
  }
  const result = await freelancer.updateOne(query,update)
  res.send(result)
 })

  app.post('/allJobs',async(req,res)=>{
  const data = (req.body)
  const result =await freelancer.insertOne(data)
  res.send(result)
 })


app.get('/latestJobs', async(req,res)=>{
const result=await freelancer.find().sort({postedDate: -1}).limit(8).toArray()
res.send(result)
})



 app.get('/myPostedJobs', async(req,res)=>{
    const email = req.query.email
    const result= await freelancer.find({email: email}).toArray()
    res.send(result)
  })

app.delete('/allJobs/:id', async(req,res)=>{
   const id = req.params.id
   const query = {_id: new ObjectId(id)}
   const result = await freelancer.deleteOne(query)
   res.send(result)
})

app.put("/allJobs/:id/accept", async (req, res) => {
  const id = req.params.id;
  const {userEmail} = req.body;
  const result = await freelancer.updateOne(
    { _id: new ObjectId(id) },
    { $addToSet: { acceptedBy: userEmail } } 
  );
  console.log(result);
  res.send(result);
});


app.get("/myAcceptedTasks", async (req, res) => {
  const { userEmail } = req.query;
  const result = await freelancer.find({ acceptedBy: userEmail }).toArray();
  res.send(result);
});

app.delete("/myAcceptedTasks/:id", async (req, res) => {
  const id = req.params.id;
  const userEmail = req.query.email;
 const result = await freelancer.updateOne(
    { _id: new ObjectId(id) },
    { $pull: { acceptedBy: userEmail } }
  );
  res.send(result);
});


    // await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`Port is Running No ${port}`);
})
