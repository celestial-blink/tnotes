import { useState } from "react";

import { filter } from "@api/Note";

export type TypeDataResult = [{ _id: string, title: string, createdAt: string, isDraft: boolean }];
export type TypeDataTotal = { total: number, totalPages: number, currentPage: number };
export type TypeFilters = { includeDraft: boolean, onlyDraft: boolean, title: string, offset: number, sorttype: number };

const prepareQuery = (payload: TypeFilters): string => {
    const { title, includeDraft, onlyDraft, ...rest } = payload;
    const preparePayload = {
        ...rest,
        ...(title.trim() ? { title } : {}),
        ...(includeDraft || onlyDraft ? {} : { isDraft: false }),
        ...(onlyDraft ? { isDraft: true } : {})
    }
    const query = Object.entries(preparePayload).map(([key, value]) => `${key}=${value}`).join("&");
    return query;
}

const useNotes = () => {

    const [data, setData] = useState<TypeDataResult | null>(null);
    const [dataTotal, setDataTotal] = useState<TypeDataTotal | null>(null);

    const [filters, setFilters] = useState<TypeFilters>({
        includeDraft: true,
        onlyDraft: false,
        offset: 0,
        sorttype: -1,
        title: ""
    });

    const onFetchData = async (abort: AbortController) => {
        const fetchData = await filter<{ total: TypeDataTotal, result: TypeDataResult }>({
            fields: ["_id", "title", "createdAt", "isDraft"],
            query: prepareQuery(filters)
        }, abort.signal);
        if (fetchData.state) {
            setData(fetchData.data.result);
            setDataTotal(fetchData.data.total);
        }
    };

    const onSetFilter = (payload: Partial<TypeFilters>) => {
        setFilters(mdata => ({ ...mdata, ...payload }));
    }

    return ({
        data, filters, dataTotal, onFetchData, onSetFilter, setData, setDataTotal
    });
};

export default useNotes;
