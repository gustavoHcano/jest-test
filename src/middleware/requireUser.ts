import { NextFunction, Request, Response } from "express";

const requireUser = (re: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if(!user){
    return res.sendStatus(403);
  }

  return next();
};

export default requireUser;