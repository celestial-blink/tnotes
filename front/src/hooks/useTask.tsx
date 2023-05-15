import { useState } from "react";
import { filter } from "@api/Task";

export type TypeDataResult = [{ _id: string, title: string, createdAt: string, isDraft: boolean, isComplete: boolean, endDate: string }];
export type TypeDataTotal = { total: number, totalPages: number, currentPage: number };
export type TypeFilters = {
    includeDraft: boolean, onlyDraft: boolean,
    includeComplete: boolean, onlyComplete: boolean,
    onlyPending: boolean,
    title: string, offset: number, sorttype: number
};

const prepareQuery = (payload: TypeFilters): string => {
    const { title, includeDraft, onlyDraft, includeComplete, onlyComplete, onlyPending, ...rest } = payload;
    const preparePayload = {
        ...rest,
        ...(title.trim() ? { title } : {}),
        ...(includeDraft || onlyDraft || onlyPending ? {} : { isDraft: false }),
        ...(onlyDraft && !onlyPending ? { isDraft: true } : {}),
        ...(includeComplete || onlyComplete || onlyPending ? {} : { isComplete: false }),
        ...(onlyComplete && !onlyPending ? { isComplete: true } : {}),
        ...(onlyPending ? { isComplete: false, isDraft: false } : {})
    }

    const query = Object.entries(preparePayload).map(([key, value]) => `${key}=${value}`).join("&");
    return query;
}

const useTask = () => {

    const [data, setData] = useState<TypeDataResult | null>(null);
    const [dataTotal, setDataTotal] = useState<TypeDataTotal | null>(null);

    const [filters, setFilters] = useState<TypeFilters>({
        includeDraft: true,
        onlyDraft: false,
        includeComplete: true,
        onlyComplete: false,
        onlyPending: false,
        offset: 0,
        sorttype: -1,
        title: ""
    });

    const onFetchData = async (abort: AbortController) => {
        const fetchData = await filter<{ total: TypeDataTotal, result: TypeDataResult }>({
            fields: ["_id", "title", "createdAt", "isDraft", "endDate", "isComplete"],
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
}

export default useTask;
