const router = require("express").Router();
const usercontroller = require("../controller/UserController");

// CREATE - POST
//localhost:4444/user/register
router.get("/register", usercontroller.registerUser);
    
router.post("/register", usercontroller.registerUser)
//localhost:4444/user/login
router.post("/login", usercontroller.loginUser);
//localhost:4444/user/getallusers
router.get("/getallusers", usercontroller.getAllUsers);
//localhost:4444/user/getallusers/1
router.get("/getallusers/:id", usercontroller.getUserById);

router.put("/getallusers/:id", usercontroller.updateUser);

router.delete("/getallusers/:id", usercontroller.deleteUser);



module.exports = router;    