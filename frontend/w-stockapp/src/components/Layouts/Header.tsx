function Header(){

    return (
        <div>
            <nav className='bg-gray-800 text-white p-4 flex justify-between items-center'>
            <ul className="flex space-x-4">
                <li><a href="/" className="text-blue-500 hover:underline">Home</a></li>
                <li><a href="/persona" className="text-blue-500 hover:underline">Persona</a></li>
            </ul>

            <button 
                 onClick={() => window.location.href = '/login'}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                Iniciar Sesión
            </button>
        </nav>
        </div>
    )
}

export default Header;