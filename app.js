require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs")
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const userRouter = require("./routes/userRouter")
const PORT = process.env.PORT ;
const pool = require("./db/pool");

const app = express();

// app.set("views", __dirname + "/views
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [username]);
      const user = rows[0];
   
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);
  

passport.serializeUser((user, done) => {
  console.log("Serializing Id");
  done(null, user.id);

});
  

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing Id");

    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

  
app.use("/", userRouter);

app.listen(PORT, () => console.log("app listening on port 3000!"));