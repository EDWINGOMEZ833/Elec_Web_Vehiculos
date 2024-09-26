// Verificar si el usuario ha iniciado sesión 
function verificarSesion() {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        alert('Por favor, inicia sesión para acceder al catálogo.');
        window.location.href = 'login.html'; // Redirigir al login
    }
}

// Llama a la función cuando se carga la página
window.onload = verificarSesion;

// Función para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('usuario'); // Elimina el usuario de sessionStorage
    window.location.href = 'login.html'; // Redirigir al login
}

// Asignar la función de cierre de sesión al botón
document.querySelector('.salir-btn').addEventListener('click', cerrarSesion);

// Función para manejar el envío del formulario de agregar/editar vehículo
document.getElementById('catalogoForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const formData = new FormData(); // Usar FormData para manejar archivos y otros datos

    const id = document.getElementById('vehiculo-id').value; // Obtener el ID del vehículo, si está presente
    const titulo = document.getElementById('titulo').value;
    const precio = document.getElementById('precio').value;
    const color = document.getElementById('color').value;
    const imagen = document.getElementById('imagen').files[0]; // Obtener el archivo de imagen

    // Asegúrate de que todos los campos estén completados
    if (!titulo || !precio || !color || (id && !imagen)) { // Si se está editando, no es necesario que se seleccione una nueva imagen
        alert('Todos los campos son obligatorios');
        return;
    }

    // Agregar datos al FormData
    formData.append('titulo', titulo);
    formData.append('precio', precio);
    formData.append('color', color);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    try {
        console.log('Enviando datos al servidor...'); // Log para confirmar que se está enviando la solicitud

        // Hacer la solicitud POST o PUT al servidor según si hay ID o no
        const url = id ? `http://localhost:3000/catalogo/${id}` : 'http://localhost:3000/catalogo';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Mostrar mensaje de éxito
            console.log('Vehículo agregado/actualizado exitosamente:', result);
            cargarCatalogo(); // Recargar catálogo después de agregar/editar
            document.getElementById('catalogoForm').reset(); // Limpiar el formulario
            document.getElementById('vehiculo-id').value = ''; // Reiniciar el campo de ID
        } else {
            console.error('Error en la respuesta del servidor:', result);
            alert(result.error || 'Error al agregar/actualizar el vehículo');
        }
    } catch (err) {
        console.error('Error al hacer la solicitud al servidor:', err);
        alert('Error al conectar con el servidor');
    }
});

// Función para cargar los datos del vehículo en el formulario para editar
function cargarVehiculo(vehiculo) {
    document.getElementById('titulo').value = vehiculo.titulo;
    document.getElementById('precio').value = vehiculo.precio;
    document.getElementById('color').value = vehiculo.color;
    // Si necesitas manejar la imagen, puedes agregar un campo para mostrar la imagen actual

    // Cambia el evento del formulario para editar en lugar de agregar
    const catalogoForm = document.getElementById('catalogoForm');
    catalogoForm.onsubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const imagen = document.getElementById('imagen').files[0]; // Obtener el archivo de imagen

        formData.append('titulo', document.getElementById('titulo').value);
        formData.append('precio', document.getElementById('precio').value);
        formData.append('color', document.getElementById('color').value);
        formData.append('imagen', imagen);

        try {
            const response = await fetch(`http://localhost:3000/catalogo/${vehiculo.id}`, {
                method: 'PUT',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message); // Mostrar mensaje de éxito
                console.log('Vehículo actualizado exitosamente:', result);
                cargarCatalogo(); // Recargar el catálogo
            } else {
                console.error('Error al actualizar el vehículo:', result);
                alert(result.error || 'Error al actualizar el vehículo');
            }
        } catch (err) {
            console.error('Error al hacer la solicitud al servidor:', err);
            alert('Error al conectar con el servidor');
        }
    };
}


// Función para cargar el catálogo en la tabla
async function cargarCatalogo() {
    try {
        const response = await fetch('http://localhost:3000/api/catalogo'); // Cambia aquí

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error al cargar el catálogo:', errorText);
            alert('Error al cargar el catálogo. Comprueba la consola para más detalles.');
            return;
        }

        const data = await response.json();
        
        const tablaBody = document.querySelector('#catalogo-table tbody');
        tablaBody.innerHTML = ''; // Limpiar tabla

        data.forEach(vehiculo => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${vehiculo.id}</td>
                <td>${vehiculo.titulo}</td>
                <td>${vehiculo.precio}</td>
                <td>${vehiculo.color}</td>
                <td><img src="${vehiculo.imagen}" alt="${vehiculo.titulo}" width="50"></td>
                <td>
                    <button onclick='cargarVehiculo(${JSON.stringify(vehiculo)})'>Editar</button>
                    <button onclick='eliminarVehiculo(${vehiculo.id})'>Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        alert('Error al conectar con el servidor');
    }
}

// Llamar a cargarCatalogo al cargar la página
window.onload = () => {
    verificarSesion();
    cargarCatalogo();
};
