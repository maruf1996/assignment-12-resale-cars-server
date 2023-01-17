const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bmyfd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
    const categoryCollection = client.db('resaleClocks').collection('category');
    const usersCollection = client.db('resaleClocks').collection('users');
    const productsCollection = client.db('resaleClocks').collection('products');
    const bookingCollection = client.db('resaleClocks').collection('booking');

    // category start
    app.get('/category',async (req, res) => {
        const query={}
        const category=await categoryCollection.find(query).toArray();
        res.send(category)
    })

    // users start
    app.get('/users',async(req,res)=>{
      const query={};
      const users=await usersCollection.find(query).toArray();
      res.send(users)
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      res.send(user);
    })

    app.get('/allSellers', async (req, res) => {
      const query={};
      const users=await usersCollection.find(query).toArray();
      const sellers=users.filter(user=>user.accountType==='user')
      res.send(sellers);
    })

    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.put('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
            role:'admin'
          }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin' });
    })

    app.get('/users/seller/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.accountType === 'seller' });
    })

    // product start 
    app.get('/products',async(req,res)=>{
      const query={};
      const products=await productsCollection.find(query).toArray();
      res.send(products)
    })

    app.get('/products/:categoryName',async(req,res)=>{
      const categoryName=req.params.categoryName;
      const query={productCategory:categoryName};
      const products=await productsCollection.find(query).toArray();
      res.send(products)
    })

    app.get('/myProducts',async(req,res)=>{
      const email = req.query.email;
      const query = {sellerEmail: email};
      const products=await productsCollection.find(query).toArray();
      res.send(products)
    })

    app.post('/products',async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.get('/advertise',async (req, res) => {
      const query = {advertise:'advertise'};
      const result= await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.put('/products/advertise/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
            advertise: 'advertise'
          }
      }
      const result = await productsCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

     app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
    })

    // booking start 
    app.get('/booking', async (req, res) => {
      const email = req.query.email;
      const query = {buyerEmail: email};
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    app.get('/myBuyers', async (req, res) => {
      const email = req.query.email;
      const query = {sellerEmail:email};
      const myBuyers= await bookingCollection.find(query).toArray();
      res.send(myBuyers);
    });

    app.post('/booking',async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    })
  }
  finally{
  }
}

run().catch(err =>console.log(err))

app.get('/',async(req, res) => {
  res.send('resale cars server is running')
});

app.listen(port, () => {
  console.log(`resale cars running on port ${port}`)
});