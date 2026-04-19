import express from "express"
require("dotenv").config();
import getConnection from "./config/database";
import initDatabase from "config/index.seed";
import userRoutes from "routes/userRoutes";
import path from "path/win32";
import adminRoutes from "routes/adminRoutes";
import apiRoutes from "routes/apiRoutes";

const app = express();
const PORT = process.env.PORT || 8080;

// config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


// config body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to set currentUrl for active link in sidebar
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});


// config route
userRoutes(app);
adminRoutes(app);
apiRoutes(app);

getConnection();

// Config static files
app.use(express.static("public"));


// seed data
initDatabase();
app.listen(PORT, () => {
    console.log(`My app is running on port: ${PORT}`);
})