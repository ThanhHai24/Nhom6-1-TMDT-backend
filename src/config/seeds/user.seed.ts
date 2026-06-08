import { prisma } from "config/client";

const seedUsers = async () => {
    const count = await prisma.user.count();
    if (count > 0) {
        console.log("[Seed] user: already seeded, skipping.");
        return;
    }

    await prisma.user.createMany({
        data: [
            {
                id: BigInt("1"),
                username: "admin",
                password: "$2b$10$xLXkfVTMltueG9PdcdyQee8zxps5lJEqiZ8fGomPfMKnciSA6IFkK",
                email: "admin@example.com",
                fullName: "Admin",
                phone: "0123332221",
                idCard: "",
                dob: new Date("1990-01-01T00:00:00.000Z"),
                gender: "Male",
                avatar: "987d9d90-870a-4fbe-945a-495e025d23b1.png",
                role: "ADMIN",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.317Z")
            },
            {
                id: BigInt("2"),
                username: "customer",
                password: "$2b$10$xLXkfVTMltueG9PdcdyQee8zxps5lJEqiZ8fGomPfMKnciSA6IFkK",
                email: "customer@example.com",
                fullName: "Customer",
                phone: "",
                idCard: "",
                dob: new Date("1990-01-01T00:00:00.000Z"),
                gender: "Male",
                avatar: "",
                role: "CUSTOMER",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.317Z")
            },
            {
                id: BigInt("3"),
                username: "manager",
                password: "$2b$10$xLXkfVTMltueG9PdcdyQee8zxps5lJEqiZ8fGomPfMKnciSA6IFkK",
                email: "manager@example.com",
                fullName: "Manager",
                phone: "",
                idCard: "",
                dob: new Date("1990-01-01T00:00:00.000Z"),
                gender: "Male",
                avatar: "",
                role: "MANAGER",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.317Z")
            },
            {
                id: BigInt("4"),
                username: "receptionist",
                password: "$2b$10$xLXkfVTMltueG9PdcdyQee8zxps5lJEqiZ8fGomPfMKnciSA6IFkK",
                email: "receptionist@example.com",
                fullName: "Receptionist",
                phone: "",
                idCard: "",
                dob: new Date("1990-01-01T00:00:00.000Z"),
                gender: "Male",
                avatar: "",
                role: "RECEPTIONIST",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.317Z")
            },
            {
                id: BigInt("5"),
                username: "warehouse",
                password: "$2b$10$xLXkfVTMltueG9PdcdyQee8zxps5lJEqiZ8fGomPfMKnciSA6IFkK",
                email: "warehouse@example.com",
                fullName: "Warehouse Staff",
                phone: "",
                idCard: "",
                dob: new Date("1990-01-01T00:00:00.000Z"),
                gender: "Male",
                avatar: "",
                role: "WAREHOUSE",
                status: "ACTIVE",
                createdAt: new Date("2026-06-06T21:45:48.317Z")
            },
            {
                id: BigInt("6"),
                username: "123306",
                password: "$2b$10$7sD8gj0GXQeYtP0pLbcOeu/VYajHKK7feadCa3vQnry9z9LHIBaCi",
                email: "123@123.com",
                fullName: "123 123",
                phone: "123",
                idCard: "",
                dob: null,
                gender: "Unknown",
                avatar: null,
                role: "CUSTOMER",
                status: "ACTIVE",
                createdAt: new Date("2026-06-07T05:44:18.772Z")
            }
        ],
    });

    console.log("[Seed] user: seeded successfully.");
};

export default seedUsers;
