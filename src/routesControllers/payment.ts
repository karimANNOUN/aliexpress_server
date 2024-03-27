import * as express from "express"
const router = express.Router();


const verifyToken = require('../verifyTokens/verifyToken');
const paymentservice=require('../services/paymentservice')






// router.post('/createpayment',verifyToken,paymentservice.createPayment)

router.post('/create-paypal-order',verifyToken,paymentservice.paypalOrder) 

router.post('/capture-paypal-order',verifyToken,paymentservice.captureOrder)






module.exports = router;