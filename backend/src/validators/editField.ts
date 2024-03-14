
import Joi from "joi";

const editfieldValidatorSchema = Joi.object({
    name: Joi.string(),
    area: Joi.number(),
    liveStockGroupId: Joi.string(),
    agriculturalProcessId: Joi.string(),
    crop: Joi.string(),
    shape: Joi.array().items(Joi.object({
        lat: Joi.number(),
        lng: Joi.number()
    }))
});

const editfieldValidator = (req: any, res: any, next: any) => {
    const { error } = editfieldValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default editfieldValidator;