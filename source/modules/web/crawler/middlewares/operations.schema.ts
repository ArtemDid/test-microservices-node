import Joi from 'joi';

export const operationSchema = Joi.object({
  domain: Joi.string().uri().required().trim().max(255),
});

export const statusSchema = Joi.object({
  id: Joi.string().required().trim().max(255),
});
