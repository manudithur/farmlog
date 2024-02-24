import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const loginValidatorSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginValidator = (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export default loginValidator;