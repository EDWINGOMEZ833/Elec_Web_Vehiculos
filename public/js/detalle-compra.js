function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        nombre: params.get('nombre'),
        precio: params.get('precio')
    };
}

function loadDetails() {
    const { id, nombre, precio } = getQueryParams();
    console.log(`ID: ${id}, Nombre: ${nombre}, Precio: ${precio}`);

    const imageMap = {
        1: 'img/deportivo.jpg',
        2: 'img/SUV.jpg',
        3: 'img/Volkswagen_Golf.jpg',
        4: 'img/turdratoyota.jpg',
        5: 'img/mustangshelby.jpg',
        6: 'img/mazdacx50.jpg',
        
    };

    document.getElementById('nombre-vehiculo').textContent = nombre;
    document.getElementById('precio-vehiculo').textContent = `$${precio}`;
    document.getElementById('imagen-vehiculo').src = imageMap[id];
}

function confirmarCompra() {
    window.location.href = 'compra.html';
}

window.onload = loadDetails;