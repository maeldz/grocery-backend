import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      user_id: Yup.number(),
      date: Yup.date(),
      status: Yup.string(),
      ship_postal_code: Yup.string().max(8),
      ship_street: Yup.string(),
      ship_street_n: Yup.number(),
      ship_neighborhood: Yup.string(),
      ship_city: Yup.string(),
      ship_state: Yup.string(),
      ship_complement: Yup.string(),
      ship_reference: Yup.string(),
      delivery_fee: Yup.number(),
      discount: Yup.number(),
      subtotal: Yup.number(),
      total: Yup.number(),
      products: Yup.array(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
