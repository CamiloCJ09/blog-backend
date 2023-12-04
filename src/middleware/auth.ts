import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { UserDocument } from "../model/user.model"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const secretKey = process.env.JWT_SECRET || "basicsecret"
const currentTimestamp = Math.floor(Date.now() / 1000)

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the JWT token from the Authorization header
    let token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Check if the token is expired and refresh it if needed
    if (isTokenExpired(token)) {
      token = refreshToken(token)
    }

    // Verify the token and attach the decoded user information to the request body
    const decoded = jwt.verify(token, secretKey)
    req.body.loggedUser = decoded

    // Continue to the next middleware or route handler
    next()
  } catch (error) {
    // Handle authentication errors and respond with a 500 Internal Server Error
    return res.status(500).json(error)
  }
}

const generateToken = (user: UserDocument) => {
  try {
    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || "24h",
    })
    return token
  } catch (error) {
    // Throw any errors that occur during token generation
    throw error
  }
}

function isJwtPayload(decoded: any): decoded is jwt.JwtPayload {
  return decoded && typeof decoded === "object" && "role" in decoded
}

// Function to check if a JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.verify(token, secretKey) as { exp: number }
    return decoded.exp < currentTimestamp
  } catch (error) {
    // Treat token verification failures as expired tokens
    return true
  }
}

const hasAnyRole =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "Not logged in" })
    }

    // Verify the token and check if the user has the required roles
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: err.message })
      }
      if (!isJwtPayload(decoded) || !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          message:
            "You do not have the authorization and permissions to access this resource.",
        })
      }

      // Continue to the next middleware or route handler
      next()
    })
  }

// Function to refresh an expired token
function refreshToken(token: string): string {
  const tokenPayload = jwt.decode(token) as jwt.JwtPayload
  return generateToken({
    email: tokenPayload.email,
    role: tokenPayload.role,
  } as UserDocument)
}

// Bundle the authentication-related services into an object for export
const authServices = {
  auth,
  generateToken,
  hasAnyRole,
}

export default authServices
