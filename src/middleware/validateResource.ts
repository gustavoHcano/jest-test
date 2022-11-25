import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) =>{
  try {
    schema.parse({
      params: req.params,
      body: req.body,
      query: req.query
    })
    next();
  } catch (error: any) {
  
    return res.status(442).send(error.errors)
  }
}

export default validateResource;