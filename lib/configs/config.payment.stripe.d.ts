import Stripe from 'stripe';
export declare const key = "stripe";
export declare const category = "payment";
export default function configure(): Promise<{
    secretKey: string;
    publicKey: string;
    client: Stripe;
}>;
//# sourceMappingURL=config.payment.stripe.d.ts.map