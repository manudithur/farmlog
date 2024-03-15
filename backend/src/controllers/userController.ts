
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";
import User  from "../models/User";
import jwt from 'jsonwebtoken';


interface RegisterRequestBody {
    role: string;
    email: string;
    password: string;
    name: string;
    farmId: string;
}

const register = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as unknown as RegisterRequestBody;
    const { role, email, password, name, farmId } = body;

    const newUser = new User({
        role,
        email,
        password,
        name,
        farmId
    });

    const verifyEmail = await User.findOne({ email: email });
    try{

        if (verifyEmail) {
            res.status(400).json({
                message: "Email already exists"
            });
        } else{
            newUser.userId = uuidv4();
            bcrypt.hash(newUser.password, 10).then((hash: string) => {
                newUser.password = hash;
                newUser.save().then((response: any) => {
                    res.status(201).json({
                        message: "User created",
                        user: response
                    });
                }).catch((err: any) => {
                    res.status(500).json({
                        message: err.message
                    });
                });
                    
                
            });
        }

    } catch (err: any) {
        res.status(412).json({
            message: err.message
        });
    }

});

interface LoginRequestBody {
    email: string;
    password: string;
}

const login = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as unknown as LoginRequestBody;
    const { email, password } = body;

    const user = await User.findOne({ email: email });

    if(!user){
        res.status(404).json({
            message: "User not found"
        });
        return;
    }

    try{
        if (user) {
            bcrypt.compare(password, user.password).then((match: boolean) => {
                if (match) {
                    
                    let token = jwt.sign(
                        {   email: user.email,
                            userId: user.userId,
                            role: user.role,
                            farmId: user.farmId,
                            name: user.name.first
                        },
                        process.env.JWT_SECRET as string,
                        { 
                            expiresIn: "24h" 
                        }
                    );

                    res.status(200).json({
                        token: token,
                        message: "Login successful"
                    });

                } else {
                    res.status(401).json({
                        message: "Authentication Failed"
                    });
                }
            });
        } else {
            res.status(404).json({
                message: "User not found"
            });
        }
    } catch (err: any) {
        res.status(412).json({
            message: err.message
        });
    }
});

const profile = asyncHandler(async (req: Request, res: Response) => {
    const {id} = req.params;

    if (!id) {
        res.status(400).json({
            message: "User ID is required"
        });
        return;
    }

    try{
        const user = await User.findOne({ userId: id });
        if (user) {
            res.status(200).json({
                user: user
            });
        } else {
            res.status(404).json({
                message: "User not found"
            });
        }
    } catch (err: any) {
        res.status(412).json({
            message: err.message
        });
    }
});

export { register, login, profile}