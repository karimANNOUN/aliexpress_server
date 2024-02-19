



import {  PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()





module.exports.addFavoritProduct=async(req:any,res:any)=>{
    try{
    const favoritProduct = await prisma.favoritlist.create({
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
  
        const product = await prisma.product.findUnique({
          where:{id:req.body.art.id},
          include: {
            user:true,
            images: true,
            property: true,
            favoritList:true
          },
        })
  
    
      res.status(200).json({ success: true, message: 'product liked success', products ,storeProductUser,product });     
    }if (!favoritProduct) {
      res.status(200).json({ success: false, message: 'error'});    
    }
     
  
  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
  }


  module.exports.deleteFavoritProduct=async(req:any,res:any)=>{
    try{
    const deletefavoritProduct = await prisma.favoritlist.deleteMany({
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
  
        const product = await prisma.product.findUnique({
          where:{id:req.body.art.id},
          include: {
            user:true,
            images: true,
            property: true,
            favoritList:true
          },
        })
    
      res.status(200).json({ success: true, message: 'product unliked successfully', products ,storeProductUser,product });      
    }if (!deletefavoritProduct) {
      res.status(400).json({ success: false, message: 'opération failde' });     
    }
    
  
  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
  }



  module.exports.getFavoritProduct=async(req:any,res:any)=>{
    try{
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
  
  
  
    if (favoritProducts) {
      res.status(200).json({ success: true, message: 'product get successfully', favoritProducts});      
    }
    
  
  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
  }



  module.exports.deleteFavoritList=async(req:any,res:any)=>{
 
    try{
     const deletefavoritProduct = await prisma.favoritlist.delete({
       where:{
        id:req.body.favorit.id
       }
     })
   
     if (deletefavoritProduct) {
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
   }