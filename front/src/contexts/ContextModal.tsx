import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

// setShow: Dispatch<SetStateAction<boolean>>

type TypeComponent = ReactNode;

interface IContextModal {
    show: boolean,
    setShow(payload: boolean): void,
    component: TypeComponent,
    setComponent(payload: TypeComponent): void,
    toggleShow(): void
}

const initialValues: IStateReducer = {
    show: false,
    component: null
};

enum Types {
    SET_SHOW = "set_show",
    SET_COMPONENT = "set_component"
};

interface IActionReducer {
    type: Types,
    payload: boolean | TypeComponent
};

interface IStateReducer {
    show: boolean,
    component: TypeComponent
}

const reducer = (state: IStateReducer, action: IActionReducer): IStateReducer => {
    const reducers = {
        set_show: (state: IStateReducer, action: IActionReducer): IStateReducer => ({ ...state, show: action.payload as boolean }),
        set_component: (state: IStateReducer, action: IActionReducer): IStateReducer => ({ ...state, component: action.payload as TypeComponent })
    };
    return reducers[action.type]?.(state, action) ?? state;
};

export const ContextModal = createContext<IContextModal>({
    show: false, setShow() { },
    component: null, setComponent() { },
    toggleShow() { }
});

export const useContextModal = (): IContextModal => {
    const contextModal = useContext(ContextModal);
    return contextModal;
}

const ContextModalProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialValues);

    const setShow = (payload: boolean) => dispatch({ type: Types.SET_SHOW, payload: payload });
    const setComponent = (payload: TypeComponent) => dispatch({ type: Types.SET_COMPONENT, payload: payload });
    const toggleShow = () => dispatch({ type: Types.SET_SHOW, payload: !state.show });

    return (
        <ContextModal.Provider value={{
            show: state.show, setShow,
            component: state.component, setComponent, toggleShow
        }}>
            {children}
        </ContextModal.Provider>
    );
}

export default ContextModalProvider;
