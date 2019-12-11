import PubNub from 'pubnub';
export declare const key = "pubnub";
export declare const category = "pubsub";
export default function configure(): Promise<{
    publishKey: string;
    subscribeKey: string;
    secretKey: string;
    client: PubNub;
}>;
//# sourceMappingURL=config.pubsub.pubnub.d.ts.map