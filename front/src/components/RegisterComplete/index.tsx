import { useLocation, Navigate } from "react-router-dom";

const RegisterComplete = () => {

    const location = useLocation();

    return (
        location.state?.confirmed ?
            <div className="text-center text-base md:text-lg">
                <h1 className="text-cyan-900 mb-4 text-2xl md:text-3xl">Tu cuenta ha sido habilitada!</h1>
                <p>Ya puedes iniciar sesion y empezar a usar nuestros servicios.</p>
                <a href="#" className="is__button__primary px-9 py-3 inline-block mt-3 w-max rounded">Iniciar session</a>
            </div> : <Navigate to={"/auth/login"} replace={true} />
    );
}

export default RegisterComplete;
