
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";
import Farm from '../models/Farm';
import { AuthenticatedRequest } from '../validators/authenticated';
import User from '../models/User';

interface CreateFarmRequestBody {
    name: String,
    ownerId: String,
    location: [] 
}

const createFarm = asyncHandler(async (req: Request, res: Response) => {
    const requestBody = req.body as unknown as CreateFarmRequestBody;
    const { name, ownerId, location } = requestBody;

    const newFarm = new Farm({
        name,
        ownerId,
        location
    });

    const user = await User.findOne({ userId: ownerId });
    
    if(!user){
        res.status(400).json({
            message: "User does not exist"
        });
        return;
    }

    const verifyFarm = await Farm.findOne({ name: name });

    try{
        if(verifyFarm){
            res.status(400).json({
                message: "Farm already exists"
            });
        } else{
            newFarm.farmId = uuidv4();
            newFarm.save().then((response: any) => {
                res.status(201).json({
                    message: "Farm created",
                    farm: response
                });

                User.findOne({ userId: ownerId }).then((user: any) => {
                    user.farmId = response.farmId;
                    user.save();
                });

            }).catch((err: any) => {
                res.status(500).json({
                    message: err.message
                });
            });
        }
    } catch(err: any){
        res.status(412).json({
            message: err.message
        });
    }

})

const editFarm = asyncHandler(async (req: Request, res: Response) => {
    const requestBody = req.body as unknown as CreateFarmRequestBody;
    const { name, location } = requestBody;

    const { farmId } = req.params;

    
    const authenticatedRequest = req as AuthenticatedRequest;
    const farm = await Farm.findOne({ ownerId: authenticatedRequest.userData.userId, farmId: farmId });

    try{
        if(!farm){
            res.status(400).json({
                message: "Farm not found"
            });
        } else{
            name ? farm.name = name : farm.name;
            location ? farm.location = location : farm.location;
            farm.save().then((response: any) => {
                res.status(201).json({
                    message: "Farm updated",
                    farm: response
                });
            }).catch((err: any) => {
                res.status(500).json({
                    message: err.message
                });
            });
        }
    } catch(err: any){
        res.status(412).json({
            message: err.message
        });
    }
})

export { createFarm, editFarm };