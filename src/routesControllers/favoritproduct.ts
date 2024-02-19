import * as express from "express"
const router = express.Router();
const multer = require('multer');

const {Storage} = require('../upload/cloudinary')

const upload = multer({ storage:Storage })

const verifyToken = require('../verifyTokens/verifyToken');

const favoritproductservice=require('../services/favoritproductservice')



router.post('/favoritproduct',verifyToken,favoritproductservice.addFavoritProduct)

router.delete('/deletefavoritproduct',verifyToken,favoritproductservice.deleteFavoritProduct)

router.get('/getfavoritproduct',verifyToken,favoritproductservice.getFavoritProduct)

router.delete('/deletefavoritlist',verifyToken,favoritproductservice.deleteFavoritList)


module.exports = router;