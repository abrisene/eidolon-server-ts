import Ably from 'ably';
export declare const key = "ably";
export declare const category = "pubsub";
export default function configure(): Promise<{
    secretKey: string;
    publicKey: string;
    client: Ably.Realtime;
}>;
//# sourceMappingURL=config.pubsub.ably.d.ts.map