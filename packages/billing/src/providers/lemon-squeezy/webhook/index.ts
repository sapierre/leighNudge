import { HttpStatusCode } from "@turbostarter/shared/constants";
import { HttpException } from "@turbostarter/shared/utils";

import { checkoutStatusChangeHandler } from "../checkout";
import { env } from "../env";
import { subscriptionStatusChangeHandler } from "../subscription";

import { LEMON_SQUEEZY_SIGNATURE_HEADER, relevantEvents } from "./constants";
import { validateSignature } from "./signing";
import { webhookHasData, webhookHasMeta } from "./type-guards";

import type { BillingProviderStrategy } from "../../types";

export const webhookHandler: BillingProviderStrategy["webhookHandler"] = async (
  req,
  callbacks,
) => {
  const body = await req.text();
  const sig = req.headers.get(LEMON_SQUEEZY_SIGNATURE_HEADER);

  if (!sig) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, {
      code: "billing:error.webhook.signatureNotFound",
    });
  }

  await validateSignature(sig, env.LEMON_SQUEEZY_SIGNING_SECRET, body);

  const data = JSON.parse(body);

  if (!webhookHasMeta(data)) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, {
      code: "billing:error.webhook.metaInvalid",
    });
  }

  const type = data.meta.event_name;

  console.log(`🔔  Webhook received: ${type}`);

  if (!webhookHasData(data)) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, {
      code: "billing:error.webhook.dataInvalid",
    });
  }

  if (relevantEvents.has(type)) {
    console.log(`🔔  Relevant event: ${type}`);
    switch (type) {
      case "subscription_created":
        await callbacks?.onSubscriptionCreated?.(data.data.id);
        void subscriptionStatusChangeHandler({
          id: data.data.id,
        });
        break;
      case "subscription_updated":
        await callbacks?.onSubscriptionUpdated?.(data.data.id);
        void subscriptionStatusChangeHandler({
          id: data.data.id,
        });
        break;
      case "subscription_expired":
        await callbacks?.onSubscriptionDeleted?.(data.data.id);
        void subscriptionStatusChangeHandler({
          id: data.data.id,
        });
        break;
      case "order_created":
        await callbacks?.onCheckoutSessionCompleted?.(data.data.id);
        void checkoutStatusChangeHandler({
          id: data.data.id,
        });
        break;
      default:
        throw new HttpException(HttpStatusCode.BAD_REQUEST, {
          code: "billing:error.webhook.unhandledEvent",
        });
    }
  } else {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, {
      code: "billing:error.webhook.unsupportedEvent",
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
