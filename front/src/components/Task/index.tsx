import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { format } from "date-fns";
import { IconFilter, IconArrowDown, IconArrowUp, IconSquare } from "@tabler/icons-react";
import Pagination from "@components/Pagination";

import TaskItem, { SkeletonTaskItem } from "@components/TaskItem";
import PreviewTask from "@components/PreviewTask";
import { update } from "@api/Task";

import { useContextModal } from "@contexts/ContextModal";
import useTask from "@hooks/useTask";
import type { TypeDataResult, TypeDataTotal, TypeFilters } from "@hooks/useTask";
import FormTask from "@components/FormTask";
import Search from "@components/Search";

import { type IResponse } from "@helpers/Fetch";
import { filter, remove } from "@api/Task";

import { IconSquareCheckFilled } from "@tabler/icons-react";

type TypeData = { result: TypeDataResult, total: TypeDataTotal };

type TypeLoaderData = IResponse<TypeData>;

let filterAbort: null | AbortController = null;
let changeSearchAbort: null | AbortController = null;

const Task = () => {
    const { is_pending = null } = useParams();
    const refFilter_details = useRef<HTMLDetailsElement>(null);

    const { data, dataTotal, filters, onFetchData, onSetFilter, setData, setDataTotal } = useTask();
    const { loaderData } = useLoaderData() as { loaderData: Promise<TypeLoaderData> };
    const { toggleShow, setComponent, setShow } = useContextModal();
    const [loadFilter, setLoadFilter] = useState<boolean>(false);

    const onSuccessForm = () => {
        if (filterAbort) onFetchData(filterAbort);
        setComponent(null);
        setShow(false);
    }

    const handleAdd = (id?: string, action?: string) => {
        setComponent(<FormTask id={id} action={action} onSuccessForm={onSuccessForm} />);
        toggleShow();
    }

    const handleView = (id: string,) => {
        setComponent(<PreviewTask id={id} />);
        toggleShow();
    }

    const handleDelete = async (id: string = "") => {
        const fetchData = await remove({ _id: id });
        if (fetchData.state) if (filterAbort) onFetchData(filterAbort);
    }

    const handleSetIsDraft = async (id: string = "", payload: boolean) => {
        const fetchData = await update({ _id: id, isDraft: !payload });
        if (fetchData.state) if (filterAbort) onFetchData(filterAbort);
    }

    const handleSetData = (payload: { total: TypeDataTotal, result: TypeDataResult }): void => {
        setData(payload.result);
        setDataTotal(payload.total);
    }

    const handlePagination = async (offset: number = 0) => {
        onSetFilter({ offset });
    }

    const handleClickMenuItem = ({ action, id, payload }: { id?: string, payload?: string, action: string }) => {
        if (action === "update") handleAdd(id, "update");
        if (action === "delete" && id) handleDelete(id);
        if (action === "asDraft" && id) handleSetIsDraft(id, payload === "true");
    }

    const onChangeSearch = async (value: string = "") => {
        const fetchData = await filter<{ result: [{ _id: string, title: string }] }>({
            fields: ["_id", "title"],
            query: `rowcount=5&typeresult=onlyresult&title=${value}`
        }, changeSearchAbort?.signal);
        return fetchData.data.result;
    }

    const handleSubmit = async (value: string = "") => {
        onSetFilter({ title: value });
    }

    const handleFilter = async (payload: Partial<TypeFilters>) => {
        onSetFilter(payload);
    }

    const handleClickFilter = (event: MouseEvent<HTMLDetailsElement | HTMLButtonElement>) => {
        const { dataset, tagName, value } = event.target as HTMLButtonElement;
        if (tagName === "BUTTON" && dataset.evref === "handleClickFilter" && dataset.action && filters.hasOwnProperty(dataset.action)) {
            if (dataset.action === "sorttype") handleFilter({ sorttype: parseInt(value) });
            if (dataset.action === "includeDraft") handleFilter({ includeDraft: !filters.includeDraft });
            if (dataset.action === "onlyDraft") handleFilter({ onlyDraft: !filters.onlyDraft });
            if (dataset.action === "includeComplete") handleFilter({ includeComplete: !filters.includeComplete });
            if (dataset.action === "onlyComplete") handleFilter({ onlyComplete: !filters.onlyComplete });
            if (dataset.action === "onlyPending") handleFilter({ onlyPending: !filters.onlyPending });
        }
    }

    const initialize = () => {
        filterAbort = new AbortController();
        changeSearchAbort = new AbortController();
        if (is_pending && is_pending.toLowerCase() === "pending") {
            handleFilter({ onlyPending: true });
        }
    }

    useEffect(() => {
        if (filterAbort?.signal.aborted === false && loadFilter) {
            onFetchData(filterAbort);
        };
    }, [filters]);

    useEffect(() => {
        initialize();
        loaderData.then((data) => { if (data.state) handleSetData(data.data); setLoadFilter(true) });
        return () => {
            filterAbort?.abort()
            changeSearchAbort?.abort();
        };
    }, []);

    return (
        <>
            <section className="flex flex-col gap-1">
                <section className="rounded bg-white flex items-center gap-2 p-2 z-[2] md:gap-2 dark:bg-slate-700 dark:text-white">
                    <Search onChange={onChangeSearch} onSubmit={handleSubmit} />
                    <button className="is__button__primary py-2 px-4 rounded h-max" onClick={() => { handleAdd() }}>Nuevo</button>
                </section>
                <section className="rounded bg-white flex justify-end gap-5 p-2 relative dark:bg-slate-700 dark:text-white" >
                    <details className="details" onClick={handleClickFilter} ref={refFilter_details}>
                        <summary className="list-none text-cyan-900 cursor-pointer p-1 rounded dark:text-white dark:border-slate-400"> <IconFilter className="inline-block align-bottom" /> Filtros</summary>
                        <menu className="as-menu absolute bg-white p-2 right-[15px] rounded w-max flex gap-2 flex-col text-sm dark:bg-slate-800">
                            <li> <button className={`w-full text-left p-[2px] rounded ${filters.sorttype === 1 ? "bg-slate-200 dark:bg-slate-500" : ""}`} data-action="sorttype" data-evref="handleClickFilter" value={1}> <IconArrowUp className="inline-block align-bottom" /> Ordenar ascendente </button> </li>
                            <li> <button className={`w-full text-left p-[2px] rounded ${filters.sorttype === -1 ? "bg-slate-200 dark:bg-slate-500" : ""}`} data-action="sorttype" data-evref="handleClickFilter" value={-1}> <IconArrowDown className="inline-block align-bottom" /> Ordenar descendente </button> </li>
                            <li className="w-full h-[2px] bg-slate-200"></li>
                            <li> <button className="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyDraft || filters.onlyPending || filters.onlyComplete} data-action="includeDraft" data-evref="handleClickFilter"> {filters.includeDraft ? <IconSquareCheckFilled className={`inline-block align-bottom ${filters.onlyDraft || filters.onlyPending || filters.onlyComplete ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare className="inline-block align-bottom" />} Mostrar borradores </button> </li>
                            <li> <button className="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyPending || filters.onlyComplete} data-action="onlyDraft" data-evref="handleClickFilter"> {filters.onlyDraft ? <IconSquareCheckFilled className={`inline-block align-bottom ${filters.onlyPending ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare className="inline-block align-bottom" />} Solo borradores </button> </li>
                            <li className="w-full h-[2px] bg-slate-200"></li>
                            <li> <button className="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyComplete || filters.onlyPending || filters.onlyDraft} data-action="includeComplete" data-evref="handleClickFilter"> {filters.includeComplete ? <IconSquareCheckFilled className={`inline-block align-bottom ${filters.onlyComplete || filters.onlyPending || filters.onlyDraft ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare className="inline-block align-bottom" />} Mostrar completados </button> </li>
                            <li> <button className="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyPending || filters.onlyDraft} data-action="onlyComplete" data-evref="handleClickFilter"> {filters.onlyComplete ? <IconSquareCheckFilled className={`inline-block align-bottom ${filters.onlyPending ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare className="inline-block align-bottom" />} Solo completados </button> </li>
                            <li className="w-full h-[2px] bg-slate-200"></li>
                            <li> <button className="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyComplete || filters.onlyDraft} data-action="onlyPending" data-evref="handleClickFilter"> {filters.onlyPending ? <IconSquareCheckFilled className={`inline-block align-bottom ${filters.onlyComplete || filters.onlyDraft ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare className="inline-block align-bottom" />} Solo pendientes </button> </li>
                        </menu>
                    </details>
                </section>
                <section className="rounded bg-white p-2 dark:bg-slate-700 dark:text-white">
                    <Pagination title="notas" total={dataTotal?.totalPages ?? 0} current={dataTotal?.currentPage ?? 0} handlePagination={handlePagination} />
                    <div className="flex  flex-col gap-2 mt-2">
                        {
                            data !== null
                                ? (data.length ? data.map(item => <TaskItem key={item._id} id={item._id} title={item.title} createdAt={format(new Date(item.createdAt), "dd MMMM yyyy")} onClickMenu={handleClickMenuItem} isDraft={item.isDraft} onClickItem={handleView} endDate={item.endDate === null ? "--" : format(new Date(item.endDate), "dd MMMM yyyy")} isComplete={item.isComplete} />) : <p>Sin resultados</p>)
                                : <>
                                    <SkeletonTaskItem />
                                    <SkeletonTaskItem />
                                    <SkeletonTaskItem />
                                    <SkeletonTaskItem />
                                    <SkeletonTaskItem />
                                    <SkeletonTaskItem />
                                </>
                        }
                    </div>
                </section>
            </section>

        </>
    );
}

export default Task;
