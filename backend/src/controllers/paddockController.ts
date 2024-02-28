import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";
import Farm from '../models/Farm';
import { AuthenticatedRequest } from '../validators/authenticated';
import User from '../models/User';
import Paddock from '../models/Paddock';

interface CreatePaddockRequestBody {
    paddockId: String,
    farmId: String,
    name: String,
    area: Number,
    shape: {lat: Number, lng: Number}[] 
}

const createPaddock = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const farm = await Farm.findOne({ farmId: req.body.farmId });

    if(!farm){
        res.status(400).json({
            message: "Farm does not exist"
        });
        return;
    }
    
    if(farm.ownerId != authenticatedRequest.userData.userId){
        console.log(authenticatedRequest.userData.userId);
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    const verifyPaddock = await Paddock.findOne({ name: req.body.name, farmId: req.body.farmId });

    try {
        if(verifyPaddock){
            res.status(400).json({
                message: "Paddock already exists"
            });
        } else{
            const newPaddock = new Paddock(req.body);
            newPaddock.paddockId = uuidv4();
            newPaddock.save().then((response: any) => {
                res.status(201).json({
                    message: "Paddock created",
                    paddock: response
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

const deletePaddock = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { paddockId } = req.params;

    if(!paddockId){
        res.status(400).json({
            message: "paddockId is required"
        });
        return;
    }

    const paddock = await Paddock.findOne({ paddockId: paddockId });

    if(!paddock){
        res.status(400).json({
            message: "Paddock does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: paddock.farmId });

    if(authenticatedRequest.userData.userId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if(paddock.liveStockGroupId || paddock.agriculturalProcessId){
        res.status(400).json({
            message: "Paddock is in use"
        });
        return;
    }

    try{
        Paddock.deleteOne({ paddockId: paddockId }).then(() => {
            res.status(200).json({
                message: "Paddock deleted"
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
})

const editPaddock = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { paddockId } = req.params;

    if(!paddockId){
        res.status(400).json({
            message: "paddockId is required"
        });
        return;
    }

    const paddock = await Paddock.findOne({ paddockId: paddockId });

    if(!paddock){
        res.status(400).json({
            message: "Paddock does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: paddock.farmId });

    if(authenticatedRequest.userData.farmId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try{
        paddock.updateOne(req.body).then(() => {
            res.status(200).json({
                message: "Paddock updated"
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


const getPaddockById = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { paddockId } = req.params;

    if(!paddockId){
        res.status(400).json({
            message: "paddockId is required"
        });
        return;
    }

    const paddock = await Paddock.findOne({ paddockId: paddockId });

    if(!paddock){
        res.status(400).json({
            message: "Paddock does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: paddock.farmId });

    if(authenticatedRequest.userData.farmId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try{
        res.status(200).json({
            message: "Paddock found",
            paddock: paddock
        });
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }

});

const getPaddocksByFarmId = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { farmId } = req.params;

    if(!farmId){
        res.status(400).json({
            message: "farmId is required"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: farmId });

    if(!farm){
        res.status(400).json({
            message: "Farm does not exist"
        });
        return;
    }

    if(authenticatedRequest.userData.userId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try{
        const paddocks = await Paddock.find({ farmId: farmId });
        res.status(200).json({
            message: "Paddocks found",
            paddocks: paddocks
        });
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }

});



export { createPaddock, deletePaddock, editPaddock, getPaddockById, getPaddocksByFarmId };