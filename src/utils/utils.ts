import Joi from 'joi'
import jwt from 'jsonwebtoken'

export const createAccountSchema = Joi.object().keys({
    user_id: Joi.string().required(),
    account_status: Joi.string().required()
});

export const fundAccountSchema = Joi.object().keys({
    account_id: Joi.string().required(),
    amount: Joi.number().required()
});

export const withdrawFundsSchema = Joi.object().keys({
    account_id: Joi.string().required(),
    amount: Joi.number().required()
});

export const transferFundsSchema = Joi.object().keys({
    from_account_id: Joi.string().required(),
    to_account_id: Joi.string().required(),
    amount: Joi.number().required()
});


export const registerSchema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    date_of_birth: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    phone_number: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirm_password: Joi.ref("password")
}).with('password', 'confirm_password')

export const loginSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),

})

//Generate Token
export const generateToken = (user: { [key: string]: unknown }): unknown => {

    try {
        const pass = process.env.JWT_SECRET as string
        return jwt.sign(user, pass, { expiresIn: '1d' })
    } catch (err) {
        throw err
    }
}

export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
}