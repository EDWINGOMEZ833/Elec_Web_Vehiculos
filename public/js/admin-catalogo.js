// Verificar si el usuario ha iniciado sesión
function verificarSesion() {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        alert('Por favor, inicia sesión para acceder al catálogo.');
        window.location.href = 'login.html'; // Redirigir al login
    }
}

// Variable global para almacenar todos los vehículos
let todosLosVehiculos = [];

// Llama a la función cuando se carga la página
window.onload = function () {
    verificarSesion();
    obtenerCatalogo(); // Cargar el catálogo al cargar la página
};

// Función para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('usuario'); // Elimina el usuario de sessionStorage
    window.location.href = 'login.html'; // Redirigir al login
}

// Asignar la función de cierre de sesión al botón
document.querySelector('.salir-btn').addEventListener('click', cerrarSesion);

// Función para obtener todos los vehículos desde el servidor y almacenarlos
function obtenerCatalogo() {
    fetch('/admin-catalogo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el catálogo');
            }
            return response.json();
        })
        .then(data => {
            todosLosVehiculos = data; // Almacenar todos los vehículos
            cargarCatalogo(todosLosVehiculos); // Cargar todos los vehículos inicialmente
        })
        .catch(error => console.error('Error al cargar el catálogo:', error));
}

// Función para cargar el catálogo de vehículos en la tabla
function cargarCatalogo(vehiculos) {
    const tableBody = document.querySelector('#catalogo-table tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    vehiculos.forEach(vehiculo => {
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
}

// Función para manejar el envío del formulario
document.getElementById('catalogoForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío normal del formulario

    const formData = new FormData(event.target);
    const vehiculoId = document.getElementById('vehiculo-id').value;

    try {
        const response = await fetch(vehiculoId ? `/admin-catalogo/${vehiculoId}` : '/admin-catalogo', {
            method: vehiculoId ? 'PUT' : 'POST', // Si hay ID, actualizar, si no, crear nuevo
            body: formData
        });

        if (response.ok) {
            alert('Vehículo guardado exitosamente.');
            document.getElementById('catalogoForm').reset(); // Limpiar el formulario
            limpiarImagenPreview(); // Ocultar la imagen al guardar
            document.getElementById('cancelar-btn').style.display = 'none';
            obtenerCatalogo(); // Recargar el catálogo actualizado
        } else {
            alert('Error al guardar el vehículo.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Función para eliminar un vehículo
function eliminarVehiculo(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
        fetch(`/admin-catalogo/${id}`, { method: 'DELETE' })
            .then(() => obtenerCatalogo()) // Recargar el catálogo después de eliminar
            .catch(error => console.error('Error al eliminar vehículo:', error));
    }
}

// Función para editar un vehículo
function editarVehiculo(id) {
    fetch(`/admin-catalogo/${id}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                alert('Vehículo no encontrado.');
                throw new Error('Vehículo no encontrado');
            } else {
                throw new Error('Error al obtener los datos del vehículo');
            }
        })
        .then(vehiculo => {
            cargarVehiculo(vehiculo);
        })
        .catch(error => {
            console.error('Error al obtener datos del vehículo:', error);
        });
}


// Función para cargar un vehículo en el formulario
function cargarVehiculo(vehiculo) {
    // Asignar los valores del vehículo al formulario
    document.getElementById('vehiculo-id').value = vehiculo.id;
    document.getElementById('titulo').value = vehiculo.titulo;
    document.getElementById('precio').value = vehiculo.precio;
    document.getElementById('color').value = vehiculo.color;

    // Mostrar la imagen actual
    const imagenPreview = document.getElementById('imagen-preview');
    imagenPreview.src = vehiculo.imagen; // La URL de la imagen desde el servidor
    imagenPreview.style.display = 'block'; // Mostrar la vista previa de la imagen

    // Mostrar el botón de cancelar
    document.getElementById('cancelar-btn').style.display = 'inline';

    // Cambiar el texto del botón de guardar a "Actualizar Vehículo"
    document.querySelector('button[type="submit"]').textContent = 'Actualizar Vehículo';
}

// Función para cancelar la edición
document.getElementById('cancelar-btn').addEventListener('click', function() {
    document.getElementById('catalogoForm').reset();
    limpiarImagenPreview(); // Limpiar la vista previa de la imagen
    document.getElementById('cancelar-btn').style.display = 'none'; // Ocultar el botón de cancelar
});

// Función para limpiar la vista previa de la imagen
function limpiarImagenPreview() {
    const imagenPreview = document.getElementById('imagen-preview');
    imagenPreview.src = ''; // Limpiar la fuente de la imagen
    imagenPreview.style.display = 'none'; // Ocultar la imagen
}

// Función para buscar vehículo por ID y filtrar la tabla
document.getElementById('buscar-btn').addEventListener('click', function() {
    const idBuscado = document.getElementById('buscar-id').value.trim();
    if (idBuscado) {
        const vehiculoEncontrado = todosLosVehiculos.filter(vehiculo => vehiculo.id == idBuscado);
        if (vehiculoEncontrado.length > 0) {
            cargarCatalogo(vehiculoEncontrado); // Mostrar solo el vehículo encontrado
        } else {
            alert('Vehículo no encontrado');
            cargarCatalogo([]); // Mostrar tabla vacía
        }
    } else {
        alert('Por favor, ingresa un ID.');
    }
});

// Función para restablecer la tabla completa
document.getElementById('restablecer-btn').addEventListener('click', function() {
    document.getElementById('buscar-id').value = '';
    cargarCatalogo(todosLosVehiculos); // Volver a cargar todos los vehículos
});
