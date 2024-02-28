// @ts-nocheck

import {  PrismaClient  } from '@prisma/client'

const prisma = new PrismaClient()



module.exports.getStoreSeller=async(req:any,res:any)=>{
    try{

        

        const seller = await prisma.user.findUnique({
          where:{id:parseInt(req.params.storeId)},
          include: {
            entrepriseInfo:true,
            reprisentativeLegal:true,
            locationUser:true
          },
        })
     
        

        if (seller) {
            res.status(200).json({ success: true, message: 'product posted success',seller }); 
        }
      
      }catch (error) {
        console.error(error);
           return res.status(500).json({ success: false, message: 'Error server' });
         }
}


module.exports.getNewProductSeller=async(req:any,res:any)=>{
    try{

        const productLune = await prisma.product.findMany({
          where:{
            userId:parseInt(req.params.storeId),
            solde:{
                gt:0,
            }
        },
          include: {
            user:true,
            images:true,
            property:true
       },
        })
     

        if (productLune) {
            res.status(200).json({ success: true, message: 'product posted success',productLune }); 
        }
      
      }catch (error) {
        console.error(error);
           return res.status(500).json({ success: false, message: 'Error server' });
         }
}

module.exports.getAllProductSeller=async(req:any,res:any)=>{
    try{

        const productLune = await prisma.product.findMany({
          where:{
            userId:parseInt(req.params.storeId)
        },
          include: {
            user:true,
            images:true,
            property:true
       },
        })
     

        if (productLune) {
            res.status(200).json({ success: true, message: 'product posted success',productLune }); 
        }
      
      }catch (error) {
        console.error(error);
           return res.status(500).json({ success: false, message: 'Error server' });
         }
}


module.exports.getNewCollectionProductSeller=async(req:any,res:any)=>{
    try{

        const newProduct = await prisma.product.findMany({
          where:{
            userId:parseInt(req.params.storeId),
        },
        orderBy: {
            createdAt: 'asc',
          },
          include: {
            user:true,
            images:true,
            property:true
       },
        })
     

        if (newProduct) {
            res.status(200).json({ success: true, message: 'product posted success',newProduct }); 
        }
      
      }catch (error) {
        console.error(error);
           return res.status(500).json({ success: false, message: 'Error server' });
         }
}


