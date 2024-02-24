

import Joi from "joi";

const createFarmValidatorSchema = Joi.object({
    name: Joi.string().required(),
    ownerId: Joi.string().required(),
    location: Joi.array().items(Joi.number()).length(2).required()
});

const createFarmValidator = (req: any, res: any, next: any) => {
    const { error } = createFarmValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default createFarmValidator;