const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
// const { ObjectID } = require('bson');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.giumd.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const disneyItems = client.db(`${process.env.DB_DATABASE}`).collection("Items");
    app.post('/addDisney',(req, res)=>{
        const backgroundImg = req.body.backgroundImg;
        const cardImg = req.body.cardImg;
        const description = req.body.description;
        const subTitle = req.body.subTitle;
        const title = req.body.title;
        const titleImg = req.body.titleImg;
        const type = req.body.type;
       
        disneyItems.insertOne({backgroundImg,cardImg,description,subTitle,title,titleImg,type})
        .then(result=>{
            res.send(result.insertedCount>0);
          })
      })
      app.get("/viewDisney", (req, res) => {
        disneyItems.find({ type: req.query.type }).toArray((error, documents) => {
          res.send(documents);
        });
      });

      app.get('/detail/:id', (req, res) => {
        disneyItems.find({ _id: ObjectId(req.params.id)})
        .toArray((error, documents) => {
          res.send(documents[0]);
        })
      })
  });
  
  
  
  app.get('/', (req, res) =>{
      res.send("hello from db it's working working")
  })
  app.listen(process.env.PORT || port)