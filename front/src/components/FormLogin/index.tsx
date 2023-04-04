import { useReducer, useEffect } from "react";
import { Link } from "react-router-dom";

import type { ChangeEvent, FormEvent } from "react";

import { ActionTypes, initialState, reducer } from "./reducer";
import { Login } from "@api/Auth";

const FormLogin = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const loginAbort = new AbortController();


    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
        dispatch({
            name: event.target.name,
            payload: event.target.value,
            type: ActionTypes.SET_VALUE
        });

    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { email, password } = state;
        const fetchData = await Login({ email, password }, loginAbort.signal);
        console.log("🚀 ~ file: index.tsx:26 ~ handleOnSubmit ~ fetchData:", fetchData)
    };

    useEffect(() => {
        return () => {
            loginAbort.abort();
        }
    }, []);

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 className="text-cyan-900 text-4xl">Iniciar session</h1>
            </div>
            <form className="is__form w-full gap-7 flex flex-col text-lg" onSubmit={handleOnSubmit}>
                <div className="w-full">
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="email">Correo</label>
                        <input type="email" className="input" value={state.email} onChange={handleOnChange} name="email" id="email" />
                        <p></p>
                    </fieldset>
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="password">Contraseña</label>
                        <input type="password" className="input" value={state.password} onChange={handleOnChange} name="password" id="password" />
                        <p></p>
                    </fieldset>
                    <Link to="#" className="is__link block text-right color">Olvide mi contraseña</Link>
                </div>

                <p></p>
                <input type="submit" className="is__button__primary input" value="Iniciar session" />
                <p className="text-center">Si no estas registrado <Link to="/auth/register" className="is__link">registrate aqui</Link></p>
            </form>
        </>
    );
}

export default FormLogin;
