
import Joi from "joi";

const createPaddockValidatorSchema = Joi.object({
    farmId: Joi.string().required(),
    name: Joi.string().required(),
    area: Joi.number().required()
});

const createPaddockValidator = (req: any, res: any, next: any) => {
    const { error } = createPaddockValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default createPaddockValidator;