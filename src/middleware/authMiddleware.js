import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import userServices from '../services/userService.js';

const verifyToken = promisify(jwt.verify);
const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Access denied. No token provided.' });
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    const user = await userServices.getUserById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ error: 'Access denied. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

export default authMiddleware;
