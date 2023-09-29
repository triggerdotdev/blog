// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {} as any)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price: process.env.PRODUCT_ID,
      quantity: 1
    }], mode: "payment", success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: "http://localhost:3000"
  })

  res.status(200).json({ session: session.url })
}
