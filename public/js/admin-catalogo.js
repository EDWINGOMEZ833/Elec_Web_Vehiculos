// Verificar si el usuario ha iniciado sesión
function verificarSesion() {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        alert('Por favor, inicia sesión para acceder al catálogo.');
        window.location.href = 'login.html'; // Redirigir al login
    }
}

// Llama a la función cuando se carga la página
window.onload = function () {
    verificarSesion();
    cargarCatalogo(); // Cargar el catálogo al cargar la página
};

// Función para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('usuario'); // Elimina el usuario de sessionStorage
    window.location.href = 'login.html'; // Redirigir al login
}

// Asignar la función de cierre de sesión al botón
document.querySelector('.salir-btn').addEventListener('click', cerrarSesion);

// Función para cargar el catálogo de vehículos desde el servidor
function cargarCatalogo() {
    fetch('/admin-catalogo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el catálogo');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#catalogo-table tbody');
            tableBody.innerHTML = ''; // Limpiar la tabla

            data.forEach(vehiculo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vehiculo.id}</td>
                    <td>${vehiculo.titulo}</td>
                    <td>${vehiculo.precio}</td>
                    <td>${vehiculo.color}</td>
                    <td><img src="${vehiculo.imagen}" alt="${vehiculo.titulo}" width="100"></td>
                    <td>
                        <button onclick="editarVehiculo(${vehiculo.id})">Editar</button>
                        <button onclick="eliminarVehiculo(${vehiculo.id})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar el catálogo:', error));
}

// Función para cargar un vehículo en el formulario
function cargarVehiculo(vehiculo) {
    document.getElementById('vehiculo-id').value = vehiculo.id;
    document.getElementById('titulo').value = vehiculo.titulo;
    document.getElementById('precio').value = vehiculo.precio;
    document.getElementById('color').value = vehiculo.color;

    // Mostrar la imagen actual
    const imagenPreview = document.getElementById('imagen-preview');
    imagenPreview.src = `${vehiculo.imagen}`; // Usa la ruta correcta desde el servidor
    imagenPreview.style.display = 'block';
}

// Función para manejar el envío del formulario
document.getElementById('catalogoForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío normal del formulario

    const formData = new FormData(event.target);
    const vehiculoId = document.getElementById('vehiculo-id').value;

    try {
        const response = await fetch(vehiculoId ? `/admin-catalogo/${vehiculoId}` : '/admin-catalogo', {
            method: vehiculoId ? 'PUT' : 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Vehículo guardado exitosamente.');
            document.getElementById('catalogoForm').reset(); // Limpiar el formulario
            cargarCatalogo(); // Recargar el catálogo actualizado
        } else {
            alert('Error al guardar el vehículo.'); // Mensaje de error
            console.error('Error al guardar el vehículo');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Función para eliminar un vehículo
function eliminarVehiculo(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
        fetch(`/admin-catalogo/${id}`, { method: 'DELETE' })
            .then(() => cargarCatalogo()) // Recargar el catálogo después de eliminar
            .catch(error => console.error('Error al eliminar vehículo:', error));
    }
}

// Función para editar un vehículo
function editarVehiculo(id) {
    fetch(`/admin-catalogo/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos del vehículo');
            }
            return response.json();
        })
        .then(vehiculo => {
            cargarVehiculo(vehiculo); // Cargar los datos del vehículo en el formulario
        })
        .catch(error => console.error('Error al obtener datos del vehículo:', error));
}
