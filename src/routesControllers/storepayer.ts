import * as express from "express"
const router = express.Router();



const verifyToken = require('../verifyTokens/verifyToken');

const storepayerservice=require('../services/storepayerservice')



router.get('/getstorepayer',verifyToken,storepayerservice.getStorePayer)

router.post('/creatpayerproduct',verifyToken,storepayerservice.createStorePayer)

router.patch('/updateaddquantity',verifyToken,storepayerservice.updateAddQuantity)

router.patch('/updatemoinquantity',verifyToken,storepayerservice.moinQuantity)

router.delete('/deletestorepayer',verifyToken,storepayerservice.deleteStorePayer)





module.exports = router;