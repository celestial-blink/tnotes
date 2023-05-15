import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { useLoaderData } from "react-router-dom";
import { format } from "date-fns";
import { IconFilter, IconArrowDown, IconArrowUp, IconSquare } from "@tabler/icons-react";

import Pagination from "@components/Pagination";
import NoteItem from "@components/NoteItem";
import { SkeletonTaskItem } from "@components/TaskItem";
import PreviewNote from "@components/PreviewNote";
import { update } from "@api/Note";

import { useContextModal } from "@contexts/ContextModal";
import useNotes from "@hooks/useNote";
import type { TypeDataResult, TypeDataTotal, TypeFilters } from "@hooks/useNote";
import FormNote from "@components/FormNote";
import Search from "@components/Search";

import { IResponse } from "@helpers/Fetch";

import { filter, remove } from "@api/Note";
import { IconSquareCheckFilled } from "@tabler/icons-react";

type TypeData = { result: TypeDataResult, total: TypeDataTotal };

type TypeLoaderData = IResponse<TypeData>;

let filterAbort: null | AbortController = null;
let changeSearchAbort: null | AbortController = null;

const Note = () => {

    const refFilter_details = useRef<HTMLDetailsElement>(null);

    const { data, dataTotal, filters, onFetchData, onSetFilter, setData, setDataTotal } = useNotes();
    const { loaderData } = useLoaderData() as { loaderData: Promise<TypeLoaderData> };
    const { toggleShow, setComponent, setShow } = useContextModal();

    const onSuccessForm = () => {
        if (filterAbort) onFetchData(filterAbort);
        setComponent(null);
        setShow(false);
    }

    const handleAdd = (id?: string, action?: string) => {
        setComponent(<FormNote id={id} action={action} onSuccessForm={onSuccessForm} />);
        toggleShow();
    }

    const handleView = (id: string,) => {
        setComponent(<PreviewNote id={id} />);
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
        }
    }

    const initialize = () => {
        filterAbort = new AbortController();
        changeSearchAbort = new AbortController();
    }

    useEffect(() => {
        if (filterAbort?.signal.aborted === false) {
            onFetchData(filterAbort);
        };
    }, [filters]);

    useEffect(() => {
        initialize();
        loaderData.then((data) => { if (data.state) handleSetData(data.data); });
        return () => {
            filterAbort?.abort()
            changeSearchAbort?.abort();
        };
    }, []);

    return (
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
                        <li> <button className="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyDraft} data-action="includeDraft" data-evref="handleClickFilter"> {filters.includeDraft ? <IconSquareCheckFilled className={`inline-block align-bottom ${filters.onlyDraft ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare className="inline-block align-bottom" />} Mostrar borradores </button> </li>
                        <li> <button className="w-full text-left" data-action="onlyDraft" data-evref="handleClickFilter"> {filters.onlyDraft ? <IconSquareCheckFilled className="inline-block align-bottom text-green-500" /> : <IconSquare className="inline-block align-bottom" />} Solo borradores </button> </li>
                    </menu>
                </details>
            </section>
            <section className="rounded bg-white p-2 dark:bg-slate-700 dark:text-white">
                <Pagination title="notas" total={dataTotal?.totalPages ?? 0} current={dataTotal?.currentPage ?? 0} handlePagination={handlePagination} />
                <div className="flex  flex-col gap-2 mt-2">
                    {
                        data !== null
                            ? (data.length ? data.map(item => <NoteItem key={item._id} id={item._id} title={item.title} createAt={format(new Date(item.createdAt), "dd MMMM yyyy")} onClickMenu={handleClickMenuItem} isDraft={item.isDraft} onClickItem={handleView} />) : <p>Sin resultados</p>)
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
    );
}

export default Note;
