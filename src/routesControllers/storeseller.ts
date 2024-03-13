import * as express from "express"
const router = express.Router();
const multer = require('multer');

const {storage} = require('../upload/cloudinary')

const upload = multer({ storage:storage })

const verifyToken = require('../verifyTokens/verifyToken');

const storesellerservice=require('../services/storesellerservice')



router.get('/store/:storeId',storesellerservice.getStoreSeller)
router.get('/store/new/:storeId',storesellerservice.getNewProductSeller)
router.get('/store/all/:storeId',storesellerservice.getAllProductSeller)
router.get('/store/latest/:storeId',storesellerservice.getNewCollectionProductSeller)
router.get('/seller/getprod',verifyToken,storesellerservice.getProductSeller)
router.get('/seller/getprod/:prodId',verifyToken,storesellerservice.getProductSellerUnique)

router.put('/updatedimages',upload.single('file'),verifyToken,storesellerservice.updatedPropertiesImages)
router.patch('/updateprice',verifyToken,storesellerservice.updatedPrice)
router.patch('/updatesolde',verifyToken,storesellerservice.updatedSolde)
router.patch('/updatedescription',verifyToken,storesellerservice.updatedDescription)


router.patch('/updatedescriptiontitleone',verifyToken,storesellerservice.updatedDescriptionTitleOne)
router.patch('/updatedescriptiontitletwo',verifyToken,storesellerservice.updatedDescriptionTitleTwo)




module.exports = router;