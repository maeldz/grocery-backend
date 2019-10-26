import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      product_id: Yup.number().required(),
      quantity: Yup.number().required(),
      unit: Yup.string().required(),
      from: Yup.number().required(),
      to: Yup.number().required(),
      expires_in: Yup.number().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
