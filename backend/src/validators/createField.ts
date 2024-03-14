
import Joi from "joi";

const createfieldValidatorSchema = Joi.object({
    farmId: Joi.string().required(),
    name: Joi.string().required(),
    area: Joi.number().required(),
    shape: Joi.array().items(Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required()
    })).required(),
    center: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required()
    }).required()
});

const createfieldValidator = (req: any, res: any, next: any) => {
    const { error } = createfieldValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default createfieldValidator;