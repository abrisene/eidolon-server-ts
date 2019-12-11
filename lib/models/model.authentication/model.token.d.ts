/**
 * Module Dependencies
 */
import mongoose, { Document } from 'mongoose';
import { IValidationResponse } from '../model.user/methods.user.authentication';
export interface IToken extends Document {
    owner: Document;
    type: string;
    token: string;
    uses: number;
    persist: boolean;
    tsExpiration: Date;
    tsRedeemed: Date[];
    tsCreated: Date;
    tsUpdated: Date;
    redeem: (save: boolean, session?: any) => Promise<IValidationResponse>;
}
export declare const Token: mongoose.Model<IToken, {}>;
//# sourceMappingURL=model.token.d.ts.map