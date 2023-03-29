import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";

interface IProps {
    title: string;
}

const Pagination = ({ title }: IProps) => {
    return (
        <nav className="flex bg-white rounded p-2 gap-2 justify-between sticky top-0 text-cyan-900 flex-wrap">
            <h1 className="text-2xl">Lista de {title}</h1>
            <div className="flex gap-2 shadow-sm">
                <button className="bg-cyan-900 text-white rounded ">
                    <IconChevronLeft stroke={1.2} size={28} />
                </button>
                <ul className="flex items-center gap-2">
                    <li>
                        <a href="#" className="h-7 w-7 bg-slate-100 block rounded text-center py-[.1rem]">1</a>
                    </li>
                    <li>
                        <a href="#" className="h-7 w-7 bg-slate-100 block rounded text-center py-[.1rem]">2</a>
                    </li>
                    <li>
                        <a href="#" className="h-7 w-7 bg-slate-100 block rounded text-center py-[.1rem]">3</a>
                    </li>
                    <li>
                        <IconDots stroke={1.2} size={24} />
                    </li>
                    <li>
                        <a href="#" className="h-7 w-7 bg-slate-100 block rounded text-center py-[.1rem]">10</a>
                    </li>
                </ul>
                <button className="bg-cyan-900 text-white rounded">
                    <IconChevronRight stroke={1.2} size={28} />
                </button>
            </div>

        </nav>
    );
};

export default Pagination;
