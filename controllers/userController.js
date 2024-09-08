const {body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const passport = require("passport");



const validateSignUpForm = [
    body("firstname")
    .trim()
    .isAlpha()
    .withMessage("Firstname can contain only alphabets")
    .notEmpty()
    .withMessage("Firstname cannot be empty")
    .isLength({max:255})
    .withMessage("Firstname too long"),

    body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Lastname cannot be empty")
    .isAlpha()
    .withMessage("Lastname can contain only alphabets")
    .isLength({max:255})
    .withMessage("Lastname too long"),

    body("userEmail")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please Enter a valid Email")
    .isLength({max:255})
    .withMessage("Email too long")
    .custom(async(value,{req})=>{
        const user = await db.getUserByEmail(req.body.userEmail)
        if(user){
            throw new Error("A user already exists with this e-mail address")
        }
    }),

    body("password")
    .notEmpty()
    .withMessage("Password cannot be empty"),

    body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password cannot be empty")
    .custom((value,{req})=>value === req.body.password)
    .withMessage("Passwords do not match")
    
]




exports.getSignUpForm = asyncHandler(async(req,res)=>{
    res.render("sign-up-form",{})
    // res.send("Sign Up Form Here");
})


exports.postInsertUser = [
    validateSignUpForm ,

    asyncHandler(async(req,res)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).render("sign-up-form",{
                errors : errors.array()
            })
        }

        const {firstname , lastname , userEmail ,  password ,isAdmin  } = req.body;
       
        try {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if(err){
                    return next(err)
                }
                await db.insertUser(userEmail , firstname , lastname , isAdmin==='on' ? true : false , hashedPassword)                
                res.redirect("/");
              });
        } catch(err) {
            return next(err);
        }
    })

]


exports.getHomepage = asyncHandler(async(req,res)=>{
    console.log(req)
    res.render("homepage", { user: req.user });
})

exports.getLoginForm = asyncHandler(async(req,res)=>{
    console.log(req)
    res.render("login-form")
})


exports.postLoginForm = 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })

exports.logOut = (req, res, next) => {
    console.log(req)
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
    
exports.getMembershipForm = asyncHandler(async(req,res)=>{
    res.render("joinClub",{ user: req.user });
})

exports.postMembershipForm = asyncHandler(async(req,res)=>{
    console.log("JOIN CLUB")
    console.log(req.body.secretCode)
    console.log("USER REQ OBJECT")
    console.log(req.user.id);
    if(req.body.secretCode === "4567" ){
        console.log("USER REQ OBJECT")
        console.log(req.user.id);
        await db.makeUserMember(req.user.id);
    }
    res.render("homepage",{ user: req.user });
})