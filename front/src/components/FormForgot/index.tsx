import { Link } from "react-router-dom";

const FormForgot = () => {
    return (
        <>
        <div className="w-full flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-cyan-900"></div>
            <h2 className="text-cyan-900 text-4xl">Olvide mi contraseña</h2>
        </div>
        <form className="is__form w-full gap-7 flex flex-col text-lg">
            <div className="w-full">
                <fieldset className="wrap__input">
                    <label className="label text-cyan-900" htmlFor="email">Correo</label>
                    <input type="email" className="input" name="email" id="email" />
                    <p></p>
                </fieldset>
            </div>
            <input type="submit" className="is__button__primary input" value="Continuar" />
            <p className="text-center">Regresar a <Link to="/auth/login" className="is__link">Inicio de session</Link></p>
        </form>
    </>
    );
}

export default FormForgot;
