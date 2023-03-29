import { Link } from "react-router-dom";

const FormRegister = () => {
    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 className="text-cyan-900 text-4xl">Registrate</h1>
            </div>
            <form className="is__form w-full gap-7 flex flex-col text-lg">
                <div className="w-full">
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="email">Correo</label>
                        <input type="email" className="input" name="email" id="email" />
                        <p></p>
                    </fieldset>
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="password">Contraseña</label>
                        <input type="password" className="input" name="password" id="password" />
                        <p>asdsa</p>
                    </fieldset>
                    <fieldset className="wrap__input">
                        <label className="label text-cyan-900" htmlFor="repeat_password">Repetir contraseña</label>
                        <input type="password" className="input" name="repeat_password" id="repeat_password" />
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
