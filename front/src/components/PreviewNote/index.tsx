import { useEffect, useState } from "react";

import { filter } from "@api/Note";

type TypeData = {
    _id: string, description: string, isDraft: boolean, title: string
}

let abortFetch: AbortController = new AbortController();

const PreviewNote = ({ id }: { id: string }) => {

    const [data, setData] = useState<null | TypeData>(null);

    const initialize = () => {
        abortFetch = new AbortController();
    }

    const handleFetchData = async (id: string) => {
        const fetchData = await filter<{ result: [TypeData] }>({
            fields: ["title", "description", "isDraft"],
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
        </div>
        : <p>Cargando...</p>
}

export default PreviewNote;
