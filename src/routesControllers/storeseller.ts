import * as express from "express"
const router = express.Router();
const multer = require('multer');

const {Storage} = require('../upload/cloudinary')

const upload = multer({ storage:Storage })

const verifyToken = require('../verifyTokens/verifyToken');

const storesellerservice=require('../services/storesellerservice')



router.get('/store/:storeId',storesellerservice.getStoreSeller)
router.get('/store/new/:storeId',storesellerservice.getNewProductSeller)
router.get('/store/all/:storeId',storesellerservice.getAllProductSeller)
router.get('/store/latest/:storeId',storesellerservice.getNewCollectionProductSeller)



module.exports = router;