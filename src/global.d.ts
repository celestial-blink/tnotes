// declare global {
//     namespace NodeJS {
//         interface ProcessEnv {
//             PORT: number
//         }
//     }
// }


declare namespace Express {
    export interface Request {
        token: string;
    }
}
