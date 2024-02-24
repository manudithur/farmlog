
import Joi from "joi";

const editPaddockValidatorSchema = Joi.object({
    name: Joi.string(),
    area: Joi.number(),
    liveStockGroupId: Joi.string(),
    agriculturalProcessId: Joi.string(),
    crop: Joi.string()
});

const editPaddockValidator = (req: any, res: any, next: any) => {
    const { error } = editPaddockValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default editPaddockValidator;