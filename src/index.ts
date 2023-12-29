//@ts-nocheck

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
  
  };


import {  PrismaClient } from '@prisma/client'
import express from 'express'
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const verifyToken = require('./verifyTokens/verifyToken');
const multer = require('multer');
const {storage}= require('./upload/cloudinary')

const prisma = new PrismaClient()
const app = express()



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


  const upload = multer({ storage:storage })



const SECRET_KEY =`${process.env.SECRET_KEY}`; 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "localhost",
  port: 8000,
  secure:false,
  auth: {
    user: `${process.env.MY_EMAIL}`,
    pass: `${process.env.PASSWORD_GOOGLE}`
  },
});

function generateConfirmationCode() : any {
  return Math.floor(1000 + Math.random() * 9000).toString();
}


app.post('/register', async (req, res) => {
  const { email,name,password } = req.body;

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Generate confirmation code
  const confirmationCode  = generateConfirmationCode();

  // Create a new user with the confirmation code
 

  // Send confirmation email
  const mailOptions = {
    from: `${process.env.MY_EMAIL}`, // Replace with your Gmail address
    to: email,
    subject: 'Email Confirmation',
    text: `Your confirmation code is: ${confirmationCode}`, 
  };

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        confirmationCode,
        password:hashedPassword,
        role:"simple"
      },
    });
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Confirmation email sent successfully.',newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error sending confirmation email.' });
  }
});

app.post('/confirm', async (req, res) => {
  const { email, code } = req.body;

  // Retrieve the user from the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Verify the confirmation code
  if (user && user.confirmationCode === code) {
    // Clear the confirmation code in the database
    await prisma.user.update({
      where: { email },
      data: { confirmationCode: null },
    });

    // Generate a JWT token for the user
   // const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '24h' });
   const token = jwt.sign({ users: user }, SECRET_KEY, { expiresIn: '7d' });

    return res.json({ success: true, message: 'Email confirmed successfully.',token});
  } else {
    return res.status(400).json({ success: false, message: 'Invalid confirmation code.' });
  }
});



app.post('/login',async(req,res)=>{
const { email, password } = req.body;

// Find the user by email
const user = await prisma.user.findUnique({
  where: { email }
});

if (!user) {
  return res.status(401).json({ success: false, message: 'Invalid credentials.' });
}

// Check if the password is correct
const passwordMatch = await bcrypt.compare(password, user.password);

if (!passwordMatch) {
  return res.status(401).json({ success: false, message: 'Invalid credentials.' });
}


// Generate a JWT token for the user
const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });

return res.json({ success: true, message: 'Login successful.', token });
});




app.post('/passwordoblie', async (req, res) => {
  
  try {

    const { email } = req.body;
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const confirmationCode  = generateConfirmationCode();
    const mailOptions = {
      from: `${process.env.MY_EMAIL}`, // Replace with your Gmail address
      to: email,
      subject: 'Email Confirmation',
      text: `Your confirmation code is: ${confirmationCode}`, 
    };

    const newUser = await prisma.user.update({
      where: { email },
      data: {
        confirmationCode
      },
    });

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: 'Confirmation email sent successfully.',existingUser });
  }if (!existingUser) {
    return res.status(400).json({ success: false, message: "User doesn't exists." });
  }   
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error sending confirmation email.' });
  }
});





app.post('/confirmpassword', async (req, res) => {
  try{
  const { email, code } = req.body;

  // Retrieve the user from the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Verify the confirmation code
  if (user && user.confirmationCode === code) {
    // Clear the confirmation code in the database
    await prisma.user.update({
      where: { email },
      data: { confirmationCode: null },
    });

    // Generate a JWT token for the user
   // const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '24h' });
   const token = jwt.sign({ users: user }, SECRET_KEY, { expiresIn: '7d' });

    return res.json({ success: true, message: 'Email confirmed successfully.',token});
  } else {
    return res.status(400).json({ success: false, message: 'Invalid confirmation code.' });
  }
} catch (error) {
  console.error(error);
  return res.status(500).json({ success: false, message: 'Error server' });
}
});



