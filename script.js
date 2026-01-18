const inputEan = document.getElementById('eanInput');
const webAppUrl = "https://script.google.com/macros/s/AKfycbzpnezk3GTCtXHWdbMG7SrP91KY3EKSg9Oo_F1v1nM8AI97dy9FcpFQScCdB29975Rr/exec";

// --- 1. LÓGICA DE LA CÁMARA (NUEVO) ---
let html5QrCode;

async function toggleScanner() {
    const readerContainer = document.getElementById('reader-container');
    const searchBoxUI = document.getElementById('search-box-ui');

    // Si la cámara ya está encendida, la apagamos
    if (html5QrCode && html5QrCode.isScanning) {
        await html5QrCode.stop();
        readerContainer.style.display = 'none';
        searchBoxUI.style.display = 'flex'; 
        return;
    }

    // Encendemos la cámara
    readerContainer.style.display = 'block';
    searchBoxUI.style.display = 'none'; 
    
    html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
            inputEan.value = decodedText;
            toggleScanner(); // Cerramos cámara automáticamente al detectar el código
            buscar();        // Ejecutamos la búsqueda del producto
        },
        (errorMessage) => { /* buscando... */ }
    ).catch(err => {
        alert("Error de cámara: Asegúrate de dar permisos HTTPS.");
        console.error(err);
    });
}

// --- 2. MANTENER EL FOCO SIEMPRE ACTIVO ---
setInterval(() => {
    // Solo forzamos el foco si la cámara NO está encendida
    if (document.activeElement !== inputEan && (!html5QrCode || !html5QrCode.isScanning)) {
        inputEan.focus();
    }
}, 2000);

// --- 3. DETECTAR ESCANEO AUTOMÁTICO (Pistola) ---
let timer;
inputEan.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        if (inputEan.value.length >= 5) {
            buscar();
        }
    }, 300); 
});

// --- 4. FUNCIÓN DE BÚSQUEDA PRINCIPAL ---
async function buscar() {
    const ean = inputEan.value.trim();
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('result-area');
    
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

        resultArea.style.display = 'block';
        resDesc.innerText = data.descripcion;
        resItem.innerText = data.item;
        resUnidad.innerText = data.unidad;
        resPvp.innerText = "$" + Number(data.pvp).toLocaleString('es-AR');

        // AUTO-LIMPIEZA
        inputEan.value = "";
        inputEan.focus();

    } catch (e) {
        loader.style.display = 'none';
        console.error(e);
    }
}

// Soporte para el "Enter" físico
inputEan.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        clearTimeout(timer);
        buscar();
    }
});
