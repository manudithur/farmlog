import { Router } from "express";
import { createGroup, editGroup, getGroup, getGroups } from "../controllers/groupController";
import createGroupValidator from "../validators/createGroup";
import authenticatedValidator from "../validators/authenticated";
import editGroupValidator from "../validators/editGroupValidator";

const groupRoutes = Router();

groupRoutes.post("/", authenticatedValidator, createGroupValidator, createGroup);
groupRoutes.put("/:groupId", authenticatedValidator, editGroupValidator, editGroup);
groupRoutes.get("/:groupId", authenticatedValidator, getGroup);
groupRoutes.get("/", authenticatedValidator, getGroups);

export default groupRoutes;