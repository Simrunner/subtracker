const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const supabasePublicKey = process.env.SUPABASE_JWT_SECRET;
    if (!supabasePublicKey) {
      return res.status(500).json({ error: 'Supabase JWT secret not configured' });
    }

    const decoded = jwt.verify(token, supabasePublicKey, {
      algorithms: ['HS256'],
    });

    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
