const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port=process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json())

// mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdlhstb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

// create collection
const addedFoods =client.db('addedfoods').collection('allfoods')
// get addfoods


// filtering and shoting data by name and expire date
// filtering
// http://localhost:5000/addfoods?foodname=Pasta
// shorting:--
// http://localhost:5000/addfoods?sortField=foodquantity&sortOrder=desc
app.get('/addfoods',async(req,res)=>{
  let queryObj = {}
  let sortObj = {}
  const foodname =req.query.foodname;
  const sortField =(req.query.sortField)
  const sortOrder =(req.query.sortOrder)

if (foodname) {
  queryObj.foodname = foodname
}
// sort
if (sortField && sortOrder) {
  sortObj[sortField]= sortOrder
}

  const cursor = addedFoods.find(queryObj).sort(sortObj);
  const result = await cursor.toArray();
  res.send(result)
})
// post alladdedfoods

app.post('/addfoods', async(req,res)=>{
  const foods =req.body;
  console.log(foods);
  const result = await addedFoods.insertOne(foods)
  res.send(result);
})

// get data details


// get detail a item
// app.get('/addfoods/:id',async(req,res)=>{
//   const detail =req.params.detail;
//   const query ={_id: new ObjectId(detail)};
//   const user = await addedFoods.findOne(query);
//   res.send(user)
// })
app.get('/addfoods/:id', async (req, res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id) 
  };
  const result=await addedFoods.findOne(query)
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// mongodb
app.get('/',(req,res)=>{
    res.send('server is running')
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})