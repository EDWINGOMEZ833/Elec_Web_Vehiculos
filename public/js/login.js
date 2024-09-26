document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre_usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;

        // Verifica que los campos no estén vacíos
        if (nombre_usuario === '' || contrasena === '') {
            alert('Por favor, complete todos los campos');
            return;
        }

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_usuario, contrasena }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                // Almacena los datos en sessionStorage
                sessionStorage.setItem('usuario', nombre_usuario);
                sessionStorage.setItem('tipo_usuario', data.tipo_usuario);

                // Redirige según el tipo de usuario
                if (data.tipo_usuario === 'administrador') {
                    window.location.href = 'admin-catalogo.html';
                } else {
                    window.location.href = 'catalogo.html';
                }
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
