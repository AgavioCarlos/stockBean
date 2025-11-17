

      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-[265px]" : "ml-[30px]"
        }`}
      >
        <div className="px-6">
          <div className="flex items-center justify-end mb-6">
            <div className="flex gap-3">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                type="button"
                onClick={abrirModal}
              >
                Agregar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                type="button"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
        {productos && productos.length > 0 ? (
          <div className="ag-theme-alpine w-full h-[80vh] bg-white rounded-xl shadow-md p-4">
            <AgGridReact
              theme="legacy"
              rowData={productos}
              onRowClicked={handleRowClick}
              rowSelection="single"
              columnDefs={[
                {
                  field: "id_producto",
                  headerName: "ID",
                  editable: false,
                  filter: false,
                },
                {
                  field: "nombre",
                  headerName: "Nombre",
                  editable: true,
                  filter: false,
                },
                {
                  field: "descripcion",
                  headerName: "Descripcion",
                  editable: false,
                  filter: false,
                },
                {
                  field: "categoria",
                  headerName: "Categoria",
                  editable: false,
                  filter: false,
                },
                {
                  field: "unidad",
                  headerName: "Unidad",
                  editable: false,
                  filter: false,
                },
                {
                  field: "marca",
                  headerName: "Marca",
                  editable: false,
                  filter: false,
                },
                // {
                //   field: "codigoBarras",
                //   headerName: "Codigo",
                //   editable: false,
                //   filter: false,
                // },
                {
                  field: "status",
                  headerName: "Status",
                  editable: false,
                  filter: false,
                },
              ]}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: false,
                editable: true,
                floatingFilter: false,
              }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No hay datos para mostrar
          </div>
        )}
      </div>

      <ProductosForm
        mostrar={mostrarModal}
        onClose={cerrarModal}
        nombre={nombre}
        setNombre={setNombre}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        categoria={categoria}
        setCategoria={setCategoria}
        unidad={unidad}
        setUnidad={setUnidad}
        marca={marca}
        setMarca={setMarca}
        codigoBarras={codigoBarras}
        setCodigoBarras={setCodigoBarras}
        imagenUrl={imagenUrl}
        manejarCambio={manejarCambio}
        status={status}
        setStatus={setStatus}
        manejarEnvio={manejarEnvio}
      />

      {mostrarModalDetalle && productoSeleccionado && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {productoSeleccionado.nombre}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {productoSeleccionado.descripcion}
                </p>
                {/* Aquí puedes agregar más detalles del producto */}
              </div>
              <div>
                <p>{productoSeleccionado.codigoBarras}</p>
              </div>
              <div>
                <p>{productoSeleccionado.status ? "Activo" : "Inactivo"}</p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setMostrarModalDetalle(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />