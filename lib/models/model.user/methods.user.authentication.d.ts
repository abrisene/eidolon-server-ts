import { ISchemaFragment } from '../../utilities';
import { IUser } from './model.user.schema';
export interface ILoginResponse {
    user?: IUser;
    jwt?: string;
    err?: Error;
    info?: any;
}
export interface IValidationResponse {
    success: boolean;
    msg?: string;
    err?: Error;
}
export interface ISocialProfile {
    id: string;
    email: string;
    emails: string[];
    displayName?: string;
    gender?: string;
    metadata?: object;
}
export declare const constants: {
    token: {
        resetPassword: string;
    };
};
declare const schema: ISchemaFragment;
export default schema;
//# sourceMappingURL=methods.user.authentication.d.ts.map