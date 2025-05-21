import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: number) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  const data = jwt.verify(token, secret) as JwtPayload;
  return data;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
