const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const axios = require("axios");

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        (username, password, done) => {
            axios
                .post("auth/login", { username: username, password: password })
                .then((dados) => {
                    const user = dados.data;
                    if (!user) {
                        return done(null, false, { message: "Utilizador inexistente!\n" });
                    }
                    return done(null, user);
                })
                .catch((erro) => {
                    done(erro);
                });
        },
    ),
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: (req) => req.cookies.token,
            secretOrKey: process.env.JWT_SECRET_KEY,
        },
        (jwtPayload, done) => {
            if (Date.now() > jwtPayload.expires) {
                return done("jwt expired");
            }
            axios
                .get("users/" + jwtPayload.username)
                .then((dados) => {
                    return done(null, dados.data);
                })
                .catch((erro) => {
                    return done(erro, false);
                });
        },
    ),
);

passport.use(
    new GoogleStrategy(
        {
            clientID: "313913673363-l3m5rvls35f7ujid9qt204mlflerj1v4.apps.googleusercontent.com",
            clientSecret: "JBTuuxQm93KnxjoRlFd1kywy",
            callbackURL: "/auth/google/callback",
            proxy: true,
        },
        function (accessToken, refreshToken, params, profile, done) {
            axios
                .get("users/byEmail?email=" + profile._json.email)
                .then((dados) => {
                    if (dados.data != null) {
                        dados.data.accessToken = accessToken;
                        axios
                            .put("auth/updateAccessToken", { dados: dados.data })
                            .then((user) => {
                                done(null, user.data);
                            })
                            .catch((erro) => done(erro, false));
                    } else done(profile._json, false);
                })
                .catch((erro) => done(erro, false));
        },
    ),
);
