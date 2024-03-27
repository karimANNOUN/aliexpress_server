//@ts-nocheck

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
  
  };


import express from 'express'
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()

 const userAuth=require('./routesControllers/userAuth')
 const product=require('./routesControllers/product')
 const storeBayer=require('./routesControllers/storebuyer')
 const favoritProduct=require('./routesControllers/favoritproduct')
 const profileUpdate=require('./routesControllers/profilupdate')
 const storePayer=require('./routesControllers/storepayer')
 const storeSeller=require('./routesControllers/storeseller')
 const paymentBayer=require('./routesControllers/payment')
 

app.use(bodyParser.json());

app.use(cors({
  origin:`${process.env.REACT_APP_HOST}`,
  credentials:true
}));

app.use(express.json())

app.use((req:Request, res:Response, next:any) => {
    res.setHeader("Access-Control-Allow-Origin",`${process.env.REACT_APP_HOST}`);
    res.setHeader("Access-Control-Allow-Methods", "DELETE,POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
  })


 


app.use('/',userAuth)
app.use('/',product)
app.use('/',storeBayer)
app.use('/',favoritProduct)
app.use('/',profileUpdate)
app.use('/',storePayer)
app.use('/',storeSeller)
app.use('/',paymentBayer)




              


app.listen(8000, () =>
  console.log(`🚀Server ready at: http://localhost:8000`)) 
