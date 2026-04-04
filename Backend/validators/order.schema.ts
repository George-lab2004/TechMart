import Joi from "joi";

export const createOrderSchema = Joi.object({
    orderItems: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            qty: Joi.number().integer().min(1).required(),
            image: Joi.string().required(),
            price: Joi.number().min(0).required(),
            _id: Joi.string().required(),
        })
    ).min(1).required(),
    shippingAddress: Joi.object({
        streetNumber: Joi.string().allow(""),
        buildingNumber: Joi.string().allow(""),
        floorNumber: Joi.string().allow(""),
        apartmentNumber: Joi.string().allow(""),
        city: Joi.string().required(),
        country: Joi.string().required(),
        landmark: Joi.string().allow(""),
        notes: Joi.string().allow(""),
        postalCode: Joi.number(),
        phone: Joi.string().allow(""),
    }).required(),
    paymentMethod: Joi.string().valid("stripe", "paypal", "cod").required(),
    itemsPrice: Joi.number().min(0).required(),
    taxPrice: Joi.number().min(0).required(),
    shippingPrice: Joi.number().min(0).required(),
    totalPrice: Joi.number().min(0).required(),
})

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid("pending", "processing", "shipped", "delivered", "cancelled").required()
})
