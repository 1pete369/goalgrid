import jwt from "jsonwebtoken"

export const createJWT = (uid: string) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET!, { expiresIn: "1h" })
}
