import twilio from 'twilio';
export declare const key = "twilio";
export declare const category = "sms";
export default function configure(): Promise<{
    account: string;
    secretKey: string;
    client: twilio.Twilio;
}>;
//# sourceMappingURL=config.sms.twilio.d.ts.map