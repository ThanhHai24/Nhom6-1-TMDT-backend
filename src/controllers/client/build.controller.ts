import { User } from "@prisma/client";
import { Request, Response } from "express";

const getBuildPcPage = async (req: Request, res: Response) => {
    const user = req.user as User;
    res.render("StorePage/homepage/build", { user });
};

export { getBuildPcPage }