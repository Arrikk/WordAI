const { generateJwtHelper } = require("../../helpers/jwt.helper");
const usersSchema = require("../../schemas/users.schema");
const { getUserByEmail } = require("./auth.service");

const googleAuthAuthorizationController = async (req, res, next) => {
    try{
        let user = req?.user?._json
         let userDB = await getUserByEmail(user?.email);
         if(!userDB){
            userDB = new usersSchema({
                email: user.email,
                sub: user.sub,
                displayName: user?.displayName,
                firstName: user?.given_name,
                lastName: user?.family_name,
                picture: user?.picture,
                email_verified: user?.email_verified,
                name: user?.name
            });
            await userDB.save();
        }

        
        const jwt = generateJwtHelper(userDB)
        req.jwt = jwt;
        next()
        // res.status(200).json({jwt})
    }catch(e){
        console.log(e)
        res.status(401).json({failed: true, message: e.message})
    }

}

module.exports = googleAuthAuthorizationController