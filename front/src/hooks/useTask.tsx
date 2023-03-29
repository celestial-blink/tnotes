import { useState } from "react";

interface ITask {
    _id: string;
    title: string;
    description: string;
    isDraft: boolean;
    isComplete: boolean;
    endDate: Date | null;
    createAt: Date;
}

interface IUseTask {
    data: null | Array<ITask>,
}

const useTask = (): IUseTask => {

    const [data, setData] = useState<null | Array<ITask>>(null);

    const Filter = async ():Promise<string> => {
        return "";
    }

    return ({
        data
    });
}

export default useTask;
