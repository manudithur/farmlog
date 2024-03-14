

import Joi from "joi";

const createFarmValidatorSchema = Joi.object({
    name: Joi.string().required(),
    center: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required()
    }).required()
});

const createFarmValidator = (req: any, res: any, next: any) => {
    const { error } = createFarmValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default createFarmValidator;