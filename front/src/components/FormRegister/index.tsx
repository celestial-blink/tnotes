import { useReducer, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { ChangeEvent, FormEvent, FocusEvent } from "react";

import { reducer, initialState, ActionTypes } from "./reducer";
import { Register } from "@api/Auth";

const inputPatterns = {
    name: {
        pattern: /\w{3,40}/i,
        messageError: "Mínimo 3 caracteres, No se permite caracteres especiales"
    },
    password: {
        pattern: /[^ ]{8,40}/i,
        messageError: "Mínimo 8 caracteres"
    }
};

const FormRegister = () => {
    const navigate = useNavigate();
    const refFieldsetForm = useRef<HTMLFieldSetElement>(null);
    const refMessageForm = useRef<HTMLParagraphElement>(null);
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
        dispatch({
            name: event.target.name,
            payload: event.target.value,
            type: ActionTypes.SET_VALUE
        });

    const handleOnValidate = (event: FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "name" || name === "password") {
            const { nextElementSibling } = event.target;
            if (!inputPatterns[name].pattern.test(value) && nextElementSibling?.tagName === "P") {
                nextElementSibling.textContent = inputPatterns[name].messageError;
            } else {
                if (nextElementSibling?.tagName === "P") {
                    nextElementSibling.textContent = "";
                }
            }
        }
    }

    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { email, name, password, repeat_password } = state;
        if (password !== repeat_password || !email || !name) return;
        if (refFieldsetForm.current) refFieldsetForm.current.disabled = true;
        const fetchData = await Register({ password, email, name });
        if (refFieldsetForm.current) refFieldsetForm.current.disabled = false;
        if (fetchData.state) {
            navigate("/auth/register_complete", { replace: true, state: { confirmed: true } })
        } else {
            if (refMessageForm.current) refMessageForm.current.textContent = fetchData.message;
        }
    }

    return (
        <>
            <div className="w-full flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 className="text-cyan-900 text-4xl">Regístrate</h1>
            </div>
            <form className="is__form w-full gap-7 flex flex-col text-lg" onSubmit={handleOnSubmit}>
                <fieldset className="w-full flex gap-2 flex-col" ref={refFieldsetForm}>
                    <div className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="name">Nombre</label>
                        <input type="text" className="input" value={state.name} onBlur={handleOnValidate} onChange={handleOnChange} name="name" id="name" minLength={4} maxLength={40} required />
                        <p className="!text-red-400"></p>
                    </div>
                    <div className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="email">Correo</label>
                        <input type="email" className="input" value={state.email} onChange={handleOnChange} name="email" id="email" required />
                        <p></p>
                    </div>
                    <div className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="password">Contraseña</label>
                        <input type="password" className="input" value={state.password} onBlur={handleOnValidate} onChange={handleOnChange} name="password" id="password" minLength={8} required />
                        <p className="!text-red-400"></p>
                    </div>
                    <div className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="repeat_password">Repetir contraseña</label>
                        <input type="password" className="input" value={state.repeat_password} onChange={handleOnChange} name="repeat_password" id="repeat_password" minLength={8} required />
                    </div>
                    <p className="!text-red-400 text-center" ref={refMessageForm}></p>
                    <input type="submit" className="is__button__primary input mt-2" value="Continuar" />
                </fieldset>
                <p className="text-center">Si ya tienes una cuenta <Link to="/auth/login" className="is__link">inicia aqui</Link></p>
            </form>
        </>
    );
}

export default FormRegister;
