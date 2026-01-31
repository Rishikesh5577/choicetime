import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-local-jwt-secret-change-me';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

if (!process.env.JWT_SECRET) {
  console.warn(
    '⚠️  JWT_SECRET is not set. Using fallback development secret. Please set JWT_SECRET in your .env for production.'
  );
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

