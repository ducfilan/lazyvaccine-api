import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routeIndex from './routes/index';
import AuthenticationMiddleware from './middlewares/global/authentication';
import session from 'express-session';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import UsersDao from './dao/users.dao';

const app = express()


// TODO: Configure CORS https://expressjs.com/en/resources/middleware/cors.html
app.use(cors())
process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cookieParser());

/** SET UP GOOGLE AUTHEN */

// config express-session
var sessionConfig = {
    secret: process.env.AUTH0_CLIENT_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true
};

if (app.get('env') === 'prd') {
    // Use secure cookies in production (requires SSL/TLS)
    sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

// Storing and retrieving user data from the session
// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// TODO: re-struct this place
// Perform the login, after login Auth0 will redirect to callback
app.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/api/v1/user/my-info');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user/my-info'
app.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }

        UsersDao.registerUser(user);

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo);
        });
    })(req, res, next);
});

// setup middleware
app.use(AuthenticationMiddleware.secured);
/** END SET UP GOOLE AUTHEN */

// setup routes
app.use('/api/v1', routeIndex);
// TODO: remove this code and handle not found exception
app.use('*', (req, res) => res.status(404).json({
  error: 'not found'
}))

export default app;
