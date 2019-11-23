/*
 * mail/index.ts
 * Mail Service Wrapper Module
 */

/*
 * Module Dependencies
 */

import Mailgen from 'mailgen';
import Configs from '../../configs';

/*
 * Interfaces
 */

export interface IEmail {
  fromName?: string;
  from: string;
  to: string|string[];
  subject: string;
  text: string;
  html: string;
}

interface IEmailFunctionDictionary {
  [key: string]: (options: IEmail) => Promise<any>;
}

/*
 * Methods
 */

const sendWrapper: IEmailFunctionDictionary = {
  mailgun: async (options: IEmail): Promise<any> => {
    try {
      const { domain, client } = Configs.getConfig('mailgun');
      if (!client) throw new Error('Cannot send email: Client is not configured.');
      const { fromName, ...config } = options;
      config.from = fromName
        ? `${fromName} <${config.from}@${domain}>`
        : `${config.from}@${domain}`;

      // return client.messages.create(domain, config);
      client.fromEmail = config.from;
      client.fromTitle = domain;
      return client.send(config.to, config.subject, config.html);
    } catch (err) {
      return err;
    }
  },
};

/*
 * Module Exports
 */

/**
 * Wrapper method for sending emails. Currently only supports mailgun.
 * @param options Options to define the body of the email and who to send it to.
 * @param service The service to use to send the email.
 */
export async function sendEmail(options: IEmail, service = 'mailgun') {
  try {
    const sendFn = sendWrapper[service];
    if (!sendFn) throw new Error(`Cannot send email: Service "${service}" is not found.`);
    return sendFn(options);
  } catch (err) {
    console.log(err);
    return err;
  }
}

/**
 * Uses Mailgen to generate a HTML Email Template.
 * @param theme Theme to use. Defaults to 'default'.
 */
export function getEmailGenerator(theme = 'default') {
  const { appName } = Configs.getConfig('environment');
  const { client, logo } = Configs.getConfig('uris');
  return new Mailgen({
    theme,
    product: {
      name: appName,
      link: client,
      logo,
    },
  });
}
