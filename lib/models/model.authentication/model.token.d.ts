/**
 * Module Dependencies
 */
import mongoose from 'mongoose';
import { Typegoose } from '@typegoose/typegoose';
import { IValidationResponse } from '../model.user/methods.user.authentication';
declare class Schema extends Typegoose {
    owner: mongoose.Schema.Types.ObjectId;
    type: String;
    token: String;
    uses: number;
    persist: boolean;
    tsExpiration: Date;
    tsRedeemed: Date[];
    /**
     * Instance Methods
     */
    /**
     * Redeems a token if it has uses remaining and hasn't expired.
     * @param save Should the token be saved during redemption?
     *             If you're using a session you probably want to handle this manually.
     * @param session The session to be used for the redemption transaction.
     */
    redeem(save?: boolean, session?: any): Promise<IValidationResponse>;
}
export declare const Token: import("@typegoose/typegoose").ReturnModelType<typeof Schema, unknown>;
export {};
/**
 * Schema Methods
 */
/**
 * Redeems a token if it has uses remaining and hasn't expired.
 * @param save Should the token be saved during redemption?
 *             If you're using a session you probably want to handle this manually.
 * @param session The session to be used for the redemption transaction.
 */
//# sourceMappingURL=model.token.d.ts.map