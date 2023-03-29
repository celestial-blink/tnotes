import { Link } from "react-router-dom";

const FormLogin = () => {
    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 className="text-cyan-900 text-4xl">Iniciar session</h1>
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
                        <input type="email" className="input" name="password" id="password" />
                        <p></p>
                    </fieldset>
                    <Link to="#" className="is__link block text-right color">Olvide mi contraseña</Link>
                </div>

                <input type="submit" className="is__button__primary input" value="Iniciar session" />
                <p className="text-center">Si no estas registrado <Link to="/auth/register" className="is__link">registrate aqui</Link></p>
            </form>
        </>
    );
}

export default FormLogin;
