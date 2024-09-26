document.getElementById('registro-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const tipo_documento = document.getElementById('tipo_documento').value.trim();
    const numero_documento = document.getElementById('cedula').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const nombre_usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    // Validar que los campos no estén vacíos
    if (!nombre || !tipo_documento || !numero_documento || !correo || !nombre_usuario || !contrasena) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Realizar la solicitud POST al servidor para registrar el usuario
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            tipo_documento: tipo_documento,
            numero_documento: numero_documento,
            correo: correo,
            nombre_usuario: nombre_usuario,
            contrasena: contrasena
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.text();
    })
    .then(data => {
        if (data === 'Usuario registrado correctamente.') {
            alert('Registro exitoso. Ahora puede iniciar sesión.');
            window.location.href = 'login.html';
        } else {
            alert(data);  // Mostrar cualquier error que devuelva el servidor
        }
    })
    .catch(error => {
        console.error('Error en el registro:', error);
        alert(error.message); // Mostrar el mensaje de error recibido del servidor
    });
});
