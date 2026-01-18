async function buscar() {
    const ean = document.getElementById('eanInput').value.trim();
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('result-area');
    
    // Nuevos campos
    const resDesc = document.getElementById('resDesc');
    const resItem = document.getElementById('resItem');
    const resUnidad = document.getElementById('resUnidad');
    const resPvp = document.getElementById('resPvp');

    if (!ean) return;

    loader.style.display = 'block';
    resultArea.style.display = 'none';

    const webAppUrl = "https://script.google.com/macros/s/AKfycbzpnezk3GTCtXHWdbMG7SrP91KY3EKSg9Oo_F1v1nM8AI97dy9FcpFQScCdB29975Rr/exec";

    try {
        const response = await fetch(`${webAppUrl}?ena=${ean}`);
        const data = await response.json(); // Ahora leemos JSON, no texto

        loader.style.display = 'none';

        if (!data) {
            alert("Producto no encontrado en la base de datos.");
            return;
        }

        resultArea.style.display = 'block';
        resultArea.className = "success";

        // Llenamos los datos
        resDesc.innerText = data.descripcion;
        resItem.innerText = data.item;
        resUnidad.innerText = data.unidad;

        // ... dentro del try después de mostrar los datos ...
        resPvp.innerText = "$" + Number(data.pvp).toLocaleString('es-AR');
        
        // Limpiar y enfocar para la siguiente búsqueda rápida
        document.getElementById('eanInput').value = "";
        document.getElementById('eanInput').focus();
        
        // ...
        
        // Formateamos el precio (Asumiendo que es un número)
        resPvp.innerText = "$" + Number(data.pvp).toLocaleString('es-AR');

    } catch (e) {
        loader.style.display = 'none';
        alert("Error de conexión o de datos.");
        console.error(e);
    }
}