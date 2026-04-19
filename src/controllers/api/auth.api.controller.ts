import { Request, Response } from "express";
import { prisma } from "config/client";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

const saltRounds = 10;

// Đăng nhập
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: username } // Cho phép đăng nhập bằng email hoặc username
                ]
            }
        });

        if (!user) {
             res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
             return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
             res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
             return;
        }

        if (user.status !== "ACTIVE") {
             res.status(403).json({ error: "Tài khoản của bạn đã bị khóa" });
             return;
        }

        // Convert BigInt for JSON serialization
        const serializedUser = JSON.parse(JSON.stringify(user, (key, value) => typeof value === "bigint" ? value.toString() : value));
        
        // Không trả về password dạng plain text
        delete serializedUser.password;

        res.status(200).json({ message: "Đăng nhập thành công", user: serializedUser });
    } catch (error) {
        res.status(500).json({ error: "Lỗi đăng nhập", details: error });
    }
};

// Đăng ký
export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, email, fullName, phone, idCard, gender, dob } = req.body;

        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
             res.status(400).json({ error: "Tên đăng nhập hoặc email đã tồn tại" });
             return;
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                fullName,
                phone,
                idCard,
                gender: gender || "MALE",
                dob: dob ? new Date(dob) : null,
                role: Role.CUSTOMER // Mặc định role CUSTOMER
            }
        });

        const serializedUser = JSON.parse(JSON.stringify(newUser, (key, value) => typeof value === "bigint" ? value.toString() : value));
        delete serializedUser.password;

        res.status(201).json({ message: "Đăng ký thành công", user: serializedUser });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi đăng ký", details: error });
    }
};
