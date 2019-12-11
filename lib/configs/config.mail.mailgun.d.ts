import { NodeMailgun } from 'ts-mailgun';
export declare const key = "mailgun";
export declare const category = "mail";
export default function configure(): Promise<{
    secretKey: string;
    publicKey: string;
    domain: string;
    client: NodeMailgun;
}>;
//# sourceMappingURL=config.mail.mailgun.d.ts.map