const inputEan = document.getElementById('eanInput');
const webAppUrl = "https://script.google.com/macros/s/AKfycbzpnezk3GTCtXHWdbMG7SrP91KY3EKSg9Oo_F1v1nM8AI97dy9FcpFQScCdB29975Rr/exec"; // REEMPLAZA ESTO

// 1. MANTENER EL FOCO SIEMPRE ACTIVO
// Si el usuario hace clic en otro lado, el cursor vuelve al buscador en 2 segundos
setInterval(() => {
    if (document.activeElement !== inputEan) {
        inputEan.focus();
    }
}, 2000);

// 2. DETECTAR ESCANEO AUTOMÁTICO
// Si el escáner escribe rápido y no envía Enter, esto lo procesará
let timer;
inputEan.addEventListener('input', () => {
    clearTimeout(timer);
    // Si pasan 300ms sin que entren nuevos números, asumimos que el escáner terminó
    timer = setTimeout(() => {
        if (inputEan.value.length >= 5) {
            buscar();
        }
    }, 300); 
});

// 3. FUNCIÓN DE BÚSQUEDA PRINCIPAL
async function buscar() {
    const ean = inputEan.value.trim();
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('result-area');
    
    // Referencias a los campos de resultado
    const resDesc = document.getElementById('resDesc');
    const resItem = document.getElementById('resItem');
    const resUnidad = document.getElementById('resUnidad');
    const resPvp = document.getElementById('resPvp');

    if (!ean) return;

    loader.style.display = 'block';
    resultArea.style.display = 'none';

    try {
        const response = await fetch(`${webAppUrl}?ena=${ean}`);
        const data = await response.json();

        loader.style.display = 'none';

        if (!data) {
            alert("Producto no encontrado");
            inputEan.value = "";
            inputEan.focus();
            return;
        }

        // Mostrar resultados
        resultArea.style.display = 'block';
        resultArea.className = "success";
        resDesc.innerText = data.descripcion;
        resItem.innerText = data.item;
        resUnidad.innerText = data.unidad;
        resPvp.innerText = "$" + Number(data.pvp).toLocaleString('es-AR');

        // AUTO-LIMPIEZA PARA EL PRÓXIMO ESCANEO
        inputEan.value = "";
        inputEan.focus();

    } catch (e) {
        loader.style.display = 'none';
        console.error(e);
    }
}

// Soporte para el "Enter" físico que envían las pistolas
inputEan.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        clearTimeout(timer);
        buscar();
    }
});
