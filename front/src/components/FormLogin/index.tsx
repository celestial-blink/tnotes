import { useReducer, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { ChangeEvent, FormEvent } from "react";

import { ActionTypes, initialState, reducer } from "./reducer";
import { Login } from "@api/Auth";
import Storage from "@helpers/Storage";

const FormLogin = () => {
    const refMessageForm = useRef<HTMLParagraphElement>(null);
    const refFieldsetForm = useRef<HTMLFieldSetElement>(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    let loginAbort: AbortController | null = null;

    const navigate = useNavigate();


    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
        dispatch({
            name: event.target.name,
            payload: event.target.value,
            type: ActionTypes.SET_VALUE
        });

    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (refMessageForm.current) refMessageForm.current.textContent = "";

        const { email, password } = state;
        if (!email || !password) return;
        if (refFieldsetForm.current) refFieldsetForm.current.disabled = true;
        const fetchData = await Login({ email, password }, loginAbort?.signal ?? null);
        if (refFieldsetForm.current) refFieldsetForm.current.disabled = false;
        const storage = new Storage();

        if (fetchData && fetchData.state) {
            storage.setValue({
                key: "token",
                value: fetchData.data.token
            });
            navigate("/");
        } else {
            if (refMessageForm.current) refMessageForm.current.textContent = fetchData.message;
            storage.remove("token");
        }

    };

    const initialize = () => {
        loginAbort = new AbortController();
    }

    useEffect(() => {
        initialize();
        return () => {
            loginAbort?.abort();
        }
    }, []);

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 className="text-cyan-900 text-4xl">Iniciar session</h1>
            </div>
            <form className="is__form w-full gap-7 flex flex-col text-lg" onSubmit={handleOnSubmit}>
                <fieldset className="w-full flex gap-2 flex-col" ref={refFieldsetForm}>
                    <div className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="email">Correo</label>
                        <input type="email" className="input" value={state.email} onChange={handleOnChange} name="email" id="email" required />
                        <p></p>
                    </div>
                    <div className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="password">Contraseña</label>
                        <input type="password" className="input" value={state.password} onChange={handleOnChange} name="password" id="password" required />
                        <p></p>
                    </div>
                    <Link to="#" className="is__link block text-right color">Olvide mi contraseña</Link>
                    <p className="text-red-400 text-center" ref={refMessageForm}></p>
                    <input type="submit" className="is__button__primary input w-full" value="Iniciar session" />
                </fieldset>
                <p className="text-center">Si no estas registrado <Link to="/auth/register" className="is__link">regístrate aquí</Link></p>
            </form>
        </>
    );
}

export default FormLogin;
