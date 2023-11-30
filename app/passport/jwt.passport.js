const { JWT_SECRET } = require("../../config/config");
const passport = require("passport");
const usersSchema = require("../schemas/users.schema");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types

const JWTStrategyOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JWTStrategy(JWTStrategyOptions, async (payload, done) => {
    try {
      const user = await usersSchema.findOne({ _id: new ObjectId(payload.sub) });
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (e) {
        console.log(e?.message ? e.message : e?.error)
      done(null, false);
    }
  })
);
