//@ts-nocheck
const jwt = require('jsonwebtoken');
import { Request, Response  } from "express"




function verifyToken(req:Request, res:Response, next:any) {
 
  const token = req.headers.authorization ;
 

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }


  jwt.verify(token, `${process.env.SECRET_KEY}`, (err:any, decoded:any) => {
    if (err) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    req.user = decoded;
   


    next();
  });
}

module.exports = verifyToken;