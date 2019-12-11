import mongoose from 'mongoose';
export declare const key = "mongodb";
export declare const category = "database";
export default function configure(): Promise<{
    url: string;
    client: mongoose.Connection;
}>;
//# sourceMappingURL=config.db.mongodb.d.ts.map