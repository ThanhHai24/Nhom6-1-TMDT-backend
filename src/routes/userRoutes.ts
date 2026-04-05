import express from 'express';
const router = express.Router();

const userRoutes = (app: express.Express) => {
    router.get("/users", (req, res) => {
        res.send("Get all users");
    });
    app.use("/", router);

}
export default userRoutes;