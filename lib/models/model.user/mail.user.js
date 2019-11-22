"use strict";
/*
 * mail.user.ts
 * User Email Templates and Methods
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Module Dependencies
 */
const configs_1 = __importDefault(require("../../configs"));
const services_1 = require("../../services");
/*
 * Methods
 */
/**
 * Generates an email validation email to be sent to the user.
 * @param to A valid email address to send the email to.
 * @param token An email validation token id to be sent with the email.
 */
function generateValidationEmail(to, token) {
    const { appName } = configs_1.default.getConfig('environment');
    const { client } = configs_1.default.getConfig('uris');
    const generator = services_1.getEmailGenerator();
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
function generatePasswordResetEmail(to, token) {
    const { appName } = configs_1.default.getConfig('server');
    const { client } = configs_1.default.getConfig('uris');
    const generator = services_1.getEmailGenerator();
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
function sendValidationEmail(to, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const template = generateValidationEmail(to, token);
        return services_1.sendEmail(template);
    });
}
exports.sendValidationEmail = sendValidationEmail;
/**
 * Generates a password reset email to send to the user.
 * @param to A valid email address to send the email to.
 * @param token An password reset token id to be sent with the email.
 */
function sendPasswordResetEmail(to, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const template = generatePasswordResetEmail(to, token);
        return services_1.sendEmail(template);
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=mail.user.js.map