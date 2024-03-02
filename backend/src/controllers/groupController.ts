
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";
import Farm from '../models/Farm';
import { AuthenticatedRequest } from '../validators/authenticated';
import Group from '../models/Group';



const createGroup = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const {name} = req.body;

    const farm = await Farm.findOne({ farmId: authenticatedRequest.userData.farmId });

    if(!farm){
        res.status(400).json({
            message: "Farm does not exist"
        });
        return;
    }

    if(farm.ownerId != authenticatedRequest.userData.userId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    const verifyGroup = await Group.findOne({ name: name, farmId: authenticatedRequest.userData.farmId });

    try {
        if(verifyGroup){
            res.status(400).json({
                message: "Group already exists"
            });
        } else{
            const newGroup = new Group(req.body);
            newGroup.groupId = uuidv4();
            newGroup.farmId = authenticatedRequest.userData.farmId;
            newGroup.isActive = true;
            newGroup.lastUpdated = new Date();
            newGroup.save().then((response: any) => {
                res.status(201).json({
                    message: "Group created",
                    group: response
                });
            }).catch((err: any) => {
                res.status(500).json({
                    message: err.message
                });
            });
        }
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }
});

const editGroup = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { groupId } = req.params;

    if(!groupId){
        res.status(400).json({
            message: "groupId is required"
        });
        return;
    }
    
    const group = await Group.findOne({ groupId: groupId });

    if(!group){
        res.status(400).json({
            message: "Group does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: group.farmId });

    if(authenticatedRequest.userData.userId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        group.name = name;
        group.save().then((response: any) => {
            res.status(200).json({
                message: "Group updated",
                group: response
            });
        }).catch((err: any) => {
            res.status(500).json({
                message: err.message
            });
        });
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }

});

const getGroup = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { groupId } = req.params;

    if(!groupId){
        res.status(400).json({
            message: "groupId is required"
        });
        return;
    }

    const group = await Group.findOne({ groupId: groupId });

    if(!group){
        res.status(400).json({
            message: "Group does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: group.farmId });

    if(authenticatedRequest.userData.userId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        res.status(200).json({
            group: group
        });
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }
});

const getGroups = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    let {active} = req.query;

    if(!active){
        active = 'true';
    }

    const groups = await Group.find({ farmId: authenticatedRequest.userData.farmId, isActive: active});

    if(!groups){
        res.status(400).json({
            message: "Groups do not exist"
        });
        return;
    }

    try {
        res.status(200).json({
            groups: groups
        });
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }
});

export { createGroup, editGroup, getGroup, getGroups };