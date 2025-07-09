import { useEffect } from "react"

function FormularioRegistro({ mostrarFormulario, setMostrarFormulario }) {

    useEffect(()=> {
        if(mostrarFormulario){
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("model-open");        
        }
    }, [mostrarFormulario]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h1><strong>Formulario registro</strong></h1>
                {mostrarFormulario && (
                    <form action="">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre:
                        <input 
                        type="text"
                        placeholder="nombre"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    </label>

                    <label htmlFor="">
                        Apellido Paterno: 
                        <input type="text"
                        placeholder="apellido paterno"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </label>

                    <label htmlFor="">
                        Apellido Materno:
                        <input type="text"
                        placeholder="apellido materno"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </label>

                    <label htmlFor="email">
                        Email:
                        <input type="email" 
                        placeholder="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </label>
                    <br/> <br />
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition">
                        Registrar</button>
                    </form>
                )}
            </div>
        </div>
    )
}
export default FormularioRegistro