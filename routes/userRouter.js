const { Router } = require("express");
const passport = require("passport");
const router = Router();

const userController = require("../controllers/userController")

router.get("/", userController.getHomepage)

router.get("/sign-up", userController.getSignUpForm);
router.post("/sign-up",userController.postInsertUser);

router.get("/log-in" , userController.getLoginForm)
router.post("/log-in" , 
    userController.postLoginForm 
    )

router.get("/log-out", userController.logOut)

router.get("/join-club" , userController.getMembershipForm)
router.post("/join-club" , userController.postMembershipForm)

router.get("/create-message" , userController.getCreateMessageForm)
router.post("/create-message" , userController.postCreateMessageForm)

router.get("/:messageId/delete" , userController.deleteMessage);


module.exports = router;