/**
 * Module Dependencies
 */
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FacebookStrategy } from 'passport-facebook';
/**
 * Interfaces
 */
export interface ISocialProfile {
    id: string;
    email: string;
    emails: string[];
    displayName?: string;
    gender?: string;
    metadata?: object;
}
/**
 * Module Exports
 */
/**
 * Builds Google Passport Strategy for Middleware
 */
export declare function authGoogle(): Promise<GoogleStrategy>;
/**
 * Builds Facebook Passport Strategy for Middleware
 */
export declare function authFacebook(): Promise<FacebookStrategy>;
//# sourceMappingURL=auth.social.d.ts.map