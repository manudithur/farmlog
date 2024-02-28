import { Router } from "express";
import authenticatedValidator from "../validators/authenticated";
import createPaddockValidator from "../validators/createPaddock";
import { createPaddock, deletePaddock, editPaddock, getPaddockById, getPaddocksByFarmId } from "../controllers/paddockController";
import editPaddockValidator from "../validators/editPaddock";

const paddockRoutes = Router();

paddockRoutes.post("/", authenticatedValidator, createPaddockValidator, createPaddock);
paddockRoutes.delete("/:paddockId", authenticatedValidator, deletePaddock);
paddockRoutes.put("/:paddockId", authenticatedValidator, editPaddockValidator, editPaddock);
paddockRoutes.get("/:paddockId", authenticatedValidator, getPaddockById);
paddockRoutes.get("/farm/:farmId", authenticatedValidator, getPaddocksByFarmId);

export default paddockRoutes;