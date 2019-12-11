export declare const key = "password";
export declare const category = "auth";
export default function configure(): Promise<{
    generatePasswordHash: (password: string) => Promise<string>;
    authenticatePassword: (passwrod: string, hash: string) => Promise<boolean>;
    trim: number;
    minLength: number;
}>;
//# sourceMappingURL=config.auth.password.d.ts.map