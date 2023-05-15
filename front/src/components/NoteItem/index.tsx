import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { IconNotes, IconDots, IconCheck, IconX } from "@tabler/icons-react";

interface IProps {
    id: string;
    title: string;
    isDraft: boolean;
    createAt: string;
    onClickMenu?: (arg: { id?: string, action: string, payload?: string }) => void,
    onClickItem: (id: string) => void
};

const evrefClose: Array<string> = ["update", "delete"];

const NoteItem = ({ id, title, isDraft, createAt, onClickMenu, onClickItem }: IProps) => {

    const refDetails = useRef<HTMLDetailsElement>(null);

    const [showConfirmDelete, setConfirmDelete] = useState<boolean>(false);

    const handleCloseDetails = () => {
        if (refDetails.current) refDetails.current.open = false;
    }

    const handleClickMenuItem = (event: MouseEvent<HTMLMenuElement | HTMLButtonElement>) => {
        const { dataset } = event.target as HTMLButtonElement;
        if (evrefClose.includes(dataset?.action ?? "")) handleCloseDetails();
        if (dataset?.action === "confirm-delete") {
            setConfirmDelete(true);
        } else {
            setConfirmDelete(false);
        }
        onClickMenu?.({
            action: dataset?.action ?? "",
            id,
            payload: isDraft.toString()
        });
    }

    const handleClickItem = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onClickItem(id);
    }

    return (
        <div className="flex flex-wrap justify-between border rounded gap-1 p-2 items-center bg-slate-100 dark:bg-slate-600 dark:text-white dark:border-none">
            <div className="flex gap-1 flex-1 h-full items-center justify-between">
                <div className="flex gap-1 flex-1">
                    <IconNotes width={24} className="flex-none" />
                    <h2> <a href="#" onClick={handleClickItem}>{title}</a></h2>
                </div>
                <div className="text-xs flex flex-col items-end flex-[.5]">
                    {isDraft ? <span className="block px-2 py-1 bg-gray-300 rounded w-max dark:text-slate-800">Borradores</span> : null}
                    <span className="block text-slate-500 mt-1 text-right dark:text-slate-200">Creado el {createAt}</span>
                </div>
            </div>
            <details className="details relative" ref={refDetails}>
                <summary className="list-none text-cyan-900 cursor-pointer dark:text-slate-200">
                    <IconDots size={32} className="ml-1"/>
                </summary>
                <menu className="as-menu absolute bg-white p-1 right-0 rounded w-max flex flex-col dark:bg-slate-700" onClick={handleClickMenuItem}>
                    <li> <button data-action="update" className="text-right p-1 w-full hover:bg-slate-200 dark:hover:bg-slate-500">Editar</button> </li>
                    <li> <menu className={`w-full ${showConfirmDelete ? "bg-red-500 text-white flex justify-evenly" : "hover:bg-slate-200"}`}>
                        {
                            showConfirmDelete ? <>
                                <li> <button className="p-1 text-right" data-action="delete"> <IconCheck className="inline-block" /> </button> </li>
                                <li> <button className="p-1 text-right" data-action="cancel-delete"> <IconX className="inline-block" /> </button> </li>
                            </> : <li> <button className="p-1 w-full hover:bg-slate-200 text-right dark:hover:bg-slate-500" data-action="confirm-delete"> Eliminar </button> </li>
                        }
                    </menu> </li>
                    <li> <button data-action="asDraft" className="p-1 w-full cursor-pointer hover:bg-slate-200 text-right disabled:opacity-60 disabled:bg-slate-200 disabled:cursor-not-allowed dark:hover:bg-slate-500"> {isDraft ? "Quitar de" : "Agregar a"} borradores</button> </li>
                </menu>
            </details>
        </div>
    );
}

export default NoteItem;
