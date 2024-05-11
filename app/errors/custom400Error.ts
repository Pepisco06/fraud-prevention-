import Joi from "joi";

const custom400Error = (joiError: Joi.ValidationError) => {
  return { error: { message: joiError.details[0].message } };
};

export default custom400Error;
