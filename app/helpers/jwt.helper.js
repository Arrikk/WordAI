const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/config')

const generateJwtHelper = (user) => {
    const payload = {
        sub: user?._id,
        email: user?.email,
        // id: user?._id
    }

    const signed = jwt.sign(payload, JWT_SECRET, {expiresIn: '7d'})
    return signed;
}



module.exports = {generateJwtHelper}