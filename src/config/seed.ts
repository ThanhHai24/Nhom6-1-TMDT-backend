import { prisma } from "config/client";

const initDatabase = async () => {
    const countUsers = await prisma.user.count();
    if (countUsers === 0) {
        await prisma.user.createMany({
            data: [
                {
                    fullName: "John Doe",
                    username: "johndoe",
                    address: "123 Main St",
                    phone: "",
                    avatar: "",
                    password: "",
                    accountType: ""
                },
                {
                    fullName: "Jane Doe",
                    username: "janedoe",
                    address: "456 Oak Ave",
                    phone: "",
                    avatar: "",
                    password: "",
                    accountType: ""
                }
            ]
        });
    } else {
        console.log("Database already seeded");
    }

}
export default initDatabase;