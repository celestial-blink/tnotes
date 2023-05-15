import React, { useEffect, createContext, useState } from "react";
import type { ReactNode } from "react";

type TypeProps = {
    children: React.Consumer<null>,
    promise: () => Promise<any>
};

const ContextTawait = createContext(null);

// const Tawait = ({ children, promise }: TypeProps) => {
//     const [data, setData] = useState<any>(null);
//     useEffect(() => {
//         promise().then(res => {
//             setData(res);
//         }).catch(err => {
//             console.log(err);
//         })
//     }, []);

//     return data === null
//         ? new Promise(() => { })
//         : <ContextTawait.Provider value={data}>
//             <ContextTawait.Consumer>
//                 {/* { children } */}
//             </ContextTawait.Consumer>
//         </ContextTawait.Provider>
// }

// export default Tawait;
