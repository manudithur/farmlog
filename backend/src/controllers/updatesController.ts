
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";
import { AuthenticatedRequest } from '../validators/authenticated';
import GroupUpdate from '../models/Update';
import Group from '../models/Group';

const createGroupUpdate = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const {groupId, paddockId, type, title, message, date} = req.body;

    const group = await Group.findOne({ groupId: groupId, farmId: authenticatedRequest.userData.farmId });

    if(!group){
        res.status(400).json({
            message: "Group does not exist"
        });
        return;
    }
    
    switch(type){
        case 'movement': {
            const previousUpdate = await GroupUpdate.findOne({ groupId: groupId, type: 'movement' }).sort({date: -1});
            if(previousUpdate){
                previousUpdate.endDate = date;
                previousUpdate.save();
            } 
            group.currentPadockId = paddockId;
            break;
        };
        case 'death': {
            group.liveStockCount -= 1;
            break;
        };
        case 'birth': {
            group.liveStockCount += 1;
            break;
        };
    }

    group.lastUpdate = date;
    group.save();

    const newUpdate = new GroupUpdate(req.body);
    newUpdate.updateId = uuidv4();
    newUpdate.userId = authenticatedRequest.userData.userId;
    newUpdate.farmId = authenticatedRequest.userData.farmId;

    newUpdate.save().then((response: any) => {
        res.status(201).json({
            message: "Update created",
            update: response
        });
    }).catch((err: any) => {
        res.status(500).json({
            message: err.message
        });
    });

});

const getGroupUpdates = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const {groupId} = req.params;
    const {type} = req.query;
    const group = await Group.findOne({ groupId: groupId, farmId: authenticatedRequest.userData.farmId });

    if(!group){
        res.status(400).json({
            message: "Group does not exist"
        });
        return;
    }

   if(type == '' || type == undefined){
        const updates = await GroupUpdate.find({ groupId: groupId, farmId: authenticatedRequest.userData.farmId });
        res.status(200).json({
            message: "Updates found",
            updates: updates
        });
    } else{
        const updates = await GroupUpdate.find({ groupId: groupId, farmId: authenticatedRequest.userData.farmId, type: type });
        res.status(200).json({
            message: "Updates found",
            updates: updates
        });
    }
});

export { createGroupUpdate, getGroupUpdates };