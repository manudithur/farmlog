import { Router } from "express";
import createFarmValidator from "../validators/createFarm";
import { createFarm, editFarm } from "../controllers/farmController";
import editFarmValidator from "../validators/editFarm";
import authenticatedValidator from "../validators/authenticated";



const farmRoutes = Router();

farmRoutes.post("/", createFarmValidator, createFarm);
farmRoutes.put("/:farmId", authenticatedValidator, editFarmValidator, editFarm )


export default farmRoutes;