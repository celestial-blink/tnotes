import { useReducer, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { create, filter, update } from "@api/Note";
import { initialState, reducer, ActionTypes, type IInitialValues } from "./reducer";

type TypeProps = {
    id?: string,
    action?: string,
    onSuccessForm?: () => void
};

let abortFetch: AbortController | null = null;

const FormNote = ({ id, action, onSuccessForm }: TypeProps) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const { checked } = event.target as HTMLInputElement;
        dispatch({
            name,
            payload: name === "isDraft" ? checked : value,
            type: ActionTypes.SET_VALUE
        });
    };

    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const fetchData = await (action === "update" ? update : create)(state);
        if (fetchData.state) {
            onSuccessForm?.();
        }
    };

    const handleFetchData = async (id: string) => {
        const fetchData = await filter<{ result: [IInitialValues] }>({
            fields: ["title", "description", "isDraft"],
            query: `_id=${id}&typeresult=onlyresult`
        }, abortFetch?.signal);

        if (fetchData.state && fetchData.data.result.length) {
            dispatch({
                type: ActionTypes.SET_VALUE_MULTIPLE,
                payload: fetchData.data.result[0],
                name: ""
            });
        }
    };

    const initialize = () => {
        abortFetch = new AbortController();
    }

    useEffect(() => {
        initialize();
        if (id) handleFetchData(id);
        return () => abortFetch?.abort();
    }, []);

    return (
        <form className="is__form w-full gap-3 flex flex-col text-lg min-w-[330px]" onSubmit={handleOnSubmit}>
            <legend className="text-2xl text-cyan-900 dark:text-white">Agregar nueva tarea</legend>
            <div className="w-full">
                <fieldset className="wrap__input gap-2">
                    <div className="flex flex-col">
                        <label className="label text-cyan-900 dark:text-white" htmlFor="title">Titulo</label>
                        <input type="text" className="input" name="title" id="title" value={state.title} onChange={handleOnChange} maxLength={120} required />
                    </div>

                    <div className="flex flex-col">
                        <label className="label text-cyan-900 dark:text-white" htmlFor="description">Descripción</label>
                        <textarea className="input" name="description" id="description" value={state.description} onChange={handleOnChange} cols={30} rows={10} required></textarea>
                    </div>

                    <label className="select-none cursor-pointer">
                        <input type="checkbox" name="isDraft" id="isDraft" checked={state.isDraft} onChange={handleOnChange} /> Guardar en borradores
                    </label>

                    <div className="flex gap-2 mt-5 justify-between">
                        <div></div>
                        <input type="submit" className="is__button__primary px-3 py-1 rounded" value={action === "update" ? "Actualizar" : "Guardar"} />
                    </div>
                </fieldset>
            </div>
        </form>
    );
    ;
}

export default FormNote;
