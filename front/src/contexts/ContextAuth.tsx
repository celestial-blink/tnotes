import { createContext, useState, ReactNode } from "react";

interface IContextAuth {

};

export const ContextAuth = createContext<IContextAuth>({});


const ContextAuthProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ContextAuth.Provider value={{}}>
            {children}
        </ContextAuth.Provider>
    );

};

export default ContextAuthProvider;
