


import {  PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()





module.exports.addStoreProduct=async(req:any,res:any)=>{
 
 
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
              where:{userId:req.user.user.id},
              include:{
                product:{
                  include:{
                    user:true,
                    images: true,
                    property: true,
                    favoritList:true
                  }
                }

              }
            })
             
            const product = await prisma.product.findUnique({
              where:{id:art.id},
              include: {
                user:true,
                images: true,
                property: true,
                favoritList:true
              },
            })
      
            res.status(200).json({ success: true, message: 'product stored success',storeProductUser,product });    
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

        const product = await prisma.product.findUnique({
          where:{id:art.id},
          include: {
            user:true,
            images: true,
            property: true,
            favoritList:true
          },
        })
         
  
        res.status(200).json({ success: true, message: 'product stored success',storeProductUser,product });    
      }  
      }
  
    
      
      }catch (error) {
      console.error(error);
         return res.status(500).json({ success: false, message: 'Error server' });
       }
  
  
  }


  module.exports.getStoreProduct=async(req:any,res:any)=>{
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
     
     })
   
     res.status(200).json({ success: true, message: 'product stored success',storeProductUser });    
   
   }catch (error) {
     console.error(error);
        return res.status(500).json({ success: false, message: 'Error server' });
      }
   }


   module.exports.deleteStoreProduct=async(req:any,res:any)=>{
    try{
     const deleteStoreProduct = await prisma.storeuser.deleteMany({
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
  
        const favoritProducts = await prisma.favoritlist.findMany({
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
   }