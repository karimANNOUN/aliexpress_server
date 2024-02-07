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
   const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });

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
   const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });

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

   
  
   const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '7d' });

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
  
   const token = jwt.sign({ user: newUser }, SECRET_KEY, { expiresIn: '7d' });

    return res.json({ success: true, message: 'Email confirmed successfully.',token});
  } else {
    return res.status(400).json({ success: false, message: 'Invalid confirmation code.' });
  }
});


app.post('/sellerstep',upload.array('file'),verifyToken,async(req,res)=>{

 try {
 
// const user=req.user
 
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
})



app.post('/product',upload.any(),verifyToken,async(req,res)=>{

 try {

  const {title,properties,description,categoryType,firstTitle,secondTitle,thirdTitle,firstDescription,secondDescription,thirdDescription} =req.body
 
  const newProduct = await prisma.product.create({
    data: {
  userId :req.user.user.id,
  title:title,
  properties :properties,
  solde :parseInt(req.body.solde),
  prixlivraison :parseInt(req.body.livraison),
  templivraison :parseInt(req.body.livraisonTime),
  quantity :parseInt(req.body.quantity),
  price  :parseInt(req.body.price),
  category :categoryType,
  description :description, 
  descriptiontitle1 :firstTitle,
  descriptiontitle2 :secondTitle,
  descriptiontitle3 :thirdTitle,
  descriptiondetail1 :firstDescription,
  descriptiondetail2 :secondDescription,
  descriptiondetail3 :thirdDescription,
  images: {
   create: req.files.map(file=>   ({ imageUrl: `${file.path}`  ,color:`${file.fieldname}` })   )
    },
    property: {
      create: JSON.parse(req.body.propertiesDetails).map(detail=>   ({ detailsName: `${detail.propertyDetail}`  ,quantity:parseInt(detail.quantityDetail) })   )
       },
    },
    include: {
      images: true,
      property: true
    },
  });
  
  if (newProduct) {
    res.status(200).json({ success: true, message: 'product posted success' });    
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

app.get('/getproduct',async(req,res)=>{
  try{
  const products = await prisma.product.findMany({
    include: {
      user:true,
      images: true,
      property: true,
      favoritList:{
        include:{
          user:true
        }
      }
    },
  })
  res.status(200).json({ success: true, message: 'product posted success',products });  

}catch (error) {
  console.error(error);
     return res.status(500).json({ success: false, message: 'Error server' });
   }

})


app.get('/getproduct/:id',async(req,res)=>{
 

  try{
    const product = await prisma.product.findUnique({
      where:{id:parseInt(req.params.id)},
      include: {
        user:true,
        images: true,
        property: true,
        favoritList:true
      },
    })
 
    res.status(200).json({ success: true, message: 'product posted success',product });  
  
  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
 
})



app.post('/addstoreproduct',verifyToken,async(req,res)=>{
 // console.log(req.body)
 
  try {

    const {optionSize,quantitySize,favoritColor, favoriteImage ,art} =req.body

    const findStore= await prisma.storeuser.findMany({
      where:{userId:req.user.user.id},
      include:{
         product:true
      }
    })

    if (findStore.length) {
      const newStore = findStore.find(str=> str.propertyType == optionSize && str.colorProduct == favoritColor )
      if (newStore == undefined ) {
        const storeProduct = await prisma.storeuser.create({
          data: {
        userId :req.user.user.id,
        colorProduct: favoritColor ,
        propertyType: optionSize ,
        quantity: quantitySize , 
        imageUrl: favoriteImage ,
        productstoreId:art.id,
        productStoreName:art.user.name,
        productUserStoreId:art.user.id 
        }
      });
        
        if (storeProduct) {
    
          const storeProductUser = await prisma.storeuser.findMany({
            where:{userId:req.user.user.id}
          })
           
    
          res.status(200).json({ success: true, message: 'product stored success',storeProductUser });    
        }  
      }if (newStore !== undefined) {
        res.status(401).json({ success: false, message: 'product already exist in your store'});   
      }    
    }if (!findStore.length) {
      const storeProduct = await prisma.storeuser.create({
        data: {
      userId :req.user.user.id,
      colorProduct: favoritColor ,
      propertyType: optionSize ,
      quantity: quantitySize , 
      imageUrl: favoriteImage , 
      productstoreId:art.id,
      productStoreName:art.user.name,
      productUserStoreId:art.user.id
      }
    });
    if (storeProduct) {
    
      const storeProductUser = await prisma.storeuser.findMany({
        where:{userId:req.user.user.id}
      })
       

      res.status(200).json({ success: true, message: 'product stored success',storeProductUser });    
    }  
    }

  
    
    }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }


})
 

app.get('/getstoreproduct',verifyToken,async(req,res)=>{
 try{
  const storeProductUser = await prisma.storeuser.findMany({
    where:{userId:req.user.user.id},
    include:{
      product:{
       include:{
         user:true,
         property:true,
         images:true
       }
      },
      user:true
}

 
  //  groupeby:{productStoreName},
  
  })

  res.status(200).json({ success: true, message: 'product stored success',storeProductUser });    

}catch (error) {
  console.error(error);
     return res.status(500).json({ success: false, message: 'Error server' });
   }
})  
 

app.post('/favoritproduct',verifyToken,async(req,res)=>{
  try{
  const favoritProduct = await prisma.Favoritlist.create({
    data:{
      userId:req.user.user.id,
      productfavoritId:req.body.art.id 
    }
  })

  if (favoritProduct) {
    const products = await prisma.product.findMany({
      include: {
        user:true,
        images: true,
        property: true,
        favoritList:{
          include:{
            user:true
          }
        }
      },
    })

    const storeProductUser = await prisma.storeuser.findMany({
      where:{userId:req.user.user.id},
      include:{
        product:{
         include:{
           user:true,
           property:true,
           images:true
         }
        },
        user:true
      }
      })
  
    res.status(200).json({ success: true, message: 'product liked success', products ,storeProductUser });     
  }if (!favoritProduct) {
    res.status(200).json({ success: false, message: 'error'});    
  }
   

}catch (error) {
  console.error(error);
     return res.status(500).json({ success: false, message: 'Error server' });
   }
})


app.delete('/deletefavoritproduct',verifyToken,async(req,res)=>{
  try{
  const deletefavoritProduct = await prisma.Favoritlist.deleteMany({
    where:{
      userId:req.user.user.id,
      productfavoritId:req.body.art.id
    }
  }) 

  if (deletefavoritProduct) {
    const products = await prisma.product.findMany({
      include: {
        user:true,
        images: true,
        property: true,
        favoritList:{
          include:{
            user:true
          }
        }
      },
    })

    const storeProductUser = await prisma.storeuser.findMany({
      where:{userId:req.user.user.id},
      include:{
        product:{
         include:{
           user:true,
           property:true,
           images:true
         }
        },
        user:true
      }
      })
  
    res.status(200).json({ success: true, message: 'product unliked successfully', products ,storeProductUser });      
  }if (!deletefavoritProduct) {
    res.status(400).json({ success: false, message: 'opération failde' });     
  }
  

}catch (error) {
  console.error(error);
     return res.status(500).json({ success: false, message: 'Error server' });
   }
})


app.get('/getfavoritproduct',verifyToken,async(req,res)=>{
  try{
  const favoritProducts = await prisma.Favoritlist.findMany({
    where:{
      userId:req.user.user.id,
    },

    include:{
      user:true,
      product:{
        include:{
          images:true,
          property:true
        }
      }
    }

  })



  if (favoritProducts) {
    res.status(200).json({ success: true, message: 'product get successfully', favoritProducts});      
  }
  

}catch (error) {
  console.error(error);
     return res.status(500).json({ success: false, message: 'Error server' });
   }
})



app.delete('/deletefavoritlist',verifyToken,async(req,res)=>{
 
 try{
  const deletefavoritProduct = await prisma.Favoritlist.delete({
    where:{
     id:req.body.favorit.id
    }
  })

  if (deletefavoritProduct) {
    const favoritProducts = await prisma.Favoritlist.findMany({
      where:{
        userId:req.user.user.id,
      },
  
      include:{
        user:true,
        product:{
          include:{
            images:true,
            property:true
          }
        }
      }
  
    })

    const storeProductUser = await prisma.storeuser.findMany({
      where:{userId:req.user.user.id},
      include:{
        product:{
         include:{
           user:true,
           property:true,
           images:true
         }
        },
        user:true
      }
      })
  
    res.status(200).json({ success: true, message: 'product get successfully', favoritProducts,storeProductUser});      
  }if (!deletefavoritProduct) {
    res.status(400).json({ success: false, message: 'opération failde' });     
  }
  

}catch (error) {
  console.error(error);
     return res.status(500).json({ success: false, message: 'Error server' });
   }
})

app.delete('/deletestoreproduct',verifyToken,async(req,res)=>{
  try{
   const deleteStoreProduct = await prisma.Storeuser.deleteMany({
     where:{
      productstoreId:req.body.prod.product.id,
      userId:req.user.user.id
     }
   })


 
   if (deleteStoreProduct) {
    const storeProductUser = await prisma.storeuser.findMany({
      where:{userId:req.user.user.id},
      include:{
        product:{
         include:{
           user:true,
           property:true,
           images:true
         }
        },
        user:true
      }
      })

      const favoritProducts = await prisma.Favoritlist.findMany({
        where:{
          userId:req.user.user.id,
        },
    
        include:{
          user:true,
          product:{
            include:{
              images:true,
              property:true
            }
          }
        }
    
      })
   
     res.status(200).json({ success: true, message: 'product deleted successfully', storeProductUser,favoritProducts});      
   }if (!deleteStoreProduct) {
     res.status(400).json({ success: false, message: 'opération failde' });     
   }
   
 
 }catch (error) {
   console.error(error);
      return res.status(500).json({ success: false, message: 'Error server' });
    }
 })


 app.patch('/updatedImages',upload.single('file'),verifyToken,async(req,res)=>{
 try{
  const findUser=await prisma.user.findUnique({
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

 })

 app.get('/userInfo',verifyToken,async(req,res)=>{
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
 })


 app.put('/updatelocation',verifyToken,async(req,res)=>{
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
    where:{userId:req.user.user.id},
  })


if (updatelocation == null) {
  const newLocation= await prisma.location.create({
    data:{
      userId:req.user.user.id,
      country:country,
      rueAdress:adress,
      commune:commune,
      postalCode:postalCode,
      phoneNumber:parseInt(phoneNumber)
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
    where:{userId:req.user.user.id},
    data:{
      country:country,
      rueAdress:adress,
      commune:commune,
      postalCode:postalCode,
      phoneNumber:parseInt(phoneNumber)
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
 
  })


  app.patch('/updatecountry',verifyToken,async(req,res)=>{
    try{
    
    const {country}=req.body
  
 
  
  
    const updatelocation= await prisma.location.findUnique({
      where:{userId:req.user.user.id},
    })
  
  
  if (updatelocation == null) {
    const newLocation= await prisma.location.create({
      data:{
        userId:req.user.user.id,
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
      where:{userId:req.user.user.id},
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
   
    })



    app.patch('/updateemail',verifyToken,async(req,res)=>{
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
     
      })


      
      app.patch('/resendcode',verifyToken,async(req,res)=>{
     
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
     

    

      })


      app.patch('/updateconfirmemail',verifyToken,async(req,res)=>{
     
        try{

          const {selectedCode,email}=req.body

          const user = await prisma.user.findUnique({
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
     

    

      })



      app.patch('/updateconfirmenewmail',verifyToken,async(req,res)=>{
     
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
      })







































      app.patch('/updatepassword',verifyToken,async(req,res)=>{
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
       
        })
  
  
        
        app.patch('/resendcodepassword',verifyToken,async(req,res)=>{
       
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
       
  
      
  
        })
  
  
        app.patch('/updateconfirmpassword',verifyToken,async(req,res)=>{
       
          try{
  
            const {selectedCode,email}=req.body
  
            const user = await prisma.user.findUnique({
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
       
  
      
  
        })
  
  
  
        app.patch('/updateconfirmenewpassword',verifyToken,async(req,res)=>{
       
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
       
  
      
  
        })

















        app.put('/updatelocationuser',verifyToken,async(req,res)=>{
          try{
          
          const {phoneNumber,rueAdress,postalCode,commune,wilaya,country}=req.body
         
     
        const updatedLocation= await prisma.location.update({
          where:{userId:req.user.user.id},
          data:{
            country:country.label,
            rueAdress :rueAdress,
            commune :commune,
            postalCode:postalCode,
            phoneNumber:parseInt(phoneNumber)
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
         
          })

          app.delete('/deleteuserInfo',verifyToken,async(req,res)=>{
            try{
            
           
           
       
          const deletetedLocation= await prisma.location.delete({
            where:{userId:req.user.user.id},
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
           
            })





            app.post('/createlocationuser',verifyToken,async(req,res)=>{
              try{
              
              const {phoneNumber,rueAdress,postalCode,commune,wilaya,country}=req.body
         
            
         
            const updatedLocation= await prisma.location.create({
              data:{
                userId:req.user.user.id,
                country:country.label,
                rueAdress :rueAdress,
                commune :commune,
                postalCode:postalCode,
                phoneNumber:parseInt(phoneNumber)
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
             
              })







app.listen(8000, () =>
  console.log(`🚀Server ready at: http://localhost:8000`)) 
