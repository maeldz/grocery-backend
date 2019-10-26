import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      quantity: Yup.number(),
      unit: Yup.string(),
      from: Yup.number(),
      to: Yup.number(),
      expires_in: Yup.number(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
