

import Joi from "joi";

const editFarmValidatorSchema = Joi.object({
    name: Joi.string(),
    location: Joi.array().items(Joi.number()).length(2)
});

const editFarmValidator = (req: any, res: any, next: any) => {
    const { error } = editFarmValidatorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export default editFarmValidator;