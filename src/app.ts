import express from "express"
require("dotenv").config();
import webRoutes from "./routes/web";
import getConnection from "./config/database";
import initDatabase from "config/seed";

const app = express();
const PORT = process.env.PORT || 8080;

// config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


// config body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config route
webRoutes(app);

getConnection();

// Config static files
app.use(express.static("public"));

// seed data
initDatabase();
app.listen(PORT, () => {
    console.log(`My app is running on port: ${PORT}`);
})