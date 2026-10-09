/**
 * RIODONTECSERVICE - Script Oficial 2025
 * Configuración de números diferenciados y Resumen Profesional
 */

// --- 1. CONFIGURACIÓN DE NÚMEROS ---
const NUMERO_EXPERTO = "593990498248"; // Asesoría Técnica
const NUMERO_VENTAS = "593969911535";  // Pedidos y Ventas

// --- 2. VARIABLES GLOBALES Y CARRUSEL ---
let slideIndex = 0;
let cart = []; 
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');

function nextSlide() {
    if (!slider || slides.length === 0) return; 
    slideIndex = (slideIndex + 1) % slides.length;
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;
}
if (slider && slides.length > 0) setInterval(nextSlide, 8000);

// --- 3. ACORDEÓN DE SERVICIOS ---
function toggleWork(header) {
    const card = header.parentElement;
    const icon = header.querySelector('.icon');
    document.querySelectorAll('.work-card').forEach(c => {
        if (c !== card) {
            c.classList.remove('active');
            const otherIcon = c.querySelector('.icon');
            if(otherIcon) otherIcon.innerText = '+';
        }
    });
    card.classList.toggle('active');
    if(icon) icon.innerText = card.classList.contains('active') ? '-' : '+';
}

// --- 4. SISTEMA DE CARRITO (RESUMEN PROFESIONAL) ---

/**
 * Abre y cierra la ventana del resumen
 */
function toggleCartDisplay() {
    const cartWindow = document.getElementById('cart-dropdown');
    const overlay = document.getElementById('cart-overlay');
    
    if (cartWindow && overlay) {
        if (cartWindow.style.display === "none" || cartWindow.style.display === "") {
            cartWindow.style.display = "block";
            overlay.style.display = "block";
            updateCartUI(); 
        } else {
            cartWindow.style.display = "none";
            overlay.style.display = "none";
        }
    }
}

/**
 * Añade productos y actualiza el contador
 */
function addToCart(name, price) {
    cart.push({ name: name, price: parseFloat(price) });
    const countElement = document.getElementById('cart-count');
    if(countElement) countElement.innerText = cart.length;
    
    // Notificación visual en el botón
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "¡Añadido! ✓";
    btn.style.backgroundColor = "#2ecc71"; 
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = ""; 
    }, 1200);

    updateCartUI();
}

/**
 * Elimina un producto individualmente
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    const countElement = document.getElementById('cart-count');
    if(countElement) countElement.innerText = cart.length;
    updateCartUI();
}

/**
 * Dibuja la lista en la ventana flotante (Estilo Resumen)
 */
function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const totalSpan = document.getElementById('cart-total-value');
    if (!list || !totalSpan) return;

    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-msg">No hay repuestos seleccionados.</p>';
        totalSpan.innerText = "$0.00";
        return;
    }

    list.innerHTML = ""; 
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div class="cart-item-row">
                <div style="display:flex; flex-direction:column;">
                    <span class="item-name">${item.name}</span>
                    <small style="margin-left:35px; color:#888; cursor:pointer; text-decoration:underline;" onclick="removeFromCart(${index})">Eliminar</small>
                </div>
                <span class="item-price">$${item.price.toFixed(2)}</span>
            </div>`;
    });
    totalSpan.innerText = `$${total.toFixed(2)}`;
}

// --- 5. FUNCIONES DE ENVÍO A WHATSAPP ---

/**
 * Envía el pedido al número de VENTAS
 */
function sendOrderWhatsApp() {
    if (cart.length === 0) {
        alert("El carrito está vacío. Añade algunos productos primero.");
        return;
    }

    let message = "¡Hola Ventas RIODONTECSERVICE! 🛒%0A";
    message += "Deseo realizar un pedido de los siguientes repuestos:%0A%0A";

    cart.forEach((item) => {
        message += `✅ *${item.name}* - $${item.price.toFixed(2)}%0A`;
    });

    const totalValue = document.getElementById('cart-total-value').innerText;
    message += `%0A💰 *TOTAL ESTIMADO: ${totalValue}*`;
    message += "%0A%0A¿Podrían confirmarme disponibilidad y envío?";

    window.open(`https://wa.me/${NUMERO_VENTAS}?text=${message}`, '_blank');
toggleCartDisplay();
cart = [];

    // Ponemos el contador del header en 0
    const countElement = document.getElementById('cart-count');
    if(countElement) countElement.innerText = "0";
}

/**
 * Envía consulta al número del EXPERTO (Botón flotante)
 */
function contactExpert() {
    const msg = "Saludos RIODONTECSERVICE, necesito asesoría de un experimentado en servicio técnico de equipos dentales.";
    window.open(`https://wa.me/${NUMERO_EXPERTO}?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- 6. BUSCADOR DE CATÁLOGO ---
function filterProducts() {
    const input = document.getElementById('productSearch').value.toLowerCase();
    const products = document.querySelectorAll('.product');
    
    products.forEach(p => {
        const name = p.getAttribute('data-name') ? p.getAttribute('data-name').toLowerCase() : "";
        if (name.includes(input)) {
            p.style.display = "flex"; 
        } else {
            p.style.display = "none";
        }
    });
}

/**
 * Envía el formulario de pedido personalizado a WhatsApp y limpia los campos
 */
function sendCustomOrder() {
    // 1. Obtener el formulario y los valores
    const form = document.getElementById('customOrderForm');
    const nombre = document.getElementById('orderName').value;
    const correo = document.getElementById('orderEmail').value || "No proporcionado";
    const detalles = document.getElementById('orderDetails').value;

    // 2. Validación básica
    if (!nombre || !detalles) {
        alert("Por favor, completa tu nombre y el detalle de tu pedido.");
        return;
    }

    // 3. Construir el mensaje para WhatsApp
    let message = "¡Hola Ventas RIODONTECSERVICE! 📩%0A";
    message += "*NUEVO PEDIDO PERSONALIZADO*%0A%0A";
    message += `👤 *Nombre:* ${nombre}%0A`;
    message += `📧 *Correo:* ${correo}%0A`;
    message += `📝 *Pedido:* ${detalles}%0A%0A`;
    message += "Espero su pronta respuesta. ¡Gracias!";

    // 4. Abrir WhatsApp
    window.open(`https://wa.me/${NUMERO_VENTAS}?text=${message}`, '_blank');

    // 5. LA CORRECCIÓN: Borrar los datos del formulario automáticamente
    form.reset();

    // Opcional: Mostrar un mensaje de éxito rápido
    console.log("Formulario enviado y limpiado con éxito.");
}

// --- 7. LÓGICA DE LOGIN DE ADMINISTRADOR ---

function openAdminLogin() {
    // Si ya está autenticado, abrir directo el panel
    if (localStorage.getItem("riodontec_auth") === "true") {
        initAdminPanel();
        return;
    }
    
    const modal = document.getElementById('admin-login-modal');
    const overlay = document.getElementById('admin-login-overlay');
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }
}

function closeAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    const overlay = document.getElementById('admin-login-overlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value;

    // Credenciales directas de administrador
    if (user === "admin" && pass === "riodontec2027") {
        alert("¡Bienvenido al panel de administración!");
        localStorage.setItem("riodontec_auth", "true");
        closeAdminLogin();
        document.getElementById('adminLoginForm').reset();
        
        // Abrir el panel CRUD de productos
        initAdminPanel();
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}
