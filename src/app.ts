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
app.use(async (req, res, next) => {
    res.locals.user = req.user;
    let cartWithStock = [];
    if (req.session.cart && req.session.cart.length > 0) {
        try {
            const productIds = req.session.cart.map(item => BigInt(item.productId));
            const products = await prisma.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, stock: true }
            });
            const stockMap = new Map(products.map(p => [p.id.toString(), p.stock]));
            cartWithStock = req.session.cart.map(item => ({
                ...item,
                stock: stockMap.get(item.productId) ?? 0
            }));
        } catch (err) {
            console.error("Error fetching cart stock:", err);
            cartWithStock = req.session.cart;
        }
    }
    res.locals.cart = cartWithStock;
    res.locals.cartCount = req.session.cart ? req.session.cart.reduce((total, item) => total + item.quantity, 0) : 0;

    // Flash message: đọc error_msg từ session rồi xoá (chỉ hiện 1 lần)
    if (req.session.error_msg) {
        res.locals.error_msg = req.session.error_msg;
        delete req.session.error_msg;
    }

    // Load active banners globally
    try {
        const activeBanners = await prisma.banner.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { order: 'asc' }
        });
        res.locals.slideshows = activeBanners.filter(b => b.type === 'SLIDESHOW');
        res.locals.sideBanners = {
            left: activeBanners.find(b => b.type === 'SIDE_BANNER' && b.position === 'LEFT') || null,
            right: activeBanners.find(b => b.type === 'SIDE_BANNER' && b.position === 'RIGHT') || null
        };
        res.locals.bottomBanners = {
            bottom1: activeBanners.find(b => b.type === 'BOTTOM_BANNER' && b.position === 'BOTTOM_1') || null,
            bottom2: activeBanners.find(b => b.type === 'BOTTOM_BANNER' && b.position === 'BOTTOM_2') || null
        };
    } catch (err) {
        console.error("Error loading banners globally:", err);
        res.locals.slideshows = [];
        res.locals.sideBanners = { left: null, right: null };
        res.locals.bottomBanners = { bottom1: null, bottom2: null };
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