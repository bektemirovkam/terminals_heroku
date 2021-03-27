const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const generateMD5 = require("../utils/generateHash");
const UserModel = require("../models/userModel");


passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({
          username: username
        }).exec();

        if (!user) {
          return done(null, false);
        }

        if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY || "123",
      jwtFromRequest: ExtractJwt.fromHeader("token"),
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.data._id).exec();
        if (user) {
         return done(null, user);
        }
        done(null, false);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
