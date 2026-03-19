const router = require("express").Router();
const usercontroller = require("../controller/UserController");


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
router.put("/getallusers/:id", validateToken, usercontroller.updateUser);
//localhost:4444/user/getallusers/1
router.delete("/getallusers/:id", validateToken, usercontroller.deleteUser);



module.exports = router;    