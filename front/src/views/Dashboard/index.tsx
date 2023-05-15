import { useEffect, createContext } from "react";
import type { MouseEvent } from "react";

import { Outlet, Link, useLoaderData, useLocation } from "react-router-dom";
import { IconUserCircle, IconHome, IconChecklist, IconSquareRoundedPlus, IconNotes, IconSettings, IconSun } from '@tabler/icons-react';

import { Logout } from "@api/Auth";
import type { TypeMySession } from "@api/Auth";
import useTheme from "@hooks/useTheme";

import Storage from "@helpers/Storage";

import { IResponse } from "@helpers/Fetch";

export const ContextUser = createContext<TypeMySession>({
    name: "",
    sub: "",
    email: ""
});

let logoutAbort: AbortController | null = null;

const Dashboard = () => {
    const location = useLocation();
    const { toggleDarkMode, dataIsDarkMode } = useTheme();
    const loaderData = useLoaderData() as IResponse<TypeMySession>;

    const handleCLoseSession = async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const fetchData = await Logout(logoutAbort?.signal ?? null);
        if (fetchData.state) {
            const storage = new Storage();
            storage.remove("token");
            window.location.reload();
        }
    }

    const initialize = () => {
        logoutAbort = new AbortController();
    }

    useEffect(() => {
        initialize();
        console.log(dataIsDarkMode);

        return () => {
            logoutAbort?.abort();
        }
    }, []);

    return (
        <main className="is__wrap h-full relative flex gap-1 flex-col items-start md:flex-row md:h-max">
            <div className="overflow-y-auto overflow-x-hidden md:w-5/6 md:inline-block w-full md:overflow-visible md:pr-0" style={{ height: "calc(100% - 60px)" }}>
                <ContextUser.Provider value={loaderData.data}>
                    <Outlet />
                </ContextUser.Provider>
            </div>
            <div className="w-full flex flex-col gap-1 md:w-auto md:sticky md:top-0">
                <section className="hidden custom__shadow rounded w-full bg-white items-center p-1 text-slate-900 md:flex dark:bg-slate-700 dark:text-white">
                    <IconUserCircle stroke={1} size={80} />
                    <div>
                        <p><strong>{loaderData?.data?.name ?? ""}</strong></p>
                        <a href="#" onClick={handleCLoseSession}>Cerrar session</a>
                    </div>
                </section>
                <nav className="custom__shadow rounded-full w-full bg-white md:flex-col md:w-52 md:rounded md:p-1 dark:bg-slate-700 dark:text-white">
                    <ul className="flex justify-between py-2 px-5 md:flex-col md:p-1">
                        <li>
                            <Link to={"/"} className={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.pathname === "/home" ? "bg-slate-500" : ""}`} title="inicio">
                                <IconHome stroke={1.2} size={36} />
                                <span className="hidden md:inline">Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/task"} className={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.pathname === "/task" ? "bg-slate-500" : ""}`}>
                                <IconChecklist stroke={1.2} size={36} />
                                <span className="hidden md:inline">Tareas</span>
                            </Link>
                        </li>
                        <li className="relative">
                            <details className="details">
                                <summary className="flex items-center gap-1 p-1 cursor-pointer rounded hover:bg-slate-200 dark:hover:bg-slate-500">
                                    <IconSquareRoundedPlus stroke={1.2} size={36} />
                                    <span className="hidden md:inline">Agregar</span>
                                </summary>
                                <menu className="as-menu absolute -top-14 -left-[200%] bg-white p-2 rounded w-max flex gap-3 md:-top-1 md:-left-[65%] md:flex-col dark:bg-slate-800">
                                    <li> <Link to={"/note"} className="p-1">Agregar nota</Link> </li>
                                    <li> <Link to={"/task"} className="p-1">Agregar tarea</Link> </li>
                                </menu>
                            </details>
                        </li>
                        <li>
                            <Link to={"/note"} className={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.pathname === "/note" ? "bg-slate-500" : ""}`}>
                                <IconNotes stroke={1.2} size={36} />
                                <span className="hidden md:inline">Notas</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/config"} className={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.pathname === "/config" ? "bg-slate-500" : ""}`}>
                                <IconSettings stroke={1.2} size={36} />
                                <span className="hidden md:inline">Configuración</span>
                            </Link>
                        </li>
                        <li>
                            <button className="flex items-center w-full gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500" onClick={() => { toggleDarkMode() }}>
                                <IconSun stroke={1.2} size={36} />
                                <span className="hidden md:inline">Tema</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </main>
    );
}

export default Dashboard;
