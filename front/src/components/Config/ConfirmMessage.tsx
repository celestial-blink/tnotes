import { useRef } from "react";

type TypeProps = {
    open: boolean,
    onCancel?: () => {},
    onSuccess?: () => {}
}

const ConfirmMessage = ({ open, onCancel, onSuccess }: TypeProps) => {
    const refDialog = useRef<HTMLDialogElement>(null);

    return (
        <dialog className="" ref={refDialog} open={open}>
            <form>
                <fieldset>
                    <label htmlFor="">Ingrese su contraseña</label>

                </fieldset>
                <fieldset>
                    <button formMethod="dialog" onClick={onCancel}>Cancelar</button>
                    <button onClick={onSuccess}>Continuar</button>
                </fieldset>
            </form>
        </dialog>
    );
}

export default ConfirmMessage;
