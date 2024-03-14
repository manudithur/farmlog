import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";
import Farm from '../models/Farm';
import { AuthenticatedRequest } from '../validators/authenticated';
import User from '../models/User';
import Field from '../models/Field';

const createfield = asyncHandler(async (req: Request, res: Response) => {
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

    const verifyfield = await Field.findOne({ name: req.body.name, farmId: req.body.farmId });

    try {
        if(verifyfield){
            res.status(400).json({
                message: "field already exists"
            });
        } else{
            const newfield = new Field(req.body);
            newfield.fieldId = uuidv4();
            newfield.save().then((response: any) => {
                res.status(201).json({
                    message: "field created",
                    field: response
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

const deletefield = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { fieldId } = req.params;

    if(!fieldId){
        res.status(400).json({
            message: "fieldId is required"
        });
        return;
    }

    const field = await Field.findOne({ fieldId: fieldId });

    if(!field){
        res.status(400).json({
            message: "field does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: field.farmId });

    if(authenticatedRequest.userData.userId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if(field.liveStockGroupId || field.agriculturalProcessId){
        res.status(400).json({
            message: "field is in use"
        });
        return;
    }

    try{
        field.deleteOne({ fieldId: fieldId }).then(() => {
            res.status(200).json({
                message: "field deleted"
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

const editfield = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { fieldId } = req.params;

    if(!fieldId){
        res.status(400).json({
            message: "fieldId is required"
        });
        return;
    }

    const field = await Field.findOne({ fieldId: fieldId });

    if(!field){
        res.status(400).json({
            message: "field does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: field.farmId });

    if(authenticatedRequest.userData.farmId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try{
        field.updateOne(req.body).then(() => {
            res.status(200).json({
                message: "field updated"
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


const getfieldById = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedRequest = req as unknown as AuthenticatedRequest;

    const { fieldId } = req.params;

    if(!fieldId){
        res.status(400).json({
            message: "fieldId is required"
        });
        return;
    }

    const field = await Field.findOne({ fieldId: fieldId });

    if(!field){
        res.status(400).json({
            message: "field does not exist"
        });
        return;
    }

    const farm = await Farm.findOne({ farmId: field.farmId });

    if(authenticatedRequest.userData.userId != farm.ownerId){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try{
        res.status(200).json({
            message: "field found",
            field: field
        });
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }

});

const getfieldsByFarmId = asyncHandler(async (req: Request, res: Response) => {
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
        const fields = await Field.find({ farmId: farmId });
        res.status(200).json({
            message: "fields found",
            fields: fields
        });
    } catch(err: any){
        res.status(500).json({
            message: err.message
        });
    }

});



export { createfield, deletefield, editfield, getfieldById, getfieldsByFarmId };