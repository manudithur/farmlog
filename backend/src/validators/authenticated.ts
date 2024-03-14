import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userData: {
    email: string;
    userId: string;
    farmId: number;
    role: string;
    iat: number;
    exp: number;
  }
}


const authenticatedValidator = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "") || '';
      const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET as string);
      const authenticatedRequest = req as AuthenticatedRequest;
      authenticatedRequest.userData = decoded as { email: string; userId: string; role: string; farmId: number, iat: number; exp: number; }
      next();
    } catch (err) {
      res.status(401).json({
        message: "Authentication Failed"
      });
    }
  };
  

export default authenticatedValidator;
