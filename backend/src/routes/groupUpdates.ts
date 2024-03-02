import { Router } from "express";
import { createGroup, getGroups } from "../controllers/groupController";
import authenticatedValidator from "../validators/authenticated";
import createGroupUpdateValidator from "../validators/createGroupUpdate";
import { createGroupUpdate, getGroupUpdates } from "../controllers/updatesController";

const groupUpdateRouter = Router();

groupUpdateRouter.post('/', authenticatedValidator, createGroupUpdateValidator, createGroupUpdate);
groupUpdateRouter.get('/:groupId', authenticatedValidator, getGroupUpdates);

export default groupUpdateRouter;