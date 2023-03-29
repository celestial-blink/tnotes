import { Outlet, Link } from "react-router-dom";
import { IconUserCircle, IconHome, IconChecklist, IconSquareRoundedPlus, IconNotes, IconSettings } from '@tabler/icons-react';

const Dashboard = () => {


    return (
        <main className="is__wrap h-full relative flex gap-2 flex-col items-start md:flex-row md:h-max">
            <div className="overflow-y-auto overflow-x-hidden md:w-5/6 md:inline-block w-full md:overflow-visible md:pr-0" style={{ height: "calc(100% - 75px)" }}>
                <Outlet />
            </div>
            <div className="w-full flex flex-col gap-1 md:w-auto md:sticky md:top-0">
                <section className="hidden custom__shadow rounded w-full bg-white items-center md:flex">
                    <IconUserCircle stroke={1.2} size={90} />
                    <div>
                        <p><strong>T CODE</strong></p>
                        <a href="#">Cerrar session</a>

                    </div>
                </section>
                <nav className="custom__shadow rounded-full w-full bg-white md:flex-col md:w-52 md:rounded md:p-1">
                    <ul className="flex justify-between py-3 px-5 md:flex-col md:p-1">
                        <li>
                            <Link to={"/"} className="flex items-center gap-1 p-1 rounded hover:bg-slate-200" title="inicio">
                                <IconHome stroke={1.2} size={36} />
                                <span className="hidden md:inline">Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/task"} className="flex items-center gap-1 p-1 rounded hover:bg-slate-200">
                                <IconChecklist stroke={1.2} size={36} />
                                <span className="hidden md:inline">Tareas</span>
                            </Link>
                        </li>
                        <li className="relative">
                            <details className="details">
                                <summary className="flex items-center gap-1 p-1 rounded hover:bg-slate-200">
                                    <IconSquareRoundedPlus stroke={1.2} size={36} />
                                    <span className="hidden md:inline">Agregar</span>
                                </summary>
                                <menu className="as-menu absolute -top-14 -left-[200%] bg-white p-2 rounded w-max flex gap-3 md:-top-1 md:-left-[65%] md:flex-col">
                                    <li> <a className="p-1">Agregar nota</a> </li>
                                    <li> <a className="p-1">Agregar tarea</a> </li>
                                </menu>
                            </details>
                        </li>
                        <li>
                            <Link to={"/note"} className="flex items-center gap-1 p-1 rounded hover:bg-slate-200">
                                <IconNotes stroke={1.2} size={36} />
                                <span className="hidden md:inline">Notas</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/account"} className="flex items-center gap-1 p-1 rounded hover:bg-slate-200">
                                <IconSettings stroke={1.2} size={36} />
                                <span className="hidden md:inline">Configuracion</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </main>
    );
}

export default Dashboard;
