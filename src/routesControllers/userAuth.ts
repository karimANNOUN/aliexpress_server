const express = require('express');
const router = express.Router();
const multer = require('multer');

const {Storage} = require('../upload/cloudinary')

const upload = multer({ storage:Storage })

const verifyToken = require('../verifyTokens/verifyToken');
const userAuthservice=require('../services/userAuthservice')


router.post('/register',userAuthservice.registerPost)
router.post('/confirm',userAuthservice.confirm)
router.post('/login',userAuthservice.login)
router.post('/passwordoblie',userAuthservice.passwordoublie)
router.post('/confirmpassword',userAuthservice.confirmpassword)
router.post('/updatepassword',verifyToken,userAuthservice.updatepassword)
router.post('/registerseller',userAuthservice.registerSeller)
router.post('/confirmseller',userAuthservice.confirmSeller)
router.post('/sellerstep',upload.array('file'),verifyToken,userAuthservice.sellerSteps)


router.get('/user',verifyToken,userAuthservice.getUser)


module.exports = router;