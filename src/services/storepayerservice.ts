
import {  PrismaClient } from '@prisma/client'

const prisma:any = new PrismaClient()









module.exports.getStorePayer=async(req:any,res:any)=>{
    try{
     
      const findStorPayer=await prisma.storepayer.findMany({
        where:{userId:req.user.user.id},
        include:{
          user:true,
          product:true,
          store:true
        }
      })


      res.status(200).json({ success: true, message: 'payer product create successfully',findStorPayer}); 
      
    }catch (error) {
      console.error(error);
         return res.status(500).json({ success: false, message: 'Error server' });
       }
  }




  module.exports.createStorePayer=async(req:any,res:any)=>{
    try{

    const {prod,count}=req.body

    
    if (prod.product.solde === 0) {
      const newPrice=prod.product.price
      const newStorPayer=await prisma.storepayer.create({
        data: {
        userId:req.user.user.id,       
        quantity:count,
        priceProduct:newPrice,
        priceLivraison:prod.product.prixlivraison,
        productstoreId:prod.product.id,
        productUserStoreId:prod.productUserStoreId,
        storeId:prod.id
        }
      })

      if (newStorPayer) {

        const findStorPayer=await prisma.storepayer.findMany({
          where:{userId:req.user.user.id},
          include:{
            user:true,
            product:true,
            store:true 
          }
        })


        res.status(200).json({ success: true, message: 'payer product create successfully',findStorPayer}); 
      }
    }else{
      const newPrice=prod.product.price - (prod.product.price*prod.product.solde/100)
      const newStorPayer=await prisma.storepayer.create({
        data: {
        userId:req.user.user.id,       
        quantity:count,
        priceProduct:newPrice,
        priceLivraison:prod.product.prixlivraison,
        productstoreId:prod.product.id,
        productUserStoreId:prod.productUserStoreId,
        storeId:prod.id
        }
      })

      if (newStorPayer) {

        const findStorPayer=await prisma.storepayer.findMany({
          where:{userId:req.user.user.id},
          include:{
            user:true,
            product:true,
            store:true 
          }
        })


        res.status(200).json({ success: true, message: 'payer product create successfully',findStorPayer}); 
      }
    }
  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
  }

  module.exports.updateAddQuantity=async(req:any,res:any)=>{
    try{

    const {quantity,prod}=req.body

    const updateStorPayer=await prisma.storepayer.updateMany({
      where:{
        userId:req.user.user.id,
        productstoreId:prod.product.id,
      },
      data: {
      quantity:quantity+1
      }
    })

    if (updateStorPayer) {

      const findStorPayer=await prisma.storepayer.findMany({
        where:{userId:req.user.user.id},
        include:{
          user:true,
          product:true,
          store:true 
        }
      })


      res.status(200).json({ success: true, message: 'payer product update successfully',findStorPayer}); 
    }



  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
  }






  module.exports.moinQuantity=async(req:any,res:any)=>{
    try{

    const {quantity,prod}=req.body

    const updateStorPayer=await prisma.storepayer.updateMany({
      where:{
        userId:req.user.user.id,
        productstoreId:prod.product.id,
      },
      data: {
      quantity:quantity-1
      }
    })

    if (quantity === 1) {
      await prisma.storeuser.deleteMany({
        where:{
          userId:req.user.user.id,
          productstoreId:prod.product.id,
        }
      })
    }

    if (updateStorPayer) {

      const findStorPayer=await prisma.storepayer.findMany({
        where:{userId:req.user.user.id},
        include:{
          user:true,
          product:true,
          store:true 
        }
      })


      res.status(200).json({ success: true, message: 'payer product update successfully',findStorPayer}); 
    }



  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
   }


   module.exports.deleteStorePayer=async(req:any,res:any)=>{
    try{

      const {prod}=req.body
    
      const deleteStore =  await prisma.storepayer.deleteMany({
          where:{
            userId:req.user.user.id,
            productstoreId:prod.product.id,
          }
        })
      

      if (deleteStore) {

        const findStorPayer=await prisma.storepayer.findMany({
          where:{userId:req.user.user.id},
          include:{
            user:true,
            product:true,
            store:true
          }
        })


        res.status(200).json({ success: true, message: 'payer product deleted successfully',findStorPayer}); 
      }



    }catch (error) {
      console.error(error);
         return res.status(500).json({ success: false, message: 'Error server' });
       }
  }



