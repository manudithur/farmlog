import { Router } from "express";
import authenticatedValidator from "../validators/authenticated";
import createPaddockValidator from "../validators/createPaddock";
import { createPaddock, deletePaddock, editPaddock } from "../controllers/paddockController";
import editPaddockValidator from "../validators/editPaddock";

const paddockRoutes = Router();

paddockRoutes.post("/", authenticatedValidator, createPaddockValidator, createPaddock);
paddockRoutes.delete("/:paddockId", authenticatedValidator, deletePaddock);
paddockRoutes.put("/:paddockId", authenticatedValidator, editPaddockValidator, editPaddock);

export default paddockRoutes;