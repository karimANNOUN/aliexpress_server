
import {  PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()






module.exports.postProduct=async(req:any,res:any)=>{

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
      create: req.files.map((file:any)=>   ({ imageUrl: `${file.path}`  ,color:`${file.fieldname}` })   )
       },
       property: {
         create: JSON.parse(req.body.propertiesDetails).map((detail:any)=>   ({ detailsName: `${detail.propertyDetail}`  ,quantity:parseInt(detail.quantityDetail) })   )
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
   
   
   
   }



   module.exports.getProduct=async(req:any,res:any)=>{
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
  
  }

  module.exports.getProductId=async(req:any,res:any)=>{
 

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
   
  }