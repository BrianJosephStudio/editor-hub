import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const clipTaggerAuthorizationFilter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);

  const roles = auth.sessionClaims?.metadata?.roles ?? [];
  const authorizedRoles = ["admin", "editor", "animator", 'clip_tagger']

  const isAuthorized = roles.some(role => authorizedRoles.some(authorizedRole => authorizedRole === role));

  console.log("API v2 request by user with roles:", auth.sessionClaims?.metadata?.roles);

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

  const roles = auth.sessionClaims?.metadata?.roles ?? [];
  const authorizedRoles = ["admin", "editor", "animator"]

  const isAuthorized = roles.some(role => authorizedRoles.some(authorizedRole => authorizedRole === role));

  console.log("API v2 request by role:", auth.sessionClaims?.metadata?.role);

  if (!isAuthorized) {
    return res.status(403).send("Unauthorized");
  }
  return next();
};
