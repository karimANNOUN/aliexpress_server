

import {  PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const SECRET_KEY =`${process.env.SECRET_KEY}`; 
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


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






module.exports.updateImageProfil=async(req:any,res:any)=>{
    try{
     const findUser:any=await prisma.user.findUnique({
       where:{
         id:req.user.user.id
       }
     })
   
   
   
     if (findUser.imageProfle == null ) {
       await prisma.user.update({
         where:{
           id:req.user.user.id
         },
         data:{
           imageProfle:req.file.path
         }
       })
   
       res.status(200).json({ success: true, message: 'image updated successfully'});  
   
   
     }if (findUser.imageProfle !== null) {
       await prisma.user.update({
         where:{
           id:req.user.user.id
         },
         data:{
           imageProfle:req.file.path
         }
       })
   
       res.status(200).json({ success: true, message: 'image updated successfully'});  
   
     }
   }catch (error) {
     console.error(error);
        return res.status(500).json({ success: false, message: 'Error server' });
      }
   
    }




    module.exports.getUserInfo=async(req:any,res:any)=>{
        try{
        
          const userInfo=await prisma.user.findUnique({
            where:{id:req.user.user.id},
            select:{
              id:true,
              email:true,
              name:true ,
              state:true,
              imageProfle:true,
              gender:true,
              locationUser:true
            }
          })
         
      
          if (userInfo) {
            res.status(200).json({ success: true, message: 'user information updated successfully',userInfo});
          }
      
       
        
        
        
        
         }catch (error) {
           console.error(error);
              return res.status(500).json({ success: false, message: 'Error server' });
            }
       }



       module.exports.updateLocation=async(req:any,res:any)=>{
        try{
        
        const {wilaya,country,commune,name,gender,adress,postalCode,phoneNumber}=req.body
      
      
        const updatedUser= await prisma.user.update({
          where:{id:req.user.user.id},
          data:{
            name:name,
            gender:gender,
            state:wilaya
          }
        })
      
        const updatelocation= await prisma.location.findUnique({
          where:{userlocationId:req.user.user.id},
        })
      
      
      if (updatelocation == null) {
        const newLocation= await prisma.location.create({
          data:{
            userlocationId:req.user.user.id,
            country:country,
            rueAdress:adress,
            commune:commune,
            postalCode:postalCode,
            phoneNumber:country.phone+phoneNumber
          }
        })
        if (newLocation) {
          const userInfo=await prisma.user.findUnique({
            where:{id:req.user.user.id},
            select:{
              id:true,
              email:true,
              name:true ,
              state:true,
              imageProfle:true,
              gender:true,
              locationUser:true
            }
          })
          res.status(200).json({ success: true, message: 'user information updated successfully',userInfo});  
        }
       
      }if (updatelocation !== null) {
        const updatedLocation= await prisma.location.update({
          where:{userlocationId:req.user.user.id},
          data:{
            country:country,
            rueAdress:adress,
            commune:commune,
            postalCode:postalCode,
            phoneNumber:country.phone+phoneNumber
          }
        })
        if (updatedLocation) {
          const userInfo=await prisma.user.findUnique({
            where:{id:req.user.user.id},
            select:{
              id:true,
              email:true,
              name:true ,
              state:true,
              imageProfle:true,
              gender:true,
              locationUser:true
            }
          })
          res.status(200).json({ success: true, message: 'user information updated successfully',userInfo});  
        }
      }
      
      
      
       }catch (error) {
         console.error(error);
            return res.status(500).json({ success: false, message: 'Error server' });
          }
       
        }


        module.exports.updateCountry=async(req:any,res:any)=>{
            try{
            
            const {country}=req.body
          
         
          
          
            const updatelocation= await prisma.location.findUnique({
              where:{userlocationId:req.user.user.id},
            })
          
          
          if (updatelocation == null) {
            const newLocation= await prisma.location.create({
              data:{
                userlocationId:req.user.user.id,
                country:country.label,
              }
            })
            if (newLocation) {
              const userInfo=await prisma.user.findUnique({
                where:{id:req.user.user.id},
                select:{
                  id:true,
                  email:true,
                  name:true ,
                  state:true,
                  imageProfle:true,
                  gender:true,
                  locationUser:true
                }
              })
              res.status(200).json({ success: true, message: 'user information updated successfully',userInfo});  
            }
           
          }if (updatelocation !== null) {
            const updatedLocation= await prisma.location.update({
              where:{userlocationId:req.user.user.id},
              data:{
                country:country.label
              }
            })
            if (updatedLocation) {
              const userInfo=await prisma.user.findUnique({
                where:{id:req.user.user.id},
                select:{
                  id:true,
                  email:true,
                  name:true ,
                  state:true,
                  imageProfle:true,
                  gender:true,
                  locationUser:true
                }
              })
              res.status(200).json({ success: true, message: 'user information updated successfully',userInfo});  
            }
          }
          
          
          
           }catch (error) {
             console.error(error);
                return res.status(500).json({ success: false, message: 'Error server' });
              }
           
            }



            module.exports.updateEmail=async(req:any,res:any)=>{
                try{
                
                const {email}=req.body
              
               
             
               const confirmationCode  = generateConfirmationCode();
          
            
            const mailOptions = {
              from: `${process.env.MY_EMAIL}`, 
              to: email,
              subject: 'Email Confirmation',
              text: `Your confirmation code is: ${confirmationCode}`, 
            };
          
            const mail=  await transporter.sendMail(mailOptions);
            if (mail) {
              const newUser = await prisma.user.update({
                where:{id:req.user.user.id},
                data: {
                 
                  confirmationCode,
               
                },
              })
          
              if (newUser) {
          
               res.json({ success: true, message: 'Confirmation code sent successfully.'});
              
              }
          
            }
              
               }catch (error) {
                 console.error(error);
                    return res.status(500).json({ success: false, message: 'Error server' });
                  }
               
                }



                module.exports.resendCode=async(req:any,res:any)=>{
     
                    try{
            
                   const updatedCode=  await prisma.user.update({
                        where:{id:req.user.user.id},
                        data: {
                         
                          confirmationCode:null,
                       
                        },
                      })
            
                      if (updatedCode) {
                        res.json({ success: true, message: 'Confirmation code deleted sent successfully.'});
                      }
            
                    }catch (error) {
                   console.error(error);
                      return res.status(500).json({ success: false, message: 'Error server' });
                    }
                  }


                  module.exports.updateConfirmationEmail=async(req:any,res:any)=>{
     
                    try{
            
                      const {selectedCode,email}=req.body
            
                      const user:any = await prisma.user.findUnique({
                        where: { email },
                      });
                    
                    
                      if (user.confirmationCode === selectedCode) {
                        
                        await prisma.user.update({
                          where: { email },
                          data: { confirmationCode: null },
                        });
            
                      
                        res.json({ success: true, message: 'Confirmation code detected be truth.'});
                      
                    }
            
                    if (user.confirmationCode !== selectedCode) {
                        
                      res.json({ success: false, message: 'Confirmation code detected false'});
                    
                  }
            
                    }catch (error) {
                   console.error(error);
                      return res.status(500).json({ success: false, message: 'Error server' });
                    }
                  }




               
                  module.exports.updateNewEmail=async(req:any,res:any)=>{
     
                    try{
            
                      const {newEmail}=req.body
            
                    
                        
                    const updatedEmail =   await prisma.user.update({
                          where: { id:req.user.user.id },
                          data: { email :newEmail },
                        });
            
                      if (updatedEmail) {
                        const userInfo=await prisma.user.findUnique({
                          where:{id:req.user.user.id},
                          select:{
                            id:true,
                            email:true,
                            name:true ,
                            state:true,
                            imageProfle:true,
                            gender:true,
                            locationUser:true
                          }
                        })
                        res.json({ success: true, message: 'Email updated sucessfully',userInfo});
                      }
                        
            
                    }catch (error) {
                   console.error(error);
                      return res.status(500).json({ success: false, message: 'Error server' });
                    }
                  }




                  module.exports.updatePassword=async(req:any,res:any)=>{
                    try{
                    
                    const {email}=req.body
                  
                   
                 
                   const confirmationCode  = generateConfirmationCode();
              
                
                const mailOptions = {
                  from: `${process.env.MY_EMAIL}`, 
                  to: email,
                  subject: 'Email Confirmation',
                  text: `Your confirmation code is: ${confirmationCode}`, 
                };
              
                const mail=  await transporter.sendMail(mailOptions);
                if (mail) {
                  const newUser = await prisma.user.update({
                    where:{id:req.user.user.id},
                    data: {
                     
                      confirmationCode,
                   
                    },
                  })
              
                  if (newUser) {
              
                   res.json({ success: true, message: 'Confirmation code sent successfully.'});
                  
                  }
              
                }
                  
                   }catch (error) {
                     console.error(error);
                        return res.status(500).json({ success: false, message: 'Error server' });
                      }
                   
                    }



                
                    module.exports.resendCodePassword=async(req:any,res:any)=>{
       
                        try{
                
                       const updatedCode=  await prisma.user.update({
                            where:{id:req.user.user.id},
                            data: {
                             
                              confirmationCode:null,
                           
                            },
                          })
                
                          if (updatedCode) {
                            res.json({ success: true, message: 'Confirmation code deleted sent successfully.'});
                          }
                
                        }catch (error) {
                       console.error(error);
                          return res.status(500).json({ success: false, message: 'Error server' });
                        }
                      }




                      module.exports.updateConfirmPassword=async(req:any,res:any)=>{
       
                        try{
                
                          const {selectedCode,email}=req.body
                
                          const user:any = await prisma.user.findUnique({
                            where: { email },
                          });
                        
                        
                          if (user.confirmationCode === selectedCode) {
                            
                            await prisma.user.update({
                              where: { email },
                              data: { confirmationCode: null },
                            });
                
                          
                            res.json({ success: true, message: 'Confirmation code detected be truth.'});
                          
                        }
                
                        if (user.confirmationCode !== selectedCode) {
                            
                          res.json({ success: false, message: 'Confirmation code detected false'});
                        
                      }
                
                        }catch (error) {
                       console.error(error);
                          return res.status(500).json({ success: false, message: 'Error server' });
                        }
                      }



                
                      module.exports.confirmNewPassword=async(req:any,res:any)=>{
       
                        try{
                
                          const {newPassword}=req.body
                
                          const hashedPassword = await bcrypt.hash(newPassword, 10);
                            
                        const updatedEmail =   await prisma.user.update({
                              where: { id:req.user.user.id },
                              data: { password :hashedPassword },
                            });
                
                          if (updatedEmail) {
                            const userInfo=await prisma.user.findUnique({
                              where:{id:req.user.user.id},
                              select:{
                                id:true,
                                email:true,
                                name:true ,
                                state:true,
                                imageProfle:true,
                                gender:true,
                                locationUser:true
                              }
                            })
                            res.json({ success: true, message: 'Email updated sucessfully',userInfo});
                          }
                            
                
                        }catch (error) {
                       console.error(error);
                          return res.status(500).json({ success: false, message: 'Error server' });
                        }
                      }



                
                      module.exports.updateLocationUser=async(req:any,res:any)=>{
                        try{
                        
                        const {phoneNumber,rueAdress,postalCode,commune,wilaya,country}=req.body
                       
                   
                      const updatedLocation= await prisma.location.update({
                        where:{userlocationId:req.user.user.id},
                        data:{
                          country:country.label,
                          rueAdress :rueAdress,
                          commune :commune,
                          postalCode:postalCode,
                          phoneNumber:country.phone+phoneNumber
                        }
                      })
              
                      const updateWilaya=await prisma.user.update({
                        where:{id:req.user.user.id},
                        data:{
                          state:wilaya,
                        }
                      })
              
              
              
                      if (updatedLocation && updateWilaya ) {
                        const userInfo=await prisma.user.findUnique({
                          where:{id:req.user.user.id},
                          select:{
                            id:true,
                            email:true,
                            name:true ,
                            state:true,
                            imageProfle:true,
                            gender:true,
                            locationUser:true
                          }
                        })
                        res.status(200).json({ success: true, message: 'user location information updated successfully',userInfo});  
                      }      
                       }catch (error) {
                         console.error(error);
                            return res.status(500).json({ success: false, message: 'Error server' });
                          }
                       
                        }


                
                        module.exports.deleteUserInfo=async(req:any,res:any)=>{
                            try{
                          const deletetedLocation= await prisma.location.delete({
                            where:{userlocationId:req.user.user.id},
                          })
                  
                  
                          if (deletetedLocation ) {
                            const userInfo=await prisma.user.findUnique({
                              where:{id:req.user.user.id},
                              select:{
                                id:true,
                                email:true,
                                name:true ,
                                state:true,
                                imageProfle:true,
                                gender:true,
                                locationUser:true
                              }
                            })
                            res.status(200).json({ success: true, message: 'user location information updated successfully',userInfo});  
                          }      
                           }catch (error) {
                             console.error(error);
                                return res.status(500).json({ success: false, message: 'Error server' });
                              }
                           
                            }


                
                            module.exports.createLocationUser=async(req:any,res:any)=>{
                                try{
                                
                                const {phoneNumber,rueAdress,postalCode,commune,wilaya,country}=req.body
                           
                              const updatedLocation= await prisma.location.create({
                                data:{
                                  country:country.label,
                                  rueAdress :rueAdress,
                                  commune :commune,
                                  postalCode:postalCode, 
                                  phoneNumber: country.phone+phoneNumber,
                                  userlocationId:req.user.user.id, 
                                }
                              })
                      
                              const updateWilaya=await prisma.user.update({
                                where:{id:req.user.user.id},
                                data:{
                                  state:wilaya,
                                }
                              })
                      
                      
                      
                              if (updatedLocation && updateWilaya ) {
                                const userInfo=await prisma.user.findUnique({
                                  where:{id:req.user.user.id},
                                  select:{
                                    id:true,
                                    email:true,
                                    name:true ,
                                    state:true,
                                    imageProfle:true,
                                    gender:true,
                                    locationUser:true
                                  }
                                })
                                res.status(200).json({ success: true, message: 'user location information updated successfully',userInfo});  
                              }      
                               }catch (error) {
                                 console.error(error);
                                    return res.status(500).json({ success: false, message: 'Error server' });
                                  }
                               
                                }