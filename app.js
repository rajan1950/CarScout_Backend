const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

const DBConnection = require("./src/utils/DBConnection");
DBConnection();

//localhost:4444/user/register
const userRoutes = require("./src/routes/UserRoutes");
app.use("/user",userRoutes);

const carRoutes = require("./src/routes/CarRoutes");
app.use("/car",carRoutes);

const inquiryRoutes = require("./src/routes/InquiryRoutes");
app.use("/inquiry",inquiryRoutes);

const adminRoutes = require("./src/routes/AdminRoutes");
app.use("/admin",adminRoutes);

const messageRoutes = require("./src/routes/MessageRoutes");
app.use("/message",messageRoutes);

const reviewRoutes = require("./src/routes/ReviewRoutes");
app.use("/reviews",reviewRoutes);

const testDriveRoutes = require("./src/routes/TestDriveRoutes");
app.use("/testdrive",testDriveRoutes);

const PORT= process.env.PORT  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})