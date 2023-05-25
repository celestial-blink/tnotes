import { useEffect } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { IconUserCircle } from "@tabler/icons-react";
import { Logout } from "@api/Auth";

let logoutAbort: AbortController | null = null;

import Storage from "@helpers/Storage";

const TitleMobile = () => {
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
        return () => {
            logoutAbort?.abort();
        }
    }, []);

    return (
        <div className="bg-white p-2 rounded flex justify-between items-center border-b sticky top-0 left-0 z-10 dark:bg-slate-700 dark:text-white dark:border-b-slate-600 md:hidden">
            <h1 className="text-2xl font-semibold">TNotes</h1>
            <details className="details">
                <summary className="list-none text-cyan-900 cursor-pointer p-1 rounded dark:text-white dark:border-slate-400">
                    <IconUserCircle size={36} stroke={1.4} />
                </summary>
                <menu className="as-menu absolute bg-white p-2 right-[15px] rounded w-max flex gap-2 flex-col text-sm dark:bg-slate-800">
                    <li>
                        <a href="#" onClick={handleCLoseSession}>Cerrar Session</a>
                    </li>
                </menu>
            </details>
        </div>
    );
}

export default TitleMobile;
