import { Router } from "express";
import authenticatedValidator from "../validators/authenticated";
import createfieldValidator from "../validators/createField";
import { createfield, deletefield, editfield, getfieldById, getfieldsByFarmId } from "../controllers/fieldController";
import editfieldValidator from "../validators/editField";

const fieldRoutes = Router();

fieldRoutes.post("/", authenticatedValidator, createfieldValidator, createfield);
fieldRoutes.delete("/:fieldId", authenticatedValidator, deletefield);
fieldRoutes.put("/:fieldId", authenticatedValidator, editfieldValidator, editfield);
fieldRoutes.get("/:fieldId", authenticatedValidator, getfieldById);
fieldRoutes.get("/farm/:farmId", authenticatedValidator, getfieldsByFarmId);

export default fieldRoutes;