import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const clipTaggerAuthorizationFilter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);

  const role = auth.sessionClaims?.metadata?.role;

  const isAuthorized = role === "clip_tagger" || role === "admin";
  console.log("API v2 request by role:", auth.sessionClaims?.metadata?.role);

  if (!isAuthorized) {
    return res.status(403).send("Unauthorized");
  }
  return next();
};

export const projectManagerAuthorizationFilter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);

  const role = auth.sessionClaims?.metadata?.role;

  const isAuthorized = role === "project_manager" || role === "admin";

  console.log("API v2 request by role:", auth.sessionClaims?.metadata?.role);

  if (!isAuthorized) {
    return res.status(403).send("Unauthorized");
  }
  return next();
};
