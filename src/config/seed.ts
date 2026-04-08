import { prisma } from "config/client";

const initDatabase = async () => {
    const countUsers = await prisma.user.count();
    if (countUsers === 0) {
        await prisma.user.createMany({
            data: [
                {
                    fullName: "Admin",
                    username: "admin",
                    email: "admin@example.com",
                    phone: "",
                    avatar: "",
                    idCard: "",
                    dob: new Date("1990-01-01"),
                    gender: "Male",
                    password: "123456", // Replace with actual hashed password
                    role: "ADMIN",
                    status: "ACTIVE"
                },
                {
                    fullName: "Customer",
                    username: "customer",
                    email: "customer@example.com",
                    phone: "",
                    avatar: "",
                    idCard: "",
                    dob: new Date("1990-01-01"),
                    gender: "Male",
                    password: "123456", // Replace with actual hashed password
                    role: "CUSTOMER",
                    status: "ACTIVE"
                },
                {
                    fullName: "Manager",
                    username: "manager",
                    email: "manager@example.com",
                    phone: "",
                    avatar: "",
                    idCard: "",
                    dob: new Date("1990-01-01"),
                    gender: "Male",
                    password: "123456", // Replace with actual hashed password
                    role: "MANAGER",
                    status: "ACTIVE"
                },
                {
                    fullName: "Receptionist",
                    username: "receptionist",
                    email: "receptionist@example.com",
                    phone: "",
                    avatar: "",
                    idCard: "",
                    dob: new Date("1990-01-01"),
                    gender: "Male",
                    password: "123456", // Replace with actual hashed password
                    role: "RECEPTIONIST",
                    status: "ACTIVE"
                    },
                {
                    fullName: "Warehouse Staff",
                    username: "warehouse",
                    email: "warehouse@example.com",
                    phone: "",
                    avatar: "",
                    idCard: "",
                    dob: new Date("1990-01-01"),
                    gender: "Male",
                    password: "123456", // Replace with actual hashed password
                    role: "WAREHOUSE",
                    status: "ACTIVE"
                }
            ]
        });
    } else {
        console.log("Database already seeded");
    }

}
export default initDatabase;