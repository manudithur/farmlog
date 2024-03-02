

import Joi from "joi";

const groupUpdateValidatorSchema = Joi.object({
    title: Joi.string().required(),
    message: Joi.string(),
    date: Joi.date().required(),

    type: Joi.string().valid('movement', 'health',  'death', 'birth').required(),
    paddockId: Joi.string(),
    groupId: Joi.string().required()
});

const createGroupUpdateValidator = (req: any, res: any, next: any) => {
    const { error } = groupUpdateValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default createGroupUpdateValidator;
