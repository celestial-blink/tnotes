import { useState, useEffect } from "react";
import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";

import ItemPagination from "./_itemPagination";

interface IProps {
    title: string;
    total: number;
    current: number;
    handlePagination?: (offset: number) => void;
};

const previus = (current: number, data: Array<number> = []): Array<number> => {
    if (current >= 1 && data.length < 2) {
        data.unshift(current);
        return previus(current - 1, data);
    }
    return data;
};

const next = (current: number, total: number, data: Array<number> = []): Array<number> => {
    if (current <= total && data.length < 2) {
        data.push(current);
        return next(current + 1, total, data);
    }
    return data;
};

const generatePages = (total: number, current: number): Array<number> => {
    const previusValues = previus(current - 1);
    const nextValues = next(current + 1, total);
    const prepareResult = [...previusValues, current, ...nextValues];
    return prepareResult;
}

const Pagination = ({ title, total, current, handlePagination }: IProps) => {

    const [data, setData] = useState<Array<number>>([]);

    const handleClickNext = () => {
        if (current === total) return;
        handlePagination?.(current);
    }

    const handleClickPrevius = () => {
        const prepareValue = current - 1;
        if (current < 1) return;
        handlePagination?.(prepareValue - 1);
    }

    useEffect(() => {
        setData(generatePages(total, current));
    }, [total, current]);

    return (
        <nav className="flex bg-white rounded p-2 gap-2 justify-between sticky top-0 text-cyan-900 flex-wrap z-[1] dark:bg-slate-700 dark:text-white">
            <h2 className="text-2xl">Lista de {title}</h2>
            <div className="flex gap-3 shadow-sm">
                <button className="bg-slate-100 rounded disabled:bg-slate-200 disabled:cursor-not-allowed dark:bg-slate-400 dark:text-white" onClick={handleClickPrevius} disabled={current < 2}>
                    <IconChevronLeft stroke={1.2} size={28} />
                </button>
                <ul className="flex items-center gap-1">
                    {
                        data[0] > 1
                            ? <li><IconDots stroke={1.2} size={24} /> </li>
                            : null
                    }
                    {
                        data.map((item, key) => <ItemPagination key={key} current={item === current} value={item} handlePagination={handlePagination} />)
                    }
                    {
                        (data.at(-1) ?? 0) < total
                            ? <li><IconDots stroke={1.2} size={24} /> </li>
                            : null
                    }
                </ul>
                <button className="bg-slate-100 rounded disabled:bg-slate-200 disabled:cursor-not-allowed dark:bg-slate-400 dark:text-white" onClick={handleClickNext} disabled={total === 0 || current === total}>
                    <IconChevronRight stroke={1.2} size={28} />
                </button>
            </div>

        </nav>
    );
};

export default Pagination;
