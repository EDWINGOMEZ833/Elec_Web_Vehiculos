async function getVehicleDetails(id) {
    try {
        const response = await fetch(`/catalogo/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los detalles del vehículo.');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los detalles del vehículo.');
    }
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        nombre: params.get('titulo'),
        precio: params.get('precio')
    };
}

async function loadDetails() {
    const { id } = getQueryParams();

    if (!id) {
        alert('ID del vehículo no proporcionado.');
        return;
    }

    const vehicleDetails = await getVehicleDetails(id);

    if (vehicleDetails) {
        document.getElementById('id-vehiculo').textContent = vehicleDetails.id;
        document.getElementById('nombre-vehiculo').textContent = vehicleDetails.titulo;
        document.getElementById('precio-vehiculo').textContent = `$${vehicleDetails.precio}`;
        document.getElementById('imagen-vehiculo').src = vehicleDetails.imagen;
        document.getElementById('color-vehiculo').textContent = `Color: ${vehicleDetails.color}`;
    }
}

function confirmarCompra() {
    window.location.href = 'compra.html';
}

window.onload = loadDetails;
