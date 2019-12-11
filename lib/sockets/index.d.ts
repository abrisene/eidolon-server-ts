import socketIO from 'socket.io';
import Server from '../Server';
/**
 * Interface
 */
export interface IEidolonSocketFunction {
    app: socketIO.Server;
    server: Server;
}
export default function (io: socketIO.Server, server: Server): Promise<void>;
//# sourceMappingURL=index.d.ts.map