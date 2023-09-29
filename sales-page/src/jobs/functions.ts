import { Airtable } from "@trigger.dev/airtable";
import { client } from "@/trigger";
import { Stripe } from "@trigger.dev/stripe";

const airtable = new Airtable({
  id: "airtable",
  token: process.env.AIRTABLE_TOKEN,
});

const stripe = new Stripe({
  id: "stripe",
  apiKey: process.env.STRIPE_API_KEY!,
});


client.defineJob({
  id: "save-customer",
  name: "Save Customer Details",
  version: "0.0.1",
  integrations: {airtable},
  trigger: stripe.onCheckoutSessionCompleted(),
  
  run: async (payload, io, ctx) => {
    const { customer_details } = payload
    
    await io.logger.info("Getting event from Stripe!🎉");
    await io.logger.info(JSON.stringify(customer_details))

    await io.logger.info("Adding data to Airtable🎉");
    const table = io.airtable.base(process.env.AIRTABLE_BASE_ID!).table(process.env.AIRTABLE_TABLE_ID!);

   await table.createRecords("create records", [
      {
        fields: {Name: customer_details?.name!, Email: customer_details?.email! },
      },
   ]);

    await io.logger.info(
      "✨ Congratulations, New customer added! ✨"
    );
  },
});
