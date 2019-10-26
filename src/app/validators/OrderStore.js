import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      status: Yup.string().required(),
      addressee: Yup.string().required(),
      ship_postal_code: Yup.string()
        .max(8)
        .required(),
      ship_street: Yup.string().required(),
      ship_street_n: Yup.number().required(),
      ship_neighborhood: Yup.string().required(),
      ship_city: Yup.string().required(),
      ship_state: Yup.string().required(),
      ship_complement: Yup.string(),
      ship_reference: Yup.string(),
      delivery_fee: Yup.number(),
      discount: Yup.number(),
      payment_method: Yup.string().required(),
      payment_condition: Yup.number().when(
        'payment_method',
        (payment_method, field) =>
          payment_method === 'credit_card' ? field.required() : field,
      ),
      cc_brand: Yup.string().when('payment_method', (payment_method, field) =>
        payment_method === 'credit_card' ? field.required() : field,
      ),
      cc_last_4_digits: Yup.number().when(
        'payment_method',
        (payment_method, field) =>
          payment_method === 'credit_card' ? field.required() : field,
      ),
      products: Yup.array().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
