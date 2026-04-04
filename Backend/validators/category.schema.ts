import Joi from "joi";

export const createCategorySchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    slug: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(500).allow(""),
    color: Joi.string().allow(""),
    glowColor: Joi.string().allow(""),
    images: Joi.array().items(Joi.string()),
})

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(50),
    slug: Joi.string().min(2).max(50),
    description: Joi.string().max(500).allow(""),
    color: Joi.string().allow(""),
    glowColor: Joi.string().allow(""),
    images: Joi.array().items(Joi.string()),
})
