import Joi from "joi";

const editGroupValidatorSchema = Joi.object({
    name: Joi.string(),
    liveStockCount: Joi.number(),
    currentPadockId: Joi.string(),
    lastUpdated: Joi.date(),
    isActive: Joi.boolean()
});

const editGroupValidator = (req: any, res: any, next: any) => {
    const { error } = editGroupValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default editGroupValidator;