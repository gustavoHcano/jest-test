import { Request, Response } from "express";
import { createSession, findSections, updateSession } from "../service/sessions.service";
import { validatePassword } from "../service/user.service";
import { signJWT } from "../utils/jwt.utils";
import config from 'config';

export async function createUserSessionHandler(req:Request, res: Response) {
  // validate user password
  const user = await validatePassword(req.body.password, req.body.email);

  if(!user){
    return res.status(401).send('Invalid email or password');
  }
  //create session
  const session = await createSession(user._id, req.get('user-agent') || '');
  console.log(session);
  //create access token 
  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );
  //create refresh token
  const refreshToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // 15 minutes,
  );
  //return tokens

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req:Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSections({user: userId, valid: true});
  console.log(sessions);

  return res.send(sessions);
}

export async function deleteUserSessionHandler(req:Request, res: Response) {
  const session = res.locals.user.session;

  await updateSession(
    { _id: session }, { valid: false }
  );

  return res.send({
    accessToken: null,
    refreshToken: null
  })
}