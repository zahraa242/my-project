const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 requests per window (here, per 15 minutes).
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    handler: (req, res, next) =>
        res.status(429).json({
            message: "Too Many Requests"
        }),
})

module.exports = limiter;
