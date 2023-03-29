const Home = () => {
    return (
        <div className="flex flex-col text-slate-800 gap-1 text-base">
            <section className="custom__shadow p-3 bg-white rounded">
                <h1 className="font-semibold text-2xl">Hola T CODE</h1>
                <p>Tienes 3 tareas pendientes</p>
                <a href="#" className="is__button__primary px-5 py-2 inline-block mt-4 rounded">Ver mis tareas</a>
            </section>
            <section className="custom__shadow p-3 bg-white rounded">
                <h2 className="font-semibold text-2xl">Agregar nueva nota</h2>
                <p>Agrega una nueva nota o una nueva tarea.</p>
                <div className="flex gap-3">
                    <a href="#" className="is__button__primary px-4 py-2 inline-block mt-4 rounded">Agregar nota</a>
                    <a href="#" className="is__button__primary px-4 py-2 inline-block mt-4 rounded">Agregar tarea</a>
                </div>
            </section>
            <div className="flex gap-1 flex-col md:flex-row">
                <section className="custom__shadow p-3 bg-white rounded">
                    <h2 className="font-semibold text-2xl">Mis actividades</h2>
                    <div className="flex w-max gap-3 mt-2 items-center md:flex-col">
                        <div className="h-28 w-28 flex-none border-8 rounded-full border-cyan-900 bg-cyan-200 bg-opacity-40 flex items-center justify-center text-3xl text-cyan-900 md:h-36 md:w-36"> <strong>78%</strong> </div>
                        <p>Te quedad <strong>5</strong> tareas pendientes</p>
                    </div>
                </section>
                <section className="custom__shadow p-3 bg-white rounded w-full">
                    <ul className="flex flex-col gap-2">
                        <li className="border px-2 rounded flex justify-between items-center p-1">Lorem ipsum dolor sit.  <a href="#" className="is__button__primary px-2 py-1 inline-block rounded">Ver</a> </li>
                        <li className="border px-2 rounded flex justify-between items-center p-1">Lorem ipsum dolor sit.  <a href="#" className="is__button__primary px-2 py-1 inline-block rounded">Ver</a> </li>
                        <li className="border px-2 rounded flex justify-between items-center p-1">Lorem ipsum dolor sit.  <a href="#" className="is__button__primary px-2 py-1 inline-block rounded">Ver</a> </li>
                        <li className="border px-2 rounded flex justify-between items-center p-1">Lorem ipsum dolor sit.  <a href="#" className="is__button__primary px-2 py-1 inline-block rounded">Ver</a> </li>
                        <li className="border px-2 rounded flex justify-between items-center p-1">Lorem ipsum dolor sit.  <a href="#" className="is__button__primary px-2 py-1 inline-block rounded">Ver</a> </li>
                    </ul>
                    <div className="text-right">
                        <a href="#" className="is__button__primary px-5 py-2 inline-block mt-4 rounded">Ver todos</a>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
