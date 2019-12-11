import { v1 as neo4j } from 'neo4j-driver';
export declare const key = "neo4j";
export declare const category = "database";
export default function configure(): Promise<{
    url: string;
    username: string;
    password: string;
    client: neo4j.Driver;
}>;
//# sourceMappingURL=config.db.neo4j.d.ts.map