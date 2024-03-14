import { Router } from "express";
import registerValidator from "../validators/register";
import { login, profile, register } from "../controllers/userController";
import loginValidator from "../validators/login";
import authenticatedValidator from "../validators/authenticated";


const userRoutes = Router();

userRoutes.post("/", registerValidator, register);
userRoutes.post("/login", loginValidator, login);
// userRoutes.get("/:id", authenticatedValidator, profile);


export default userRoutes;