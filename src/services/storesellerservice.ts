// @ts-nocheck

import {  PrismaClient  } from '@prisma/client'
import { json } from 'body-parser';

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


module.exports.getProductSeller=async(req:any,res:any)=>{
  
    try{

      const productSeller = await prisma.product.findMany({
        where:{userId:req.user.user.id},
        include: {
          user:true,
          images:true,
          property:true
     },
      })
   

      if (productSeller) {
          res.status(200).json({ success: true, message: 'product get success',productSeller }); 
      }
    
    }catch (error) {
      console.error(error);
         return res.status(500).json({ success: false, message: 'Error server' });
       }
}

module.exports.getProductSellerUnique=async(req:any,res:any)=>{
  
  try{

   

    const productSeller = await prisma.product.findUnique({
      where:{
        id:parseInt(req.params.prodId),
      },
      include: {
        user:true,
        images:true,
        property:true
   },
    })

    

    if (productSeller) {
        res.status(200).json({ success: true, message: 'product get success',productSeller }); 
    }
  
  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
}



module.exports.updatedPropertiesImages=async(req:any,res:any)=>{
  
  try{

    const {quantity,color,properties,type} =req.body

   
  

   const newUpdates=await prisma.image.update({
    where:{
      id:JSON.parse(properties).id,
      productId:JSON.parse(properties).productId,
    },
    data:{
      imageUrl:req.file.path,
      color:color
    }
   }),

   const newProperties=await prisma.property.update({
    where:{
      id:JSON.parse(type).id,
      productId:JSON.parse(type).productId,
    },
    data:{
      quantity:JSON.parse(quantity)
    }
   })


   if (newUpdates && newProperties ) {
    
    const productSeller = await prisma.product.findUnique({
      where:{
        id:JSON.parse(type).productId,
      },
      include: {
        user:true,
        images:true,
        property:true
   },
    })

    

    if (productSeller) {
        res.status(200).json({ success: true, message: 'product update success',productSeller }); 
    }else{
      res.status(400).json({ success: false, message: 'Error try again ' }); 
    }

   }

   
  
  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
}


module.exports.updatedPrice=async(req:any,res:any)=>{
  
  try{
  
    const {prix,product}=req.body;

 

   const newPrice=await prisma.product.update({
    where:{
      id:product.id,
    },
    data:{
      price:JSON.parse(prix)
    }
   }),

     if (newPrice) {
      const productSeller = await prisma.product.findUnique({
        where:{
          id:product.id,
        },
        include: {
          user:true,
          images:true,
          property:true
     },
      })
  
      
  
      if (productSeller) {
          res.status(200).json({ success: true, message: 'price update success',productSeller }); 
      }else{
        res.status(400).json({ success: false, message: 'Error try again ' }); 
      }
     }

  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
}





module.exports.updatedSolde=async(req:any,res:any)=>{
  
  try{
  
    const {solde,product}=req.body;

 

   const newSolde=await prisma.product.update({
    where:{
      id:product.id,
    },
    data:{
      solde:JSON.parse(solde)
    }
   }),

     if (newSolde) {
      const productSeller = await prisma.product.findUnique({
        where:{
          id:product.id,
        },
        include: {
          user:true,
          images:true,
          property:true
     },
      })
  
      
  
      if (productSeller) {
          res.status(200).json({ success: true, message: 'price update success',productSeller }); 
      }else{
        res.status(400).json({ success: false, message: 'Error try again ' }); 
      }
     }

  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
}




module.exports.updatedDescription=async(req:any,res:any)=>{
  
  try{
  
    const {description,product}=req.body;

 

   const newDescription=await prisma.product.update({
    where:{
      id:product.id,
    },
    data:{
      description:description
    }
   }),

     if (newDescription) {
      const productSeller = await prisma.product.findUnique({
        where:{
          id:product.id,
        },
        include: {
          user:true,
          images:true,
          property:true
     },
      })
  
      
  
      if (productSeller) {
          res.status(200).json({ success: true, message: 'description update success',productSeller }); 
      }else{
        res.status(400).json({ success: false, message: 'Error try again ' }); 
      }
     }

  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
}




module.exports.updatedDescriptionTitleOne=async(req:any,res:any)=>{
  
  try{
  
    const {descripTitle1,product}=req.body;

 

   const newDescriptionTitle=await prisma.product.update({
    where:{
      id:product.id,
    },
    data:{
      descriptiontitle1:descripTitle1
    }
   }),

     if (newDescriptionTitle) {
      const productSeller = await prisma.product.findUnique({
        where:{
          id:product.id,
        },
        include: {
          user:true,
          images:true,
          property:true
     },
      })
  
      
  
      if (productSeller) {
          res.status(200).json({ success: true, message: 'description Title update success',productSeller }); 
      }else{
        res.status(400).json({ success: false, message: 'Error try again ' }); 
      }
     }

  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
}



module.exports.updatedDescriptionTitleTwo=async(req:any,res:any)=>{
  
  try{
  
    const {descripTitle2,product}=req.body;

 

   const newDescriptionTitle=await prisma.product.update({
    where:{
      id:product.id,
    },
    data:{
      descriptiontitle2:descripTitle2
    }
   }),

     if (newDescriptionTitle) {
      const productSeller = await prisma.product.findUnique({
        where:{
          id:product.id,
        },
        include: {
          user:true,
          images:true,
          property:true
     },
      })
  
      
  
      if (productSeller) {
          res.status(200).json({ success: true, message: 'description Title 2 update success',productSeller }); 
      }else{
        res.status(400).json({ success: false, message: 'Error try again ' }); 
      }
     }

  }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }
}