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

    // 5. Borrar los datos del formulario automáticamente
    form.reset();

    console.log("Formulario enviado y limpiado con éxito.");
}

// --- 7. LÓGICA DE LOGIN DE ADMINISTRADOR ---

function openAdminLogin() {
    // Si ya está autenticado, abrir directo el panel CRUD sin pedir credenciales de nuevo
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

    // Credenciales de administrador
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

// --- 8. LÓGICA DEL PANEL CRUD Y PERSISTENCIA (LOCALSTORAGE) ---

// Lista base con los 16 productos reales y sus respectivas imágenes originales
let defaultProducts = [
    { name: "Rodamiento Cerámico", price: 70.00, img: "https://i.postimg.cc/6pM4Sy5x/Whats-App-Image-2025-12-30-at-19-08-05.jpg" },
    { name: "Filtro de Aire 1/4", price: 25.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1THolIbc1ETVeDtR4rkjQaBmSkX51Lksjeg&s" },
    { name: "Punta Ultrasonido G1", price: 15.00, img: "https://i.postimg.cc/Wbctz0HV/Whats-App-Image-2025-12-30-at-20-36-56.jpg" },
    { name: "Manguera Borden 4H", price: 35.00, img: "https://i.postimg.cc/3NY55rnn/Whats-App-Image-2025-12-30-at-20-46-13.jpg" },
    { name: "Sillones odontológicos", price: 2500.00, img: "https://i.postimg.cc/ZRQDbbbX/Whats-App-Image-2025-12-30-at-20-21-50.jpg" },
    { name: "Jeringa Triple", price: 40.00, img: "https://i.postimg.cc/K8KjjQD9/Whats-App-Image-2025-12-30-at-19-07-26.jpg" },
    { name: "Presostato Square D", price: 55.00, img: "https://i.postimg.cc/Y2bQmnQB/Whats-App-Image-2025-12-30-at-20-32-16.jpg" },
    { name: "Válvula de Pedal", price: 48.00, img: "https://i.postimg.cc/T3h0w8s9/Whats-App-Image-2025-12-30-at-20-29-02.jpg" },
    { name: "Kit O-rings (50 pcs)", price: 20.00, img: "https://i.postimg.cc/6pM4Sy5x/Whats-App-Image-2025-12-30-at-19-08-05.jpg" },
    { name: "Acople Rápido 4H", price: 65.00, img: "https://i.postimg.cc/3NY55rnn/Whats-App-Image-2025-12-30-at-20-46-13.jpg" },
    { name: "Manómetro de Presión", price: 18.00, img: "https://i.postimg.cc/Y2bQmnQB/Whats-App-Image-2025-12-30-at-20-32-16.jpg" },
    { name: "Válvula de Succión", price: 22.00, img: "https://i.postimg.cc/Wbctz0HV/Whats-App-Image-2025-12-30-at-20-36-56.jpg" },
    { name: "Aceite en Spray", price: 15.00, img: "https://i.postimg.cc/K8KjjQD9/Whats-App-Image-2025-12-30-at-19-07-26.jpg" },
    { name: "Micro-motor E-type", price: 110.00, img: "https://i.postimg.cc/6pM4Sy5x/Whats-App-Image-2025-12-30-at-19-08-05.jpg" },
    { name: "Contra-ángulo 1:1", price: 85.00, img: "https://i.postimg.cc/3NY55rnn/Whats-App-Image-2025-12-30-at-20-46-13.jpg" },
    { name: "Tarjeta de Control", price: 145.00, img: "https://i.postimg.cc/T3h0w8s9/Whats-App-Image-2025-12-30-at-20-29-02.jpg" }
];

// Carga los productos guardados en el navegador o usa los predeterminados
let products = JSON.parse(localStorage.getItem("riodontec_products")) || defaultProducts;

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
    const imgInput = document.getElementById('productImgInput'); // Nuevo campo de imagen
    const editIndexInput = document.getElementById('productEditIndex');

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
        // Añadir nuevo producto con la imagen ingresada
        products.push({ 
            name: name, 
            price: price, 
            img: imgUrl 
        });
    } else {
        // Actualizar producto existente conservando o actualizando su imagen
        products[editIndex] = { 
            name: name, 
            price: price, 
            img: imgUrl 
        };
        editIndexInput.value = "";
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
    document.getElementById('productImgInput').value = product.img || ""; // Carga la URL actual en el input
    document.getElementById('productEditIndex').value = index;
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
 * Renderiza las tarjetas del catálogo principal respetando la imagen de cada repuesto
 */
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = "";
    products.forEach((product) => {
        grid.innerHTML += `
            <div class="product" data-name="${product.name}">
                <div class="img-container">
                    <img src="${product.img}" alt="${product.name}" class="product-img">
                </div>
                <h3>${product.name}</h3>
                <p>Componente certificado con garantía.</p>
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">Añadir</button>
            </div>
        `;
    });
}

// Ejecutar al cargar la página para pintar el catálogo correctamente
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});
