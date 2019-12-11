/**
 * Module Dependencies
 */
import { Document, Model } from 'mongoose';
import { ILoginResponse, ISocialProfile, IValidationResponse } from './methods.user.authentication';
import { IUserIdentity } from './model.user.identity';
export interface IUser extends Document {
    emailPrimary: string;
    emails: string[];
    identityPrimary: Document;
    identities: Document[];
    roles: string[];
    hash: string[];
    tsLogin: Date[];
    tsCreated: Date;
    tsUpdated: Date;
    generateJWT: (expiration?: string) => Promise<string>;
    authenticatePassword: (password: string) => Promise<boolean>;
    login: (identity: IUserIdentity) => Promise<ILoginResponse>;
    loginPassword: (password: string, identity: IUserIdentity) => Promise<ILoginResponse>;
    loginSocial: (profile: ISocialProfile, identity: IUserIdentity) => Promise<ILoginResponse>;
}
export interface IUserModel extends Model<IUser> {
    requestPasswordReset: (email: string) => Promise<IValidationResponse>;
    setPasswordWithToken: (tokenHash: string, password: string) => Promise<IValidationResponse>;
    authenticateEmail: (email: string, password: string, register?: boolean) => Promise<ILoginResponse>;
    registerEmail: (email: string, password: string) => Promise<ILoginResponse>;
    authenticateSocial: (type: string, profile: ISocialProfile, register?: boolean) => Promise<ILoginResponse>;
    registerSocial: (type: string, profile: ISocialProfile) => Promise<ILoginResponse>;
}
export { ILoginResponse } from './methods.user.authentication';
export declare const User: IUserModel;
//# sourceMappingURL=model.user.schema.d.ts.map