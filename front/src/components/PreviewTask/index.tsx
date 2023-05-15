import { useEffect, useState } from "react";
import { format } from "date-fns";

import { filter } from "@api/Task";

type TypeData = {
    _id: string, description: string, isDraft: boolean, title: string,
    isComplete: string, endDate: string | null
}

let abortFetch: AbortController = new AbortController();

const PreviewTask = ({ id }: { id: string }) => {

    const [data, setData] = useState<null | TypeData>(null);

    const initialize = () => {
        abortFetch = new AbortController();
    }

    const handleFetchData = async (id: string) => {
        const fetchData = await filter<{ result: [TypeData] }>({
            fields: ["title", "description", "isDraft", "isComplete", "endDate"],
            query: `_id=${id}&typeresult=onlyresult`
        }, abortFetch?.signal);

        if (fetchData.state && fetchData.data.result.length) {
            setData(fetchData.data.result[0]);
        }
    };

    useEffect(() => {
        initialize();
        if (id) handleFetchData(id);
        return () => abortFetch?.abort();
    }, []);

    return data
        ? <div className="w-full gap-2 flex flex-col text-lg min-w-[330px]">
            <h2 className="font-bold">{data.title}</h2>
            <p className="text-base">{data.description}</p>
            {
                data.endDate !== null
                    ? <p className="text-base"><strong>Fecha limite:</strong> {format(new Date(data.endDate), "dd 'de' MMMM 'del' yyyy ")} </p>
                    : null
            }
        </div>
        : <p>Cargando...</p>
}

export default PreviewTask;
