import * as express from "express"
const router = express.Router();
const multer = require('multer');

const {Storage} = require('../upload/cloudinary')

const upload = multer({ storage:Storage })

const verifyToken = require('../verifyTokens/verifyToken');

const profilupdateservice=require('../services/profilupdateservice')



router.patch('/updatedImages',upload.single('file'),verifyToken,profilupdateservice.updateImageProfil)

router.get('/userInfo',verifyToken,profilupdateservice.getUserInfo)

router.put('/updatelocation',verifyToken,profilupdateservice.updateLocation)


router.patch('/updatecountry',verifyToken,profilupdateservice.updateCountry)

router.patch('/updateemail',verifyToken,profilupdateservice.updateEmail)

router.patch('/resendcode',verifyToken,profilupdateservice.resendCode)

router.patch('/updateconfirmemail',verifyToken,profilupdateservice.updateConfirmationEmail)

router.patch('/updateconfirmenewmail',verifyToken,profilupdateservice.updateNewEmail)


router.patch('/updatepassword',verifyToken,profilupdateservice.updatePassword)

router.patch('/resendcodepassword',verifyToken,profilupdateservice.resendCodePassword)

router.patch('/updateconfirmpassword',verifyToken,profilupdateservice.updateConfirmPassword)

router.patch('/updateconfirmenewpassword',verifyToken,profilupdateservice.confirmNewPassword)


router.put('/updatelocationuser',verifyToken,profilupdateservice.updateLocationUser)

router.delete('/deleteuserInfo',verifyToken,profilupdateservice.deleteUserInfo)

router.post('/createlocationuser',verifyToken,profilupdateservice.createLocationUser)






module.exports = router;