app.post('/updatepassword',verifyToken ,async (req, res) => {
  try {
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email:req.user.email },
      data: { password: hashedPassword },
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

   
 
   const token = jwt.sign({ users: user }, SECRET_KEY, { expiresIn: '7d' });

    return res.json({ success: true, message: 'password update successfully.',token});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error server' });
  }
 
});



app.post('/registerseller', async (req, res) => {
  const { email,name,password,state } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  

  const confirmationCode  = generateConfirmationCode();


 

  
  const mailOptions = {
    from: `${process.env.MY_EMAIL}`, 
    to: email,
    subject: 'Email Confirmation',
    text: `Your confirmation code is: ${confirmationCode}`, 
  };

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        confirmationCode,
        password:hashedPassword,
        role:"seller attente1",
        state,
      },
    });
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Confirmation email sent successfully.',newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error sending confirmation email.' });
  }
});


app.post('/confirmseller', async (req, res) => {
  const { email, code } = req.body;


  const user = await prisma.user.findUnique({
    where: { email },
  });


  if (user && user.confirmationCode === code) {
    
    await prisma.user.update({
      where: { email },
      data: { confirmationCode: null },
    });

    const newUser=await prisma.user.findUnique({
      where: { email },
    });
  
   const token = jwt.sign({ users: newUser }, SECRET_KEY, { expiresIn: '7d' });

    return res.json({ success: true, message: 'Email confirmed successfully.',token});
  } else {
    return res.status(400).json({ success: false, message: 'Invalid confirmation code.' });
  }
});


app.post('/sellerstep',upload.array('file'),verifyToken,async(req,res)=>{
  try {
   const companySeller = await prisma.entreprise.create({
    data: {
      userId:req.user.user.id,
      imageStatus:req.files[0].path,
      entrepriseType:req.body.statusType,
      raisonSociale :req.body.raisonSocial,
      numberSirene :req.body.numberSirene,
      certificatEntreprise :req.files[1].path,
      tvaNumber : req.body.tva,
      pays :req.body.pays,
      stateEntreprise :req.body.stateEntreprise,
      commune :req.body.commune, 
      postalCode :req.body.postalCode,
      rueNumber :req.body.rueNumber,
      industryType :req.body.industryType,
      businessManager :req.body.businessManager,
      certificatType :req.body.certificatType,
      certificatNumber :req.body.certificatNumber,
      entreprisePhoneNumber :req.body.societePhone
      
    },
  });

   
  const reprisentativeSeller = await prisma.legalrepresentative.create({
    data: {
  userlegalId:req.user.user.id,
  completeName :req.body.completeName,
  nationality :req.body.nationality,
  nativeCountry :req.body.nativeContry,
  birthday :req.body.birthday,
  pays :req.body.paysLegal,
  state :req.body.state,
  commune :req.body.communeLegal,
  postalCode :req.body.postalCodeLegal,
  certificatResidence :req.files[2].path,
  identityType :req.body.identityType,
  identityTypeNumber :req.body.identityNumber,
  identityImages :req.files[3].path,
  legalPhoneNumber :req.body.reprisentativePhone,
  expireIdentity :req.body.expire

     
    },
  });

  if ( companySeller && reprisentativeSeller ) {

    const reprisentativeSeller = await prisma.user.update({
      where: { id:req.user.user.id },
      data:{
        role: "seller attente2"
      }

    })

   
       
    return res.status(200).json({ success: true, message: 'demande seller success' });      
 

  }


}catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error server' });
  }


})

app.get('/user',verifyToken,async(req,res)=>{
  const user = req.user
  res.json({ sucess:true, user})
})

   

app.listen(8000, () =>
  console.log(`🚀Server ready at: http://localhost:8000`))
