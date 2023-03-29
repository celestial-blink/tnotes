import type { MouseEvent } from "react";

import { IconSearch } from "@tabler/icons-react";
import Pagination from "@components/Pagination";
import TaskItem from "@components/TaskItem";

import { useContextModal } from "@contexts/ContextModal";
import FormTask from "@components/FormTask";

const Task = () => {

    const { toggleShow, setComponent } = useContextModal();

    const handleAdd = () => {
        setComponent(<FormTask />)
        toggleShow();
    }

    return (
        <>
            <section className="flex flex-col gap-2">
                <section className="rounded bg-white flex items-center gap-5 p-2">
                    <button className="is__button__primary py-2 px-4 rounded h-max" onClick={handleAdd}>Agregar</button>
                    <form className="w-full gap-7 flex flex-col relative text-base">
                        <input className="border p-1 pr-7 w-full outline-none" type="search" placeholder="Buscar..." />
                        <IconSearch stroke={1.2} size={24} className="absolute right-1 top-0 bottom-0 m-auto" />
                    </form>
                </section>
                <section className="rounded bg-white p-2">
                    <Pagination  title="tareas" />
                    <div className="flex  flex-col gap-2 mt-2">
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                        <TaskItem title="Takeshi code" isComplete={true} endDate={"10 de feb"} startDate={"01 de feb"} />
                    </div>
                </section>
            </section>

        </>
    );
}

export default Task;
