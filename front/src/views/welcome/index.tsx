import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <main className="is__wrap text-base">
            <div className="bg-white rounded-md p-5 flex flex-col items-center justify-between md:flex-row">
                <img src="./started.png" className="hidden md:w-5/12 md:block" alt="start" />
                <div className="flex flex-col h-full justify-between text-center items-center gap-5">
                    <h1 className="flex-none text-4xl text-cyan-600 font-bold mb-5">Bienvenidos a <span className="text-cyan-900">TNOTES</span></h1>
                    <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid recusandae, voluptate assumenda beatae exercitationem libero?</p>
                    <img src="./started.png" className="block max-w-xs md:hidden md:w-4/12" alt="start" />
                    <Link to="/auth/login" className="is__button__primary px-20 py-2 w-ful rounded md:max-w-sm">Comenzar</Link>
                    <p className="">Si no estas registrado, <Link to="/auth/register" className="is__link">registrate aqui</Link></p>
                </div>
            </div>
        </main>
    );
}

export default Welcome;
