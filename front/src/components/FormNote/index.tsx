const FormNote = () => {
    return (
        <form className="is__form w-full gap-3 flex flex-col text-lg min-w-[350px]">
            <legend className="text-2xl text-cyan-900">Agregar nueva tarea</legend>
            <div className="w-full">
                <fieldset className="wrap__input gap-2">
                    <div className="flex flex-col">
                        <label className="label text-cyan-900" htmlFor="title">Titulo</label>
                        <input type="text" className="input" name="title" id="title" maxLength={120} />
                    </div>

                    <div className="flex flex-col">
                        <label className="label text-cyan-900" htmlFor="description">Descripcion</label>
                        <textarea className="input" name="description" id="description" cols={30} rows={10}></textarea>
                    </div>

                    <div className="flex gap-2 mt-5 justify-between">
                        <input type="submit" className="bg-slate-200 w-full px-3 py-1 rounded" value="Guardar en borradores" />
                        <input type="submit" className="is__button__primary px-3 py-1 rounded" value="Guardar" />
                    </div>
                </fieldset>
            </div>
        </form>
    );
    ;
}

export default FormNote;
