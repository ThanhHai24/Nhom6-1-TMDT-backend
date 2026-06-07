import express from "express"
require("dotenv").config();
import getConnection from "./config/database";
import initDatabase from "config/index.seed";
import userRoutes from "routes/userRoutes";
import path from "path/win32";
import adminRoutes from "routes/adminRoutes";
import apiRoutes from "routes/apiRoutes";

import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "config/client";
import passport from "config/passport";
import expressLayouts from "express-ejs-layouts";

const app = express();
const PORT = process.env.PORT || 8080;

// config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


// config body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config static files
app.use(express.static("public"));

app.use(expressLayouts);


// middleware to set currentUrl for active link in sidebar
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});

// config session
app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret-key-pcstore',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000, // 2 minutes
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// middleware to share user data to all views globally
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.cart = req.session.cart || [];
    res.locals.cartCount = req.session.cart ? req.session.cart.reduce((total, item) => total + item.quantity, 0) : 0;

    // Flash message: đọc error_msg từ session rồi xoá (chỉ hiện 1 lần)
    if (req.session.error_msg) {
        res.locals.error_msg = req.session.error_msg;
        delete req.session.error_msg;
    }

    next();
});

// config route
userRoutes(app);
adminRoutes(app);
apiRoutes(app);

getConnection();



// seed data
initDatabase();
app.listen(PORT, () => {
    console.log(`My app is running on port: ${PORT}`);
})