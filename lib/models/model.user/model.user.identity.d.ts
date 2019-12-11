/**
 * Module Dependencies
 */
import { Document, Model } from 'mongoose';
import { IToken } from '../model.authentication/model.token';
import { IValidationResponse } from './methods.user.authentication';
export interface IUserIdentity extends Document {
    owner: Document;
    emailPrimary: string;
    emails: string[];
    type: string;
    key: string;
    source: string;
    tsValidated?: Date;
    tsAccessed?: Date[];
    tsCreated: Date;
    tsUpdated: Date;
    generateToken: (type: string, duration: number) => Promise<IToken | Error>;
}
export interface IUserIdentityModel extends Model<IUserIdentity> {
    validateWithToken: (hash: string) => Promise<IValidationResponse>;
}
export declare const constants: {
    token: {
        validateIdentity: string;
    };
};
export declare const UserIdentity: IUserIdentityModel;
//# sourceMappingURL=model.user.identity.d.ts.map