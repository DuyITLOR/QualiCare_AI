// server/api/[...all].js
const app = require('../app');

// Export thẳng Express app (không serverless-http)
module.exports = (req, res) => app(req, res);
