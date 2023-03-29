import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import ContextModalProvider, { ContextModal } from "@contexts/ContextModal";
import Modal from "@components/Modal";

const Provider = ({ children }: { children: ReactNode }) => {
    return (
        <ContextModalProvider>
            {children}
            <ContextModal.Consumer>
                {
                    ({ show }) => (show ? createPortal(<Modal />, document.getElementById("modal") as Element) : null)
                }
            </ContextModal.Consumer>
        </ContextModalProvider>
    );
}

export default Provider;
