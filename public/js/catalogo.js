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

// Función para cargar el catálogo en la tabla
async function cargarCatalogo() {
    try {
        const response = await fetch('http://localhost:3000/catalogo'); // Cambia aquí

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error al cargar el catálogo:', errorText);
            alert('Error al cargar el catálogo. Comprueba la consola para más detalles.');
            return;
        }

        const data = await response.json();
        
        const catalogoContainer = document.getElementById('catalogo-container');
        catalogoContainer.innerHTML = ''; // Limpiar catálogo

        data.forEach(vehiculo => {
            const producto = document.createElement('div');
            producto.classList.add('producto');
            producto.innerHTML = `
                <img src="${vehiculo.imagen}" alt="${vehiculo.titulo}">
                <h3>${vehiculo.id}</h3>
                <h3>${vehiculo.titulo}</h3>
                <p>$${vehiculo.precio}</p>
                <p>${vehiculo.color}</p>
                <button onclick="location.href='detalle-compra.html?id=${vehiculo.id}&nombre=${encodeURIComponent(vehiculo.titulo)}&precio=${vehiculo.precio}'">Comprar</button>
            `;
            catalogoContainer.appendChild(producto);
        });
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        alert('Error al conectar con el servidor');
    }
}

// Función para buscar vehículo por ID
async function buscarVehiculoPorID(id) {
    try {
        const response = await fetch(`http://localhost:3000/catalogo/${id}`);

        if (!response.ok) {
            alert('Vehículo no encontrado');
            return;
        }

        const vehiculo = await response.json();
        const catalogoContainer = document.getElementById('catalogo-container');
        catalogoContainer.innerHTML = ''; // Limpiar catálogo

        const producto = document.createElement('div');
        producto.classList.add('producto');
        producto.innerHTML = `
            <img src="${vehiculo.imagen}" alt="${vehiculo.titulo}">
            <h3>${vehiculo.id}</h3>
            <h3>${vehiculo.titulo}</h3>
            <p>$${vehiculo.precio}</p>
            <p>${vehiculo.color}</p>
            <button onclick="location.href='detalle-compra.html?id=${vehiculo.id}&nombre=${encodeURIComponent(vehiculo.titulo)}&precio=${vehiculo.precio}'">Comprar</button>
        `;
        catalogoContainer.appendChild(producto);

        // Mostrar botón de restaurar búsqueda
        document.getElementById('restore-btn').style.display = 'block';
    } catch (error) {
        console.error('Error al buscar vehículo:', error);
        alert('Error al conectar con el servidor');
    }
}

// Evento para buscar vehículo por ID
document.getElementById('search-btn').addEventListener('click', () => {
    const id = document.getElementById('search-id').value;
    if (id) {
        buscarVehiculoPorID(id);
    } else {
        alert('Por favor, ingresa un ID');
    }
});

// Evento para restaurar el catálogo completo
document.getElementById('restore-btn').addEventListener('click', () => {
    cargarCatalogo(); // Volver a cargar el catálogo completo
    document.getElementById('restore-btn').style.display = 'none'; // Ocultar el botón de restaurar
    document.getElementById('search-id').value = ''; // Limpiar el campo de búsqueda
});

// Llamar a cargarCatalogo al cargar la página
window.onload = () => {
    verificarSesion();
    cargarCatalogo();
};
