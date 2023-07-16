const express = require('express');
const app = express();
const port = process.env.PORT || 1010;
const cors = require('cors');
require('dotenv').config();

//  Middleware___________

app.use(cors());
app.use(express.json());

// _______________
app.get('/', (req, res) => {
  res.send('Welcome to M-kit backend server');
});

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgyk5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db('Medi-kits');
    const cardCollection = database.collection('card-products');
    const featureCollection = database.collection('feature-products');
    const newCollection = database.collection('new-products');
    const buyerInfo = database.collection('buyer-info');

    // Latest Products ______________

    app.get('/latest', async (req, res) => {
      const cursor = newCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });

    // Feature Products ______________

    app.get('/feature', async (req, res) => {
      const cursor = featureCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });

    // Finding single product from stored products______

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product =
        (await featureCollection.findOne(query)) ||
        (await newCollection.findOne(query));
      res.send(product);
    });

    // Post buyer info to data base_________

    app.post('/buyerinfo', async (req, res) => {
      const user = req.body;
      const result = await buyerInfo.insertMany(user);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('listening to the port', port);
});
