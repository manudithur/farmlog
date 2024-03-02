import Joi from "joi";

const createGroupValidatorSchema = Joi.object({
    name: Joi.string().required(),
    liveStockCount: Joi.number().required(),
    currentPadockId: Joi.string()
});

const createGroupValidator = (req: any, res: any, next: any) => {
    const { error } = createGroupValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default createGroupValidator;

