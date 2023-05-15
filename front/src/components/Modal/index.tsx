import { useEffect } from "react";
import type { MouseEvent } from "react";
import { useContextModal } from "@contexts/ContextModal";

import { IconX } from "@tabler/icons-react";

const Modal = () => {
    const { component, toggleShow } = useContextModal();

    const handleClose = (event: MouseEvent<HTMLDivElement>) => {
        const { dataset } = event.target as HTMLDivElement;
        if (dataset.evref === "handleClose") toggleShow();
    }

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, []);

    return (
        <div className="bg-black bg-opacity-10 fixed h-full w-full top-0 left-0 flex justify-center px-2 py-5 overflow-x-hidden overflow-y-auto z-10 md:p-10 dark:bg-opacity-40" onDoubleClick={handleClose} data-evref="handleClose">
            <div className="bg-white w-max min-w-[300px] max-w-3xl h-max rounded shadow-md dark:bg-slate-700 dark:text-white">
                <div className="border-b flex justify-end p-1 dark:border-slate-400">
                    <button onClick={() => { toggleShow() }}><IconX /></button>
                </div>
                <div className="p-2">
                    {component}
                </div>
            </div>

        </div>
    );
}

export default Modal;
