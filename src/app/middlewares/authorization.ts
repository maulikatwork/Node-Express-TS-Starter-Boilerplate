import { NextFunction, Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import CustomError from '../errors';
import config from '../../config';

// Define interfaces
interface UserPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// Add user property to the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// JWT helpers
const jwtHelpers = {
  verifyToken(token: string, secret: Secret): UserPayload {
    try {
      // This is a placeholder - in a real implementation, use jsonwebtoken's verify
      // For example: return jwt.verify(token, secret) as UserPayload;

      // Mock implementation for template
      const decoded = { userId: '123', role: 'user', iat: 1234567890, exp: 9876543210 };
      return decoded;
    } catch (error) {
      throw new CustomError.UnAuthorizedError('Invalid token!');
    }
  },
};

const authentication = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // First check for token in cookies (preferred method)
      const cookieToken = req.cookies?.accessToken;

      // If cookie token not found, check authorization header
      if (!cookieToken) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
      } else {
        token = cookieToken;
      }

      if (!token) {
        throw new CustomError.UnAuthorizedError('Unauthorized access!');
      }

      // Use the correct path from config for the JWT secret
      const userPayload = jwtHelpers.verifyToken(token, config.jwt.accessToken.secret as Secret);

      if (!userPayload) {
        throw new CustomError.UnAuthorizedError('Invalid token!');
      }
      req.user = userPayload;

      // Guard for check authentication
      if (requiredRoles.length && !requiredRoles.includes(userPayload.role)) {
        throw new CustomError.ForbiddenError('Forbidden!');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authentication;
