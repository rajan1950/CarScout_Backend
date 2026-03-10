const router = require("express").Router();
const usercontroller = require("../controller/UserController");

// CREATE - POST
//localhost:4444/user/register
router.post("/register", usercontroller.registerUser)

router.get("/getallusers", usercontroller.getAllUsers);

router.get("/getallusers/:id", usercontroller.getUserById);

router.put("/getallusers/:id", usercontroller.updateUser);

router.delete("/getallusers/:id", usercontroller.deleteUser);



module.exports = router;    