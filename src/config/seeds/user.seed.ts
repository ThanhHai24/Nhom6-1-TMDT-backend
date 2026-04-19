import { prisma } from "config/client";

const seedUsers = async () => {
    const count = await prisma.user.count();
    if (count > 0) {
        console.log("[Seed] Users: already seeded, skipping.");
        return;
    }

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
                password: "123456", // TODO: hash password
                role: "ADMIN",
                status: "ACTIVE",
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
                password: "123456",
                role: "CUSTOMER",
                status: "ACTIVE",
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
                password: "123456",
                role: "MANAGER",
                status: "ACTIVE",
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
                password: "123456",
                role: "RECEPTIONIST",
                status: "ACTIVE",
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
                password: "123456",
                role: "WAREHOUSE",
                status: "ACTIVE",
            },
        ],
    });

    console.log("[Seed] Users: seeded successfully.");
};

export default seedUsers;
