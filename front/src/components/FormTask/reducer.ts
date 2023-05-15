import type { ICreate } from "@api/Task";
export interface IInitialValues extends ICreate {
    _id: string
};


export enum ActionTypes {
    SET_VALUE = "set_value",
    SET_VALUE_MULTIPLE = "set_multiple"
}

export const initialState: IInitialValues = {
    _id: "",
    title: "",
    description: "",
    isDraft: false,
    endDate: null,
    isComplete: false
}


interface IActionReducer {
    type: ActionTypes;
    name: string;
    payload: string | boolean | IInitialValues;
}


const reducers = {
    set_value: (state: IInitialValues, action: IActionReducer) => ({ ...state, [action.name]: action.payload }),
    set_multiple: (state: IInitialValues, action: IActionReducer) => ({ ...state, ...(typeof action.payload === "object" ? action.payload : {}) }),
};

export const reducer = (state: IInitialValues, action: IActionReducer) => {
    return reducers[action.type]?.(state, action) ?? state;
}
