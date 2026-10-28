import jwt from "jsonwebtoken";

export type AccessTokenClaims = {
  sub: string;
  email: string;
};

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error("JWT_SECRET is missing.");
  }
  return value;
}

export function signAccessToken(user: { id: string; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email }, secret(), {
    expiresIn: "7d",
  });
}

export function readAccessToken(token: string): AccessTokenClaims {
  const decoded = jwt.verify(token, secret());
  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "string" ||
    typeof decoded.email !== "string"
  ) {
    throw new Error("Invalid token");
  }

  return { sub: decoded.sub, email: decoded.email };
}
