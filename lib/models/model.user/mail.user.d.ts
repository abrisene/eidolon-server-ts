/**
 * Sends an email to the user asking them to validate their email address.
 * @param to A valid email address to send the email to.
 * @param token An email validation token id to be sent with the email.
 */
export declare function sendValidationEmail(to: string[] | string, token: string): Promise<any>;
/**
 * Generates a password reset email to send to the user.
 * @param to A valid email address to send the email to.
 * @param token An password reset token id to be sent with the email.
 */
export declare function sendPasswordResetEmail(to: string[] | string, token: string): Promise<any>;
//# sourceMappingURL=mail.user.d.ts.map