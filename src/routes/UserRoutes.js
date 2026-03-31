const router = require("express").Router();
const usercontroller = require("../controller/UserController");
const upload = require("../middleware/UploadMiddleware");


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
router.put("/getallusers/:id", validateToken, upload.any(), usercontroller.updateUser);
//localhost:4444/user/getallusers/1
router.delete("/getallusers/:id", validateToken, usercontroller.deleteUser);

// My profile routes (token based)
router.get("/profile", validateToken, usercontroller.getMyProfile);
router.put("/profile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.patch("/profile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.post("/profile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.put("/updateprofile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.patch("/updateprofile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.post("/updateprofile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.put("/update-profile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.patch("/update-profile", validateToken, upload.any(), usercontroller.updateMyProfile);
router.post("/update-profile", validateToken, upload.any(), usercontroller.updateMyProfile);

router.post("/forgotpassword", usercontroller.forgotpassword);

router.put("/resetpassword", usercontroller.resetpassword);

// Profile-friendly aliases
router.get("/:id", validateToken, usercontroller.getUserById);
router.put("/:id", validateToken, upload.any(), usercontroller.updateUser);




module.exports = router;    