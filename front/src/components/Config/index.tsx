import { useReducer, useRef, useEffect, useContext, useState } from "react";
import type { ChangeEvent, FormEvent, FocusEvent } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { IconUserCircle } from "@tabler/icons-react";

import { reducer, initialState, ActionTypes } from "./reducer";
import { ContextUser } from "@views/Dashboard";
import { update } from "@api/User";
import { ValidatePassword } from "@api/Auth";
import config from "@/config";

let abortSignalUpdate: AbortController | null = null;
let timeoutFetchMessage: null | NodeJS.Timeout = null;
let timeoutPassMessage: null | NodeJS.Timeout = null;

const Config = () => {
    const loaderRoot = useRouteLoaderData("root") as { data: { name: string } };
    const refMessageError = useRef<HTMLParagraphElement>(null);
    const refFetchNameMessage = useRef<HTMLParagraphElement>(null);
    const refFetchPasswordMessage = useRef<HTMLParagraphElement>(null);
    const refDialogConfirm = useRef<HTMLDialogElement>(null);
    const refMessagePassError = useRef<HTMLParagraphElement>(null);
    const [selectForm, setSelectForm] = useState<string>("");
    const [state, dispatch] = useReducer(reducer, initialState);

    const { name, sub, email } = useContext(ContextUser);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (refMessageError.current) refMessageError.current.textContent = "";
        dispatch({
            name,
            payload: value,
            type: ActionTypes.SET_VALUE
        });
    };

    const validatePassword = (event: FocusEvent<HTMLInputElement>) => {
        if (state.new_password && state.new_password !== state.repeat_password) {
            const { nextElementSibling } = event.target;
            if (nextElementSibling && nextElementSibling.tagName === "P") {
                nextElementSibling.textContent = "Las contraseñas no coinciden";
            }
        }
    };

    const onFetchPassport = async () => {
        if (!/[^ ]{8,}/.test(state.new_password) && state.new_password !== state.repeat_password) return;
        const fetchData = await update({
            _id: sub,
            password: state.new_password
        }, abortSignalUpdate?.signal);
        if (timeoutFetchMessage) clearTimeout(timeoutFetchMessage);
        if (refFetchPasswordMessage.current) {
            if (fetchData.state) {
                refFetchPasswordMessage.current.classList.remove("!text-red-500");
                refFetchPasswordMessage.current.classList.add("!text-green-500");
                refFetchPasswordMessage.current.textContent = fetchData.message || "Se guardo los cambios";
            } else {
                refFetchPasswordMessage.current.classList.remove("!text-green-500");
                refFetchPasswordMessage.current.classList.add("!text-red-500");
                refFetchPasswordMessage.current.textContent = fetchData.message || "No se guardo los cambios";
            }
            timeoutFetchMessage = setTimeout(() => {
                if (refFetchPasswordMessage.current) {
                    refFetchPasswordMessage.current.classList.remove("!text-green-500");
                    refFetchPasswordMessage.current.classList.remove("!text-red-500");
                    refFetchPasswordMessage.current.textContent = "";
                }
            }, config.TIMEOUT_TIME)
        }
    }

    const handleOnSubmitPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!state.password_checked) {
            refDialogConfirm.current?.showModal();
            setSelectForm("password");
            return;
        }
        onFetchPassport();
    };

    const onFetchName = async () => {
        const fetchData = await update({
            _id: sub,
            name: state.name
        }, abortSignalUpdate?.signal);
        if (timeoutFetchMessage) clearTimeout(timeoutFetchMessage);
        if (refFetchNameMessage.current) {
            if (fetchData.state) {
                refFetchNameMessage.current.classList.remove("!text-red-500");
                refFetchNameMessage.current.classList.add("!text-green-500");
                refFetchNameMessage.current.textContent = fetchData.message || "Se guardo los cambios";
            } else {
                refFetchNameMessage.current.classList.remove("!text-green-500");
                refFetchNameMessage.current.classList.add("!text-red-500");
                refFetchNameMessage.current.textContent = fetchData.message || "No se guardo los cambios";
            }
            timeoutFetchMessage = setTimeout(() => {
                if (refFetchNameMessage.current) {
                    refFetchNameMessage.current.classList.remove("!text-green-500");
                    refFetchNameMessage.current.classList.remove("!text-red-500");
                    refFetchNameMessage.current.textContent = "";
                }
            }, config.TIMEOUT_TIME)
        }
    }

    const handleOnSubmitName = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!state.password_checked) {
            refDialogConfirm.current?.showModal();
            setSelectForm("name");
            return;
        }
        onFetchName();
    };

    const handleOnSubmitPass = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const fetchData = await ValidatePassword({
            password: event.currentTarget.current_password.value
        });
        if (fetchData.state) {
            refDialogConfirm.current?.close();
            dispatch({
                name: "password_checked",
                payload: true,
                type: ActionTypes.SET_VALUE
            });
            if (selectForm === "name") onFetchName();
            if (selectForm === "password") onFetchPassport();
        } else {
            if (refMessagePassError.current) {
                refMessagePassError.current.textContent = "Las contraseñas no coinciden";
                timeoutPassMessage = setTimeout(() => {
                    if (refMessagePassError.current) refMessagePassError.current.textContent = "";
                }, 4e3);
            }
        }
    }

    const initialize = () => {
        abortSignalUpdate = new AbortController();
        if (refMessagePassError.current) refMessagePassError.current.textContent = "";
        dispatch({
            name: "name",
            payload: loaderRoot.data.name,
            type: ActionTypes.SET_VALUE
        });
    }

    useEffect(() => {
        initialize();
        return () => {
            abortSignalUpdate?.abort();
            if (timeoutFetchMessage) clearTimeout(timeoutFetchMessage);
            if (timeoutPassMessage) clearTimeout(timeoutPassMessage);
            refDialogConfirm.current?.close();
        }
    }, []);

    return (
        <>
            <section>
                <div className="bg-white p-2 dark:bg-slate-700 dark:text-white">
                    <legend className="text-2xl text-cyan-900 dark:text-white">Mi cuenta</legend>
                    <div className="flex items-center py-1 rounded bg-slate-100 dark:bg-slate-800">
                        <IconUserCircle size={120} stroke={1.2} />
                        <h4 className="font-bold">{name} <span className="block font-normal text-base">{email}</span> </h4>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <form className="is__form w-full gap-3 flex flex-col text-lg bg-white dark:bg-slate-700 dark:text-white" onSubmit={handleOnSubmitName}>
                        <fieldset className="wrap__input gap-2">
                            <div className="flex flex-col">
                                <label className="text-base font-semibold" htmlFor="name">Cambiar nombres</label>
                                <input type="text" className="input" value={state.name} onChange={handleOnChange} name="name" id="name" maxLength={40} required />
                            </div>
                            <div className="flex gap-2 mt-2 justify-between items-center">
                                <p className="text-right flex-1 !text-base" ref={refFetchNameMessage}></p>
                                <input type="submit" className="is__button__primary px-3 py-1 rounded" value="Guardar cambios" />
                            </div>
                        </fieldset>
                    </form>
                    <form className="is__form w-full gap-3 flex flex-col text-lg bg-white dark:bg-slate-700 dark:text-white" onSubmit={handleOnSubmitPassword}>
                        <fieldset>
                            <div className="flex flex-col">
                                <label className="text-base font-semibold" htmlFor="new_password">Nueva contraseña</label>
                                <input type="password" className="input out-of-range:border-red-500" value={state.new_password} onChange={handleOnChange} name="new_password" id="new_password" minLength={8} required />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-base font-semibold" htmlFor="repeat_password">Repetir contraseña</label>
                                <input type="password" className="input" value={state.repeat_password} onChange={handleOnChange} onBlur={validatePassword} name="repeat_password" id="repeat_password" min={8} required />
                                <p ref={refMessageError} className="!text-red-500"></p>
                            </div>
                            <div className="flex gap-2 mt-2 justify-between items-center">
                                <p className="text-right flex-1 !text-base" ref={refFetchPasswordMessage}></p>
                                <input type="submit" className="is__button__primary px-3 py-1 rounded" value="Guardar cambios" />
                            </div>
                        </fieldset>
                    </form>
                </div>
            </section>
            <dialog className="shadow-md min-w-[350px]" ref={refDialogConfirm}>
                <form className="flex gap-4 flex-col" onSubmit={handleOnSubmitPass}>
                    <fieldset className="flex flex-col gap-2">
                        <label className="text-base font-semibold" htmlFor="current_password">Ingrese su contraseña</label>
                        <input type="password" className="border rounded p-2" name="current_password" id="current_password" />
                        <p className="text-red-500 text-sm an" ref={refMessagePassError}></p>
                    </fieldset>
                    <div className="flex gap-2 justify-end">
                        <button className="bg-slate-200 rounded text-slate-800 px-5 py-1" type="button" onClick={() => { refDialogConfirm.current?.close() }}>Cancel</button>
                        <button className="bg-cyan-800 rounded text-white px-5 py-1">Continuar</button>
                    </div>
                </form>
            </dialog>
        </>
    );
}

export default Config;
