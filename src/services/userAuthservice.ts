import {  PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SECRET_KEY =`${process.env.SECRET_KEY}`; 
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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






module.exports.registerPost=  async (req:any, res:any) => {
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
      const mail=  await transporter.sendMail(mailOptions);
      if (mail) {
        const newUser = await prisma.user.create({
          data: {
            email,
            name,
            confirmationCode,
            password:hashedPassword,
            role:"simple"
          },
        });   
        return res.json({ success: true, message: 'Confirmation email sent successfully.',newUser });
      }
     
   
     
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Error sending confirmation email.' });
    }}


    module.exports.confirm= async (req:any, res:any) => {
        const { email, code } = req.body;
      
        const user = await prisma.user.findUnique({
          where: { email },
        });
      
     
        if (user && user.confirmationCode === code) {
       
          await prisma.user.update({
            where: { email },
            data: { confirmationCode: null },
          });
      
        
         const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });
      
          return res.json({ success: true, message: 'Email confirmed successfully.',token});
        } else {
          return res.status(400).json({ success: false, message: 'Invalid confirmation code.' });
        }
      } 


      module.exports.login=async(req:any,res:any)=>{
        const { email, password } = req.body;
        
      
        const user = await prisma.user.findUnique({
          where: { email }
        });
        
        if (!user) {
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        
      
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        
        
        const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });
        
        return res.json({ success: true, message: 'Login successful.', token });
        }


        module.exports.passwordoublie=async (req:any, res:any) => {
  
            try {
          
              const { email } = req.body;
           
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });
          
            if (existingUser) {
              const confirmationCode  = generateConfirmationCode();
              const mailOptions = {
                from: `${process.env.MY_EMAIL}`, 
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
          }



          module.exports.confirmpassword=async (req:any, res:any) => {
            try{
            const { email, code } = req.body;
          
           
            const user = await prisma.user.findUnique({
              where: { email },
            });
          
          
            if (user && user.confirmationCode === code) {
             
              await prisma.user.update({
                where: { email },
                data: { confirmationCode: null },
              });
          
             
             const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });
          
              return res.json({ success: true, message: 'Email confirmed successfully.',token});
            } else {
              return res.status(400).json({ success: false, message: 'Invalid confirmation code.' });
            }
          } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error server' });
          }
          }


          module.exports.updatepassword=async (req:any, res:any) => {
            try {
            const { password  } = req.body;
          
            const hashedPassword = await bcrypt.hash(password, 10);
          
              await prisma.user.update({
                where: { email:req.user.email },
                data: { password: hashedPassword },
              });
          
              const user = await prisma.user.findUnique({
                where: { email:req.user.email },
              });
          
             
            
             const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });
          
              return res.json({ success: true, message: 'password update successfully.',token});
            } catch (error) {
              console.error(error);
              return res.status(500).json({ success: false, message: 'Error server' });
            }
           
          }

          module.exports.registerSeller= async (req:any, res:any) => {
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
          }


          module.exports.confirmSeller= async (req:any, res:any) => {
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
            
             const token = jwt.sign({ user: newUser }, SECRET_KEY, { expiresIn: '7d' });
          
              return res.json({ success: true, message: 'Email confirmed successfully.',token});
            } else {
              return res.status(400).json({ success: false, message: 'Invalid confirmation code.' });
            }
          }


          module.exports.sellerSteps=async(req:any,res:any)=>{

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
           
           }
           
           res.status(200).json({ success: true, message: 'demande seller success' });  
           
           }catch (error) {
           console.error(error);
              return res.status(500).json({ success: false, message: 'Error server' });
            }
           }


           module.exports.getUser=async(req:any,res:any)=>{
            const user = req.user 
            res.json({ sucess:true, user})
          }