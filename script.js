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
function addToCart(name, price, button = null) {
    const numericPrice = Number.parseFloat(price);

    if (!name || !Number.isFinite(numericPrice)) {
        console.error("No se pudo añadir el producto: nombre o precio inválido.", { name, price });
        return;
    }

    cart.push({ name: name, price: numericPrice });

    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.innerText = cart.length;

    // La animación del botón es opcional para que el carrito funcione
    // aunque la llamada no proporcione una referencia al botón.
    if (button) {
        const originalText = button.innerText;
        button.innerText = "¡Añadido! ✓";
        button.style.backgroundColor = "#2ecc71";

        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = "";
        }, 1200);
    }

    updateCartUI();
}

/**
 * Añade al carrito un producto del catálogo generado dinámicamente.
 */
function addToCartByIndex(index, button = null) {
    const product = products[index];

    if (!product) {
        console.error("No se encontró el producto con índice:", index);
        return;
    }

    addToCart(product.name, product.price, button);
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
        totalSpan.innerText = "\$0.00";
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
    const productsList = document.querySelectorAll('.product');
    
    productsList.forEach(p => {
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
    const form = document.getElementById('customOrderForm');
    const nombre = document.getElementById('orderName').value;
    const correo = document.getElementById('orderEmail').value || "No proporcionado";
    const detalles = document.getElementById('orderDetails').value;

    if (!nombre || !detalles) {
        alert("Por favor, completa tu nombre y el detalle de tu pedido.");
        return;
    }

    let message = "¡Hola Ventas RIODONTECSERVICE! 📩%0A";
    message += "*NUEVO PEDIDO PERSONALIZADO*%0A%0A";
    message += `👤 *Nombre:* ${nombre}%0A`;
    message += `📧 *Correo:* ${correo}%0A`;
    message += `📝 *Pedido:* ${detalles}%0A%0A`;
    message += "Espero su pronta respuesta. ¡Gracias!";

    window.open(`https://wa.me/${NUMERO_VENTAS}?text=${message}`, '_blank');
    form.reset();
}

// --- 7. LÓGICA DE LOGIN DE ADMINISTRADOR ---

function openAdminLogin() {
    if (localStorage.getItem("riodontec_auth") === "true") {
        initAdminPanel();
        return;
    }
    
    const modal = document.getElementById('admin-login-modal');
    const overlay = document.getElementById('admin-login-overlay');
    
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        console.error("No se encontró el modal o el overlay de login en el HTML.");
    }
}

function closeAdminLogin() {
    const modal = document.getElementById('admin-login-modal');
    const overlay = document.getElementById('admin-login-overlay');
    
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

function handleAdminLogin(event) {
    event.preventDefault();
    const userInput = document.getElementById('adminUser');
    const passInput = document.getElementById('adminPass');

    if (!userInput || !passInput) return;

    const user = userInput.value.trim();
    const pass = passInput.value;

    if (user === "admin" && pass === "riodontec2027") {
        alert("¡Bienvenido al panel de administración!");
        localStorage.setItem("riodontec_auth", "true");
        closeAdminLogin();
        
        const form = document.getElementById('adminLoginForm');
        if (form) form.reset();
        
        initAdminPanel();
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}
// --- 8. LÓGICA DEL PANEL CRUD Y PERSISTENCIA (LOCALSTORAGE) ---

// Lista oficial por defecto de los 12 productos con sus imágenes
let defaultProducts = [
    { name: "Filtro de Aire", price: 25.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHWNluDQyAsg8EZoPo1kfjJ9B5ZXpHVPTKfV-IQ-SMmQ&s" },
    { name: "Punta Ultrasonido G1", price: 15.00, img: "https://www.dentalcost.es/15859-thickbox_default/punta-ultrasonidos-g1-tipo-ems-1-unidad.jpg" },
    { name: "Manguera Borden 4H precio x metro", price: 12.00, img: "https://http2.mlstatic.com/D_NQ_NP_985961-MLA92692470577_092025-O.webp" },
    { name: "Sillones odontológicos", price: 2500.00, img: "https://i.postimg.cc/ZRQDbbbX/Whats-App-Image-2025-12-30-at-20-21-50.jpg" },
    { name: "Jeringa Triple", price: 40.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWHv4Cv_xlyOROK6mfCmhzj9D6zhvILZlIs10eYOim4DXZMWBslfZRm50&s=10" },
    { name: "Presostato Square D", price: 55.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJrbSyMSadSoZc_OKwNKv3ySjsXC9UlGFNyr5bIFrbSQ&s=10" },
    { name: "Válvula de Pedal", price: 48.00, img: "https://unidadesdentalesperu.com/wp-content/uploads/2023/10/valvula-peda.jpg" },
    { name: "Kit O-rings", price: 20.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2wFNBKd_I5DDiirgYhuqn0SJhgLNNdPCFJFudRi3KKedKXmdrRbw1x3zz&s=10" },
    { name: "Acople Rápido 4H", price: 65.00, img: "https://mltracores.com/wp-content/uploads/2022/09/hembra-cavitron.jpg" },
    { name: "Manómetro de Presión", price: 18.00, img: "https://s.alicdn.com/@sc04/kf/Hd6f5e9fa5c614655bcc48d8e07e1bde2C/Dental-high-and-low-speed-handpiece-pressure-gauge-pressure-gauge-for-measuring-oral-and-dental-chair-motor-repair-and-testing..jpg_300x300.jpg" },
    { name: "Válvula de Succión", price: 22.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgL6WZuY8N_eaMB2TOplLFMF1vy45ubuhpjbzNHL3wXdSJcbtMOqUDbhg&s=10" },
    { name: "Aceite en Spray", price: 15.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlYQJ3ejRC5hLH2vKuzagILO4fE81KZcrmVTJkDBEk-HCwYIfDbxxhDnqO&s=10" }
];

let products = defaultProducts;
try {
    const storedProducts = JSON.parse(localStorage.getItem("riodontec_products"));
    if (Array.isArray(storedProducts)) {
        products = storedProducts
            .filter(product => product && typeof product.name === "string" && Number.isFinite(Number(product.price)))
            .map(product => ({
                name: product.name,
                price: Number(product.price),
                img: typeof product.img === "string" ? product.img : ""
            }));
    }
} catch (error) {
    console.error("No se pudieron leer los productos guardados; se usarán los productos predeterminados.", error);
}

function saveProductsToStorage() {
    localStorage.setItem("riodontec_products", JSON.stringify(products));
}

/**
 * Abre el panel de administración
 */
function initAdminPanel() {
    const adminModal = document.getElementById('admin-panel-modal');
    const adminOverlay = document.getElementById('admin-panel-overlay');
    
    if (adminModal && adminOverlay) {
        adminModal.style.display = 'block';
        adminOverlay.style.display = 'block';
        renderAdminTable();
    }
}

/**
 * Cierra el panel de administración
 */
function closeAdminPanel() {
    const adminModal = document.getElementById('admin-panel-modal');
    const adminOverlay = document.getElementById('admin-panel-overlay');
    
    if (adminModal && adminOverlay) {
        adminModal.style.display = 'none';
        adminOverlay.style.display = 'none';
    }
}

/**
 * Cierra la sesión del administrador
 */
function logoutAdmin() {
    localStorage.removeItem("riodontec_auth");
    closeAdminPanel();
    alert("Sesión de administrador cerrada correctamente.");
}

/**
 * Dibuja la tabla dentro del panel de administración
 */
function renderAdminTable() {
    const tbody = document.getElementById('admin-products-table-body');
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px; color:#888;">No hay repuestos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = "";
    products.forEach((product, index) => {
        tbody.innerHTML += `
            <tr>
                <td style="padding:10px;">${product.name}</td>
                <td style="padding:10px;">$${product.price.toFixed(2)}</td>
                <td style="padding:10px;">
                    <button onclick="editProduct(${index})" style="background:#f39c12; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;">Editar</button>
                    <button onclick="deleteProduct(${index})" style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

/**
 * Guarda un producto nuevo o actualiza uno existente con su imagen personalizada
 */
function saveProduct(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('productNameInput');
    const priceInput = document.getElementById('productPriceInput');
    const imgInput = document.getElementById('productImgInput');
    const editIndexInput = document.getElementById('productIndex') || document.getElementById('productEditIndex');

    if (!nameInput || !priceInput || !imgInput) return;

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const imgUrl = imgInput.value.trim();
    const editIndex = editIndexInput ? editIndexInput.value : "";

    if (!name || isNaN(price) || !imgUrl) {
        alert("Por favor, completa todos los campos, incluyendo la URL de la imagen.");
        return;
    }

    if (editIndex === "" || editIndex < 0) {
        products.push({ name: name, price: price, img: imgUrl });
    } else {
        products[editIndex] = { name: name, price: price, img: imgUrl };
        if(editIndexInput) editIndexInput.value = "";
    }

    saveProductsToStorage();
    document.getElementById('productForm').reset();
    renderAdminTable();
    renderProducts();

    alert("¡Producto guardado exitosamente!");
}

/**
 * Carga los datos en el formulario para editar (incluyendo la foto)
 */
function editProduct(index) {
    const product = products[index];
    if (!product) return;

    document.getElementById('productNameInput').value = product.name;
    document.getElementById('productPriceInput').value = product.price;
    const imgInput = document.getElementById('productImgInput');
    if(imgInput) imgInput.value = product.img || "";
    
    const editIndexInput = document.getElementById('productIndex') || document.getElementById('productEditIndex');
    if(editIndexInput) editIndexInput.value = index;
}

/**
 * Elimina un producto de la lista
 */
function deleteProduct(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto del inventario?")) {
        products.splice(index, 1);
        saveProductsToStorage();
        renderAdminTable();
        renderProducts();
    }
}


/**
 * Renderiza las tarjetas del catálogo principal usando el índice del array
 */
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = "";
    products.forEach((product, index) => {
        grid.innerHTML += `
            <div class="product" data-name="${product.name}">
                <div class="img-container">
                    <img src="${product.img}" alt="${product.name}" class="product-img">
                </div>
                <h3>${product.name}</h3>
                <p>Componente certificado con garantía.</p>
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCartByIndex(${index}, this)">Añadir</button>
            </div>
        `;
    });
}
// Ejecutar al cargar la página para pintar el catálogo correctamente
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});
