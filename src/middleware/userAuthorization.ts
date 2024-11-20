import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const clipTaggerAuthorizationFilter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);

  const isAuthorized =
    auth.has({ role: "org:clip_tagger" }) ||
    auth.has({ role: "org:admin" });

  console.log(auth.has({ role: "org:clip_tagger" }));
  console.log(auth.has({ role: "org:admin" }));
  console.log("isAuthorized", isAuthorized)

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

  const isAuthorized =
    auth.has({ role: "org:project_manager" }) ||
    auth.has({ role: "org:admin" });

  console.log(auth.has({ role: "org:clip_tagger" }));
  console.log(auth.has({ role: "org:admin" }));
  console.log("isAuthorized", isAuthorized)

  if (!isAuthorized) {
    return res.status(403).send("Unauthorized");
  }
  return next();
};
