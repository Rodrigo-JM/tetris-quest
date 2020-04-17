const express = require("express");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const app = express();
const session = require("express-session");
const db = require("./db/db");
const User = require('./db/user')
const authRouter = require('./routes/router')
//creating a store for sessions
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dbStore = new SequelizeStore({ db: db });

// sync so that our session table gets created
dbStore.sync();

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "a wildly insecure secret",
    store: dbStore,
    resave: false,
    saveUninitialized: false,
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//passport stuff
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      console.log(user)
      done(null, user)
    })
    .catch(done);
});

//http middleware
app.use(morgan("dev"));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static middleware
app.use(express.static(path.join(__dirname, "../public")));

//request api router
// app.use("/api", require("./api/index"));

//router for user auth actions
app.use("/login", authRouter)
app.use("/signup", authRouter)
app.use("/logout", authRouter)
app.use('/me', authRouter)
//send index.html for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.message, err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});

module.exports = app;
