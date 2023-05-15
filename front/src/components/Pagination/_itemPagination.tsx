import type { MouseEvent } from "react";

type TypeProps = {
    current: boolean,
    value: number,
    handlePagination?: (offset: number) => void
}

const ItemPagination = ({ current, value, handlePagination }: TypeProps) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (current) return;
        handlePagination?.(value - 1);
    }
    return (
        <li> <a href="#" onClick={handleClick} className={`h-7 w-7 ${current ? "bg-slate-600 text-white dark:bg-cyan-500" : "bg-slate-100 dark:bg-slate-500"} block rounded text-center py-[.1rem]`}>{value}</a></li>
    );
}

export default ItemPagination
