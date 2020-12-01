"use strict";
/*
 * mail/index.ts
 * Mail Service Wrapper Module
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailGenerator = exports.sendEmail = void 0;
/*
 * Module Dependencies
 */
const mailgen_1 = __importDefault(require("mailgen"));
const configs_1 = __importDefault(require("../../configs"));
/*
 * Methods
 */
const sendWrapper = {
    mailgun: (options) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { domain, client } = configs_1.default.getConfig('mailgun');
            if (!client)
                throw new Error('Cannot send email: Client is not configured.');
            const { fromName } = options, config = __rest(options, ["fromName"]);
            config.from = fromName
                ? `${fromName} <${config.from}@${domain}>`
                : `${config.from}@${domain}`;
            // return client.messages.create(domain, config);
            client.fromEmail = config.from;
            client.fromTitle = domain;
            return client.send(config.to, config.subject, config.html);
        }
        catch (err) {
            return err;
        }
    }),
};
/*
 * Module Exports
 */
/**
 * Wrapper method for sending emails. Currently only supports mailgun.
 * @param options Options to define the body of the email and who to send it to.
 * @param service The service to use to send the email.
 */
function sendEmail(options, service = 'mailgun') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sendFn = sendWrapper[service];
            if (!sendFn)
                throw new Error(`Cannot send email: Service "${service}" is not found.`);
            return sendFn(options);
        }
        catch (err) {
            console.log(err);
            return err;
        }
    });
}
exports.sendEmail = sendEmail;
/**
 * Uses Mailgen to generate a HTML Email Template.
 * @param theme Theme to use. Defaults to 'default'.
 */
function getEmailGenerator(theme = 'default') {
    const { appName } = configs_1.default.getConfig('environment');
    const { client, logo } = configs_1.default.getConfig('uris');
    return new mailgen_1.default({
        theme,
        product: {
            name: appName,
            link: client,
            logo,
        },
    });
}
exports.getEmailGenerator = getEmailGenerator;
//# sourceMappingURL=index.js.map