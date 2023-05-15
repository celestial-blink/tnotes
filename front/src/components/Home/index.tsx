import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ContextUser } from "@views/Dashboard";

import { filter } from "@api/Note";
import { countPending } from "@api/Task";

import ItemLastNote, { SkeletonItemLastNote } from "./_itemLastNote";

type TypeLastNotes = {
    _id: string,
    title: string
};

type TypeTotal = {
    total: number,
    totalComplete: number,
    percentTotal: number
};

let filterAbort: AbortController | null = null;
let filterTaskAbort: AbortController | null = null;

const Home = () => {

    const { name } = useContext(ContextUser);
    const [lastNotes, setLastNotes] = useState<Array<TypeLastNotes> | null>(null);
    const [pendingTask, setPendingTask] = useState<TypeTotal | null>(null);

    const handleLastNotes = async () => {
        const fetchData = await filter({
            fields: ["_id", "title"],
            query: "rowcount=5&sorttype=-1"
        }, filterAbort?.signal ?? null);

        setLastNotes(fetchData.state ? (fetchData.data?.result ?? null) : null);
    };

    const taskPending = async () => {
        const fetchData = await countPending(filterTaskAbort?.signal ?? null);
        if (fetchData.state && filterAbort?.signal.aborted === false) {
            const preparePercentTotal = Math.round((fetchData.data.totalComplete * 100) / fetchData.data.total);
            const preparePendingTask = { ...fetchData.data, percentTotal: fetchData.data.total === 0 ? 0 : preparePercentTotal }
            setPendingTask(preparePendingTask);
        }
    }

    const initialize = () => {
        filterAbort = new AbortController();
        filterTaskAbort = new AbortController();
    }

    useEffect(() => {
        initialize();
        handleLastNotes();
        taskPending();
        return () => {
            filterAbort?.abort();
            filterTaskAbort?.abort();
        }
    }, []);

    return (
        <div className="flex flex-col text-slate-800 gap-1 text-base">
            <section className="custom__shadow p-3 bg-white rounded dark:bg-slate-700 dark:text-white">
                <h1 className="font-semibold text-2xl">Hola {name}</h1>
            </section>
            <section className="custom__shadow p-3 bg-white rounded dark:bg-slate-700 dark:text-white">
                <h2 className="font-semibold text-xl">Mis actividades</h2>
                <div className="flex relative gap-3 mt-2 items-center">
                    <div className="relative text-center">
                        <svg height="110" width="110">
                            <circle className="fill-none w-full h-full" cx="50%" cy="50%" r="50" strokeWidth={10} strokeDasharray={315} strokeDashoffset={0} stroke="#e8ebed"></circle>
                            <circle className="fill-none w-full h-full" cx="50%" cy="50%" r="50" strokeWidth={10} strokeDasharray={315} strokeDashoffset={315 - (315 * (pendingTask?.percentTotal ?? 0) / 100)} stroke="#6c7a89"></circle>
                        </svg>
                        <span className="absolute m-auto top-[35%] text-2xl left-0 w-full">{pendingTask?.percentTotal}%</span>
                    </div>
                    <p>
                        {
                            pendingTask?.total === 0
                                ? <>No tienes ninguna tarea pendiente <br /> Empieza a <strong>agregar nuevas tareas </strong> </>
                                : <>El {pendingTask?.percentTotal}% de tus tareas están completas <br /> Tienes <strong>{pendingTask && `${pendingTask.total - pendingTask.totalComplete}`} tareas</strong> por completar</>
                        }
                    </p>
                </div>
                <Link to={`/task/${pendingTask?.total === 0 ? "" : "pending"}`} className="is__button__primary px-5 py-2 inline-block mt-4 rounded">
                    {
                        pendingTask?.total === 0
                            ? <>Ir a mis tareas pendientes</>
                            : <>Ver mis {pendingTask && `${pendingTask.total - pendingTask.totalComplete} tareas pendientes ` || "todas mis tareas"}</>
                    }
                </Link>
            </section>
            <section className="custom__shadow p-3 bg-white rounded dark:bg-slate-700 dark:text-white">
                <h2 className="font-semibold text-xl">Agregar nuevo</h2>
                <p>Agrega una nueva nota o una nueva tarea.</p>
                <div className="flex gap-3">
                    <Link to="/note/add" className="is__button__primary px-4 py-2 inline-block mt-4 rounded">Agregar nota</Link>
                    <Link to="/task/add" className="is__button__primary px-4 py-2 inline-block mt-4 rounded">Agregar tarea</Link>
                </div>
            </section>
            <div className="flex gap-1 flex-col md:flex-row">
                <section className="custom__shadow p-3 bg-white rounded w-full dark:bg-slate-700 dark:text-white">
                    <h2 className="font-semibold text-xl">Mis ultimas notas</h2>
                    <ul className="flex flex-col gap-2 mt-2 ">
                        {
                            lastNotes !== null ?
                                (lastNotes.length ?
                                    lastNotes.map(item => <ItemLastNote _id={item._id} key={item._id} title={item.title} />)
                                    : <li>Sin resultados</li>)
                                : <>
                                    <SkeletonItemLastNote />
                                    <SkeletonItemLastNote />
                                    <SkeletonItemLastNote />
                                    <SkeletonItemLastNote />
                                </>
                        }
                    </ul>
                    <div className="text-right">
                        {
                            lastNotes !== null ?
                                (lastNotes.length ? <Link to="#" className="is__button__primary px-5 py-2 inline-block mt-4 rounded">Ver todos</Link> : null)
                                : <p className="p-6 w-[100px] text-right mt-4 inline-block rounded bg-slate-200 animate-pulse"></p>
                        }
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
