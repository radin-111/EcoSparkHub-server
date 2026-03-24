import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
const createJwtToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  return token;
};

const verifyJwtToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      message: "Token verified successfully",
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid token",
    };
  }
};

const decodeJwtToken = (token: string) => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return {
      success: true,
      message: "Token decoded successfully",
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid token",
    };
  }
};

export const jwtUtils = {
  createJwtToken,
  verifyJwtToken,
  decodeJwtToken,
};
