const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(403)
      .send({ message: 'Authorization Required' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-testing');
  } catch (err) {
    return res
      .status(403)
      .send({ message: 'Authorization Required' });
  }
  req.user = payload; // assigning the payload to the request object
  return next(); // sending the request to the next middleware
};

module.exports = auth;