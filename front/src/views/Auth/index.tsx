import { Outlet, useLocation } from "react-router-dom";

const selectImage: Record<string, string> = {
    register_message: "register-message.png",
    register_complete: "register-complete.svg",
    default: "started.png",
}

const Auth = () => {
    const outlet = useLocation();

    return (
        <main className="is__wrap text-base max-w-5xl">
            <div className="custom__shadow bg-white rounded-md p-5 flex flex-col items-center justify-between sm:flex-row">
                <img src={`/${selectImage[outlet.pathname.split("/").at(-1) ?? ""] ?? selectImage.default}`} className="w-6/12 md:w-5/12" alt="start" />
                <div className="flex flex-col w-full md:max-w-sm">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}

export default Auth;
