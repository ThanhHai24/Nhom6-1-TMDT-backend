import { User } from "@prisma/client";
import { Request, Response } from "express";
import { title } from "process";

const getBuildPcPage = async (req: Request, res: Response) => {
    const user = req.user as User;
    res.render("StorePage/homepage/build", {
        user,
        layout: "StorePage/layout/main",
        title: "Xây dựng cấu hình"
    });
};

export { getBuildPcPage }