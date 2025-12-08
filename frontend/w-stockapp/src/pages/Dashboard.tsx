import MainLayout from '../components/Layouts/MainLayout';

function Dashboard() {
    return (
        <MainLayout>
            <div className="bg-gray-50">
                {/* Contenedor principal del contenido central (ocupa el espacio restante) */}

                {/* 💡 Sección Superior: Bienvenida y Fecha/Exportar */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Welcome back Sajibur Rahman
                        </h2>
                        <p className="text-sm text-gray-500">
                            Monitor and control what happens with your money today for financial health.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Sun, 12 June 2026</span>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                            Export
                        </button>
                    </div>
                </div>

                {/* --- */}

                {/* 💡 Grid Principal: Tarjetas de resumen y Sección de OverView */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* Columna 1: Tarjetas de Balance, Gastos, Ahorros */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tarjeta 1: Account Balance */}
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-base font-medium text-gray-500 mb-2">Account Balance</h3>
                            <p className="text-3xl font-bold text-gray-900">$35,340.89</p>
                            <p className="text-sm mt-1">
                                <span className="text-green-500 font-semibold">+3.2%</span>
                                <span className="text-gray-500"> from last month</span>
                            </p>
                            <div className="mt-4 flex space-x-3">
                                <button className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                                    Send Money
                                </button>
                                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                                    Request Money
                                </button>
                            </div>
                        </div>

                        {/* Tarjeta 2: Total Expenses */}
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-base font-medium text-gray-500 mb-2">Total Expenses</h3>
                            <p className="text-3xl font-bold text-gray-900">$9,845.20</p>
                            <p className="text-sm mt-1">
                                <span className="text-red-500 font-semibold">-2.1%</span>
                                <span className="text-gray-500"> from last month</span>
                            </p>
                        </div>

                        {/* Tarjeta 3: Total Savings */}
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-base font-medium text-gray-500 mb-2">Total Savings</h3>
                            <p className="text-3xl font-bold text-gray-900">$18,420.75</p>
                            <p className="text-sm mt-1">
                                <span className="text-green-500 font-semibold">+4.5%</span>
                                <span className="text-gray-500"> from last month</span>
                            </p>
                        </div>
                    </div>

                    {/* Columna 2: Visión General (Gráfico) */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Overview</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                {/* Selector de Earnings/Expenses y Año */}
                            </div>
                        </div>
                        {/* Placeholder para el gráfico de barras/área  */}
                        <div className="h-64 flex items-center justify-center text-gray-400 border-dashed border-2 rounded-lg">
                            {/* Aquí iría el componente del gráfico real */}
                            Gráfico de Earnings
                        </div>
                    </div>
                </div>

                {/* --- */}

                {/* 💡 Sección Inferior: My Wallet, My Savings Plan y Recent Transaction */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Columna 1: My Wallet (Billeteras) */}
                    <div className="bg-white p-6 rounded-xl shadow lg:col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">My Wallet</h3>
                            <button className="text-green-500 text-sm font-medium hover:text-green-600 transition-colors">
                                + Add New
                            </button>
                        </div>
                        {/* Lista de billeteras */}
                        <div className="space-y-4">
                            {/* Wallet USD */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🇺🇸</span> {/* Icono/Bandera */}
                                    <div>
                                        <p className="font-semibold">USD</p>
                                        <span className="text-sm text-gray-500">Active</span>
                                    </div>
                                </div>
                                <p className="font-bold">$22,678.00</p>
                            </div>
                            {/* Wallet EUR */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🇪🇺</span>
                                    <div>
                                        <p className="font-semibold">EUR</p>
                                        <span className="text-sm text-gray-500">Active</span>
                                    </div>
                                </div>
                                <p className="font-bold">€18,345.00</p>
                            </div>
                            {/* Wallet BDT (Inactivo) */}
                            {/* Puedes omitir las demás para ser conciso */}
                        </div>
                    </div>

                    {/* Columna 2: My Savings Plan (Planes de Ahorro) */}
                    <div className="bg-white p-6 rounded-xl shadow lg:col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">My Savings Plan</h3>
                            <button className="text-gray-500 hover:text-gray-700">...</button>
                        </div>
                        {/* Investment Goal */}
                        <div className="mb-4">
                            <p className="font-semibold">Investment Goal</p>
                            <p className="text-sm text-gray-500">$15,600 / $25,000</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                {/* Barra de progreso (simulada con Tailwind) */}
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 float-right">62%</span>
                        </div>
                        {/* Emergency Fund */}
                        <div className="mb-4 pt-4 border-t">
                            <p className="font-semibold">Emergency Fund</p>
                            {/* ... similar structure for Emergency Fund ... */}
                        </div>
                    </div>

                    {/* Columna 3: Recent Transaction (Transacciones Recientes) */}
                    <div className="bg-white p-6 rounded-xl shadow lg:col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Recent Transaction</h3>
                            <button className="text-gray-500 hover:text-gray-700">Filter</button>
                        </div>
                        {/* Tabla de transacciones (simulada con divs) */}
                        <div className="space-y-3">
                            {/* Encabezados de la "tabla" */}
                            <div className="flex text-xs font-medium text-gray-500 border-b pb-2">
                                <span className="w-1/3">Activity</span>
                                <span className="w-1/4">Date</span>
                                <span className="w-1/4">Price</span>
                                <span className="w-1/6 text-right">Status</span>
                            </div>

                            {/* Fila 1 */}
                            <div className="flex text-sm items-center py-1">
                                <span className="w-1/3 font-medium">Mobile App Purchase</span>
                                <span className="w-1/4 text-gray-500">Wed, 12 Jun 2026</span>
                                <span className="w-1/4 font-semibold">$806.50</span>
                                <span className="w-1/6 text-right text-green-500 font-medium">Success</span>
                            </div>

                            {/* Fila 2 */}
                            <div className="flex text-sm items-center py-1">
                                <span className="w-1/3 font-medium">Software License</span>
                                <span className="w-1/4 text-gray-500">Tue, 11 Jun 2026</span>
                                <span className="w-1/4 font-semibold">$102.99</span>
                                <span className="w-1/6 text-right text-green-500 font-medium">Success</span>
                            </div>

                            {/* Fila 3 */}
                            <div className="flex text-sm items-center py-1">
                                <span className="w-1/3 font-medium">Grocery Purchase</span>
                                <span className="w-1/4 text-gray-500">Sun, 09 Jun 2026</span>
                                <span className="w-1/4 font-semibold">$2,500.00</span>
                                <span className="w-1/6 text-right text-green-500 font-medium">Success</span>
                            </div>

                            {/* ...más transacciones... */}
                        </div>
                    </div>
                </div>

                {/* Pie de página (si fuera necesario, aquí no se muestra) */}

            </div>
        </MainLayout>


    );
}

export default Dashboard;