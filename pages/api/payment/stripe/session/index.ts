const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        const { email, priceId } = req.body;
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          ui_mode: 'embedded',
          customer_email: email,
          billing_address_collection: 'auto',
          shipping_address_collection: {
            allowed_countries: ['GB'],
          },
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of
              // the product you want to sell
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          return_url: `${req.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
          automatic_tax: { enabled: true },
        });

        res.send({ clientSecret: session.client_secret });
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
      break;
    case 'GET':
      try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

        res.send({
          status: session.status,
          customer_email: session.customer_details.email,
        });
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
      break;
    default:
      res.setHeader('Allow', req.method);
      res.status(405).end('Method Not Allowed');
  }
}
