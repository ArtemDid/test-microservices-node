import { ExpressRequest, ExpressResponse, ExpressNextFunction } from '../types';
import { Schema } from 'joi';

export const validateSchema = (schema: Schema) => {
  return (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) next(error);

    next();
  };
};
