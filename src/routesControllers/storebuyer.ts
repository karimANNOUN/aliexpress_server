import * as express from "express"
const router = express.Router();
const multer = require('multer');

const {Storage} = require('../upload/cloudinary')

const upload = multer({ storage:Storage })

const verifyToken = require('../verifyTokens/verifyToken');

const storebuyerservice=require('../services/storebuyerservice')










router.post('/addstoreproduct',verifyToken,storebuyerservice.addStoreProduct)

router.get('/getstoreproduct',verifyToken,storebuyerservice.getStoreProduct)

router.delete('/deletestoreproduct',verifyToken,storebuyerservice.deleteStoreProduct)



module.exports = router;