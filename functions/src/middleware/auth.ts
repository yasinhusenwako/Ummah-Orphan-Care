import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized - No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = decodedToken;
    req.userId = decodedToken.uid;
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized - Invalid token' 
    });
  }
};

export const requireRole = (role: 'admin' | 'donor') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
      }

      const userDoc = await admin.firestore()
        .collection('users')
        .doc(req.userId)
        .get();

      const userData = userDoc.data();

      if (!userData || userData.role !== role) {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden - Insufficient permissions' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  };
};
