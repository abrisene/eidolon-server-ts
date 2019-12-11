import Mailgen from 'mailgen';
export interface IEmail {
    fromName?: string;
    from: string;
    to: string | string[];
    subject: string;
    text: string;
    html: string;
}
/**
 * Wrapper method for sending emails. Currently only supports mailgun.
 * @param options Options to define the body of the email and who to send it to.
 * @param service The service to use to send the email.
 */
export declare function sendEmail(options: IEmail, service?: string): Promise<any>;
/**
 * Uses Mailgen to generate a HTML Email Template.
 * @param theme Theme to use. Defaults to 'default'.
 */
export declare function getEmailGenerator(theme?: string): Mailgen;
//# sourceMappingURL=index.d.ts.map