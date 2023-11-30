const isGoogleOrJWTAuthorizedMiddleware = (req, res, next) => {
    const user = req?.user;
    if(!user) return res.sendStatus(401);
    next()
}

module.exports = isGoogleOrJWTAuthorizedMiddleware