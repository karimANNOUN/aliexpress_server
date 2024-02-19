import * as express from "express"
const router = express.Router();
const multer = require('multer');

const {Storage} = require('../upload/cloudinary')

const upload = multer({ storage:Storage })

const verifyToken = require('../verifyTokens/verifyToken');
const productservice=require('../services/productservice')






router.post('/product',upload.any(),verifyToken,productservice.postProduct)

router.get('/getproduct',productservice.getProduct)
router.get('/getproduct/:id',productservice.getProductId)


module.exports = router;