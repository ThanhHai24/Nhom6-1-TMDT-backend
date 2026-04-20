import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { prisma } from "config/client";

const getLoginPage = (req: Request, res: Response) => {
    if (req.isAuthenticated()) return res.redirect("/");
    const sessionAny = req.session as any;
    res.render("StorePage/auth/login", { message: sessionAny.messages ? sessionAny.messages[0] : null });
}

const getRegisterPage = (req: Request, res: Response) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.render("StorePage/auth/register", { error: null });
}

const postRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ho, ten, email, password, phone } = req.body;

        // Validation - check if user already exists based on email
        const existingUser = await prisma.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            return res.render("StorePage/auth/register", { error: "Email already in use." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Construct full name and username
        const fullName = `${ho} ${ten}`.trim();
        const username = email.split('@')[0] + Math.floor(100 + Math.random() * 900); // simple username generation

        // Create new user (Role defaults to CUSTOMER based on schema)
        await prisma.user.create({
            data: {
                username: username.substring(0, 50), // Ensure within varchar limits
                email,
                password: hashedPassword,
                fullName,
                phone: phone || "",
                idCard: "", // default empty since not in form
                gender: "Unknown"
            }
        });

        // Redirect to login after successful register
        res.redirect("/login");
    } catch (error) {
        console.error("Register Error:", error);
        res.render("StorePage/auth/register", { error: "An error occurred during registration. Please try again." });
    }
}

const postLogin = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", {
        successRedirect: "/", 
        failureRedirect: "/login",
        failureMessage: true // Requires express-session to store flash messages in req.session.messages
    })(req, res, next);
};

const getLogout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect("/");
    });
};

export default { getLoginPage, getRegisterPage, postRegister, postLogin, getLogout };