const router = require("express").Router();
const usercontroller = require("../controller/UserController");
const upload = require("../middleware/UploadMiddleware");

const profileImageUpload = upload.fields([
	{ name: "profilepic", maxCount: 1 },
	{ name: "profilePic", maxCount: 1 },
	{ name: "profilePhoto", maxCount: 1 },
	{ name: "image", maxCount: 1 },
	{ name: "avatar", maxCount: 1 },
	{ name: "file", maxCount: 1 }
]);


// CREATE - POST


//localhost:4444/user/register
router.post("/register", usercontroller.registerUser)
//localhost:4444/user/login
router.post("/login", usercontroller.loginUser);
const validateToken = require("../middleware/AuthMiddleware");
//localhost:4444/user/getallusers
router.get("/getallusers", validateToken, usercontroller.getAllUsers);
//localhost:4444/user/getallusers/1
router.get("/getallusers/:id", validateToken, usercontroller.getUserById);
//localhost:4444/user/getallusers/1
router.put("/getallusers/:id", validateToken, profileImageUpload, usercontroller.updateUser);
//localhost:4444/user/getallusers/1
router.delete("/getallusers/:id", validateToken, usercontroller.deleteUser);

// My profile routes (token based)
router.get("/profile", validateToken, usercontroller.getMyProfile);
router.put("/profile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.patch("/profile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.post("/profile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.put("/updateprofile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.patch("/updateprofile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.post("/updateprofile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.put("/update-profile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.patch("/update-profile", validateToken, profileImageUpload, usercontroller.updateMyProfile);
router.post("/update-profile", validateToken, profileImageUpload, usercontroller.updateMyProfile);

router.post("/forgotpassword", usercontroller.forgotpassword);

router.put("/resetpassword", usercontroller.resetpassword);

// Profile-friendly aliases
router.get("/:id", validateToken, usercontroller.getUserById);
router.put("/:id", validateToken, profileImageUpload, usercontroller.updateUser);




module.exports = router;    