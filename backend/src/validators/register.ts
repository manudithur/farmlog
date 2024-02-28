import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const registerValidatorSchema = Joi.object({
    role: Joi.string().required(),

    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),

    name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
    }).required(),

    farmId: Joi.string().required(),
});

const registerValidator = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerValidatorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};



export default registerValidator;
