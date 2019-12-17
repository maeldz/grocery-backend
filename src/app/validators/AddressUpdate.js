import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      postal_code: Yup.number(),
      street: Yup.string(),
      street_n: Yup.number(),
      neighborhood: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      complement: Yup.string(),
      reference: Yup.string(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
