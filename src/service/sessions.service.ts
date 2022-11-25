import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.moldel";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { findUser } from "./user.service";
import config from 'config';

export async function createSession(userId: string, userAgent: string){
  const session = await SessionModel.create({
    user: userId, 
    userAgent: userAgent,
  })

  return session.toJSON();
}

export async function findSections(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>, 
  update: UpdateQuery<SessionDocument>
  ) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({refreshToken}: {
  refreshToken: string
}){
  const {decode} = verifyJWT(refreshToken);
  const sessionId = get(decode, 'session');

  if(!decode && !sessionId) return false;

  const session = await SessionModel.findById(sessionId);

  if(!session || !session.valid) return false;

  const user = await findUser({_id: session.user});

  if(!user) return false;

  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );

  return accessToken;
}