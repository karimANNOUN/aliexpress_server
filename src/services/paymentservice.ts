
import {  PrismaClient } from '@prisma/client'

const prisma:any = new PrismaClient()

import fetch from "node-fetch"


const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";


const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data : any = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};




async function handleResponse(response:any) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}



const createOrder = async ({storePayer,totalPrice,totalLivraisonPrice }:any) => {
 
 
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [ 
      {
        amount: {
          currency_code: "USD",
          value:totalPrice+totalLivraisonPrice,
        },
      },
    ],
  };

 
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};



const captureOrder = async (orderID:any) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};



module.exports.paypalOrder=async(req:any,res:any)=>{
  try {
  
    const { storePayer,totalPrice,totalLivraisonPrice } = req.body;
    const { jsonResponse, httpStatusCode }  = await createOrder({storePayer,totalPrice,totalLivraisonPrice})
   if(httpStatusCode === 201){

    console.log(jsonResponse)

   // for (const stor of store) {
    //  await productRepository
      //   .createQueryBuilder()
       //  .update(Product)
       //  .set({
        //     quantity: () => "quantity - 1" ,
        // })
        // .where("id = :id", { id: stor.product.id })
        // .execute()
       }
 
  // return res.status(httpStatusCode).json(jsonResponse);
 
    }catch (error) {
    console.error(error);
       return res.status(500).json({ success: false, message: 'Error server' });
     }

}


module.exports.captureOrder=async(req:any,res:any)=>{
  try {  
    const { orderID } = req.body;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

    if(httpStatusCode === 201 ){

      console.log(jsonResponse)
   //   const userRepository = AppDataSource.getRepository(Payment)
  //    const payment = new Payment()
  //    payment.cardName = jsonResponse.payer.name.given_name + jsonResponse.payer.name.surname
  //    payment.cvc = jsonResponse.purchase_units[0].postal_code
  //    payment.cardNumber=jsonResponse.payment_source.paypal.account_id
  //    payment.totalPrice = jsonResponse.purchase_units[0].payments.captures[0].amount.value
  //    payment.user=req.user.user.id
      
   //  await userRepository.save(payment)


   //  const storeRepository = AppDataSource.getRepository(Store)
 //    const allProducts = await storeRepository.find({
 //      where:{
  //      author:{
  //       id:req.user.user.id
 //       }
  //    },
   //   relations: {
  //     product: true,
 
 //  },
  //   })
  //   res.json({allProducts});


    }

   
  //  res.status(httpStatusCode).json(jsonResponse);
}catch (error) {
  console.error(error);
     return res.status(500).json({ success: false, message: 'Error server' });
   }
}





module.exports.paypalOrder=async(req:any,res:any)=>{
    try{

        console.log(req.body)
     
     // const findStorPayer=await prisma.storepayer.findMany({
    //    where:{userId:req.user.user.id},
   //     include:{
    //      user:true,
    //      product:true,
    //      store:true
    //    }
    //  })


    //  res.status(200).json({ success: true, message: 'payer product create successfully',findStorPayer}); 
      
    }catch (error) {
      console.error(error);
         return res.status(500).json({ success: false, message: 'Error server' });
       }
  }
