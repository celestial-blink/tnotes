import { Link } from "react-router-dom";

type TypeProps = {
    title: string,
    _id: string
};

const ItemLastNote = ({ title, _id }: TypeProps) => {
    return (
        <li className="border px-2 rounded flex justify-between items-center p-1 dark:bg-slate-800 dark:border-slate-600"> <span> <strong>Title:</strong> {title} </span> <Link to={`#${_id}`} className="is__button__primary px-2 py-1 inline-block rounded">Ver</Link> </li>
    );
};

export const SkeletonItemLastNote = () => {
    return (
        <li className="p-4 bg-slate-100 rounded animate-pulse dark:bg-slate-600"></li>
    );
}

export default ItemLastNote;
