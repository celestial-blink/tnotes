import { useState, useRef } from "react";
import type { FormEvent, ChangeEvent, MouseEvent } from "react";
import { IconSearch } from "@tabler/icons-react";

let timeoutSearch: null | NodeJS.Timeout = null;

type TypeChange = Array<{ title: string, _id: string }>;

type TypeProps = {
    onSubmit?: (value: string) => void,
    onChange?: (value: string) => Promise<TypeChange | null>,
    defaultValue?: string
};

const Search = ({ onChange, onSubmit, defaultValue }: TypeProps) => {

    const refInput_search = useRef<HTMLInputElement>(null);

    const [dataFilter, setDataFilter] = useState<null | TypeChange>(null);
    const [data, setData] = useState<string>("");

    const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!data.trim()) return;
        onSubmit?.(data);
    }

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setData(value);
        setDataFilter(null);
        if (timeoutSearch) clearTimeout(timeoutSearch);
        timeoutSearch = setTimeout(() => {
            if (!value.trim()) {
                onSubmit?.("");
                return;
            };
            if (onChange) {
                onChange(value).then(ldata => {
                    setDataFilter(ldata)
                });
            }
        }, 500);
    }

    const handleClickItem = (event: MouseEvent<HTMLUListElement | HTMLLIElement>) => {
        const { tagName, dataset } = event.target as HTMLLIElement;
        if (tagName === "LI" && dataset.evref === "handleClickItem") {
            const value = dataset?.value ?? "";
            setData(value);
            if (refInput_search.current) refInput_search.current.value = value;
            onSubmit?.(value);
        }
    }

    return (
        <form className="w-full gap-7 flex flex-col relative text-base z-[1]" onSubmit={handleOnSubmit}>
            <input type="search" className="custom__focus__input p-2 pr-7 rounded w-full outline-none dark:bg-slate-800 dark:text-white dark:border-slate-400" ref={refInput_search} onChange={handleOnChange} defaultValue={defaultValue} placeholder="Buscar..." />
            <ul className="absolute top-full hidden bg-white z-[2] w-full border shadow-xl p-2 max-h-sm overflow-auto dark:bg-slate-800 dark:border-slate-600" onClick={handleClickItem}>
                <li className="px-1 cursor-pointer text-sm bg-transparent hover:bg-slate-600" data-value={data} data-evref="handleClickItem">Buscar: {data}</li>
                {
                    dataFilter === null
                        ? <li className="px-1 text-sm">...</li>
                        : dataFilter.map(item => <li className="px-1 my-1 py-1 cursor-pointer text-sm text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-600" key={item._id} data-value={item.title} data-evref="handleClickItem">Resultados: {item.title.length <= 50 ? item.title : `${item.title.slice(0, 50)}...`}</li>)
                }
            </ul>
            <IconSearch stroke={1.2} size={24} className="absolute right-1 top-0 bottom-0 m-auto" />
        </form>
    );
}

export default Search;
