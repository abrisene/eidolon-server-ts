interface IJwtOptions {
    issuer?: string;
    audience?: string;
    expiration?: string;
    subject?: string;
}
export declare const key = "jwt";
export declare const category = "auth";
export default function configure(): Promise<{
    generateJWT: (options: IJwtOptions) => string;
    secretKey: string;
    issuer: string;
    audience: string;
    expiration: string;
}>;
export {};
//# sourceMappingURL=config.auth.jwt.d.ts.map