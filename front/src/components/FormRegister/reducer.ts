interface IInitialValues {
    name: string;
    email: string;
    password: string;
    repeat_password: string;
};


export enum ActionTypes {
    SET_VALUE = "set_value"
}

interface IActionReducer {
    type: ActionTypes;
    name: string;
    payload: string;
}

export const initialState: IInitialValues = {
    name: "",
    email: "",
    password: "",
    repeat_password: ""
}

const reducers = {
    set_value: (state: IInitialValues, action: IActionReducer) => ({ ...state, [action.name]: action.payload })
};

export const reducer = (state:IInitialValues, action:IActionReducer) => {
    return reducers[action.type]?.(state, action) ?? state;
}
