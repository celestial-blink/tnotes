import { useReducer } from "react";
import { Link } from "react-router-dom";

import type { ChangeEvent, FormEvent } from "react";

import { reducer, initialState, ActionTypes } from "./reducer";

const FormRegister = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
        dispatch({
            name: event.target.name,
            payload: event.target.value,
            type: ActionTypes.SET_VALUE
        });

    const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 className="text-cyan-900 text-4xl">Registrate</h1>
            </div>
            <form className="is__form w-full gap-7 flex flex-col text-lg" onSubmit={handleOnSubmit}>
                <div className="w-full">
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="email">Correo</label>
                        <input type="email" className="input" value={state.email} onChange={handleOnChange} name="email" id="email" required />
                        <p></p>
                    </fieldset>
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="password">Contraseña</label>
                        <input type="password" className="input" value={state.password} onChange={handleOnChange} name="password" id="password" required />
                        <p>Mínimo 8 caracteres y al menos un carácter especial</p>
                    </fieldset>
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="repeat_password">Repetir contraseña</label>
                        <input type="password" className="input" value={state.repeat_password} onChange={handleOnChange} name="repeat_password" id="repeat_password" required />
                        <p></p>
                    </fieldset>
                </div>

                <input type="submit" className="is__button__primary input" value="Continuar" />
                <p className="text-center">Si ya tienes una cuenta <Link to="/auth/login" className="is__link">inicia aqui</Link></p>
            </form>
        </>
    );
}

export default FormRegister;
