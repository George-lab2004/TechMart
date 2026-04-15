import Joi from "joi";

const imageSchema = Joi.object({
    url: Joi.string().required(),
    alt: Joi.string().required(),
});

export const createCategorySchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    slug: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(500).allow(""),
    color: Joi.string().allow(""),
    glowColor: Joi.string().allow(""),
    images: Joi.array().items(imageSchema),
})

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(50),
    slug: Joi.string().min(2).max(50),
    description: Joi.string().max(500).allow(""),
    color: Joi.string().allow(""),
    glowColor: Joi.string().allow(""),
    images: Joi.array().items(imageSchema),
})
