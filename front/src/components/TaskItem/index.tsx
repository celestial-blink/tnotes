import { IconNotes, IconDots } from "@tabler/icons-react";

interface IProps {
    title: string;
    isComplete: boolean | null;
    startDate: string;
    endDate: string | null;
}

const TaskItem = ({ title, isComplete, startDate, endDate }: IProps) => {
    return (
        <div className="flex flex-wrap justify-between border rounded p-2 items-center">
            <div className="flex gap-1">
                <IconNotes width={24} />
                <h2>{title}</h2>
            </div>
            <div className="flex gap-3 items-center">
                <div className="text-xs flex flex-col items-end">
                    {isComplete ? <span className="block px-2 py-1 bg-green-400 rounded w-max">Complete</span> : null}
                    <span className="block text-slate-500 mt-1">{`Creado el ${startDate} ${endDate ? `- Fecha limite ${endDate}` : ""}`}</span>
                </div>
                <details>
                    <summary className="list-none text-cyan-900">
                        <IconDots />
                    </summary>
                </details>
            </div>
        </div>
    );
}

export default TaskItem;
