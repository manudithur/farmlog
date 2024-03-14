import { Router } from "express";
import createFarmValidator from "../validators/createFarm";
import { createFarm, editFarm, getFarm } from "../controllers/farmController";
import editFarmValidator from "../validators/editFarm";
import authenticatedValidator from "../validators/authenticated";



const farmRoutes = Router();

farmRoutes.post("/", authenticatedValidator, createFarmValidator, createFarm);
farmRoutes.put("/:farmId", authenticatedValidator, editFarmValidator, editFarm )
farmRoutes.get("/", authenticatedValidator, getFarm);


export default farmRoutes;