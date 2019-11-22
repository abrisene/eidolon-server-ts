/*
 * mail.user.ts
 * User Email Templates and Methods
 */

/*
 * Module Dependencies
 */

import Configs from '../../configs';
import { getEmailGenerator, sendEmail, IEmail } from '../../services';

/*
 * Methods
 */

/**
 * Generates an email validation email to be sent to the user.
 * @param to A valid email address to send the email to.
 * @param token An email validation token id to be sent with the email.
 */
function generateValidationEmail(to: string[]|string, token: string): IEmail {
  const { appName } = Configs.getConfig('environment');
  const { client } = Configs.getConfig('uris');
  const generator = getEmailGenerator();

  const template = {
    body: {
      title: `Welcome to ${appName}`,
      action: {
        instructions: 'Please click the button below to verify your email adddress:',
        button: {
          color: '#007bff',
          text: 'Verify',
          link: `${client}/validate/email/${token}`,
        },
      },
      signature: 'Regards',
    },
  };

  return {
    to,
    from: 'noreply',
    subject: `${appName}: Please Verify Your Email`,
    html: generator.generate(template),
    text: generator.generatePlaintext(template),
  };
}

/**
 * Generates a password reset email to send to the user.
 * @param to A valid email address to send the email to.
 * @param token An password reset token id to be sent with the email.
 */
function generatePasswordResetEmail(to: string[]|string, token: string): IEmail {
  const { appName } = Configs.getConfig('server');
  const { client } = Configs.getConfig('uris');
  const generator = getEmailGenerator();

  const template = {
    body: {
      title: `Reset Your ${appName} Password`,
      intro: 'You have received this email because a password reset request for your account was received.',
      action: {
        instructions: 'Click the button below to reset your password:',
        button: {
          color: '#007bff',
          text: 'Reset',
          link: `${client}/recover/${token}`,
        },
      },
      outro: 'If you did not request a password reset, no further action is required on your part.',
      signature: 'Regards',
    },
  };

  return {
    to,
    from: 'noreply',
    subject: `Reset Your ${appName} Password`,
    html: generator.generate(template),
    text: generator.generatePlaintext(template),
  };
}

/*
 * Module Exports
 */

/**
 * Sends an email to the user asking them to validate their email address.
 * @param to A valid email address to send the email to.
 * @param token An email validation token id to be sent with the email.
 */
export async function sendValidationEmail(to: string[]|string, token: string): Promise<any> {
  const template = generateValidationEmail(to, token);
  return sendEmail(template);
}

/**
 * Generates a password reset email to send to the user.
 * @param to A valid email address to send the email to.
 * @param token An password reset token id to be sent with the email.
 */
export async function sendPasswordResetEmail(to: string[]|string, token: string): Promise<any> {
  const template = generatePasswordResetEmail(to, token);
  return sendEmail(template);
}
