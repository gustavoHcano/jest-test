import { NextFunction, Request, Response } from "express";
import { get } from 'lodash';
import { reIssueAccessToken } from "../service/sessions.service";
import { verifyJWT } from "../utils/jwt.utils";
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    const refreshToken = get(req, "headers.x-refresh");

    if (!accessToken) return next();

    const { decode, expired } = verifyJWT(accessToken);

    if (decode) {
      res.locals.user = decode;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken(refreshToken);

      if (newAccessToken) {
        res.setHeader('x-access-token', newAccessToken);
        const result = verifyJWT(newAccessToken);
        res.locals.user = result.decode;
        return next();
      }

    }
    
    return next();
  } catch (error: any) {
    
     return next()
  }
}
export default deserializeUser;