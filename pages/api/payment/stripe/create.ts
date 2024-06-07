const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { amount, currency } = req.body;
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ client_secret: intent.client_secret });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
}
