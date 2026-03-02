// --- BASIC THEME & LANGUAGE ---
function toggleTheme(){
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    const icon = document.querySelector(".top-icons button i");
    if(icon) {
        icon.className = document.body.classList.contains("dark") ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
}

const translations = {
    en: { navHome: "Home", navProd: "Our Products", navCont: "Contact Us", navServ: "Services", navLog: "Sign In", title: "Beautiful Handmade Beaded Bags", text: "Discover unique, handcrafted beaded bags designed with culture, love, and elegance.", coll: "Our Featured Collection" },
    rw: { navHome: "Ahabanza", navProd: "Ibicuruzwa Byacu", navCont: "Twandikire", navServ: "Serivisi", navLog: "Injira", title: "Imifuka y’amasaro ikozwe n’intoki", text: "Menya imifuka y’amasaro yihariye ikozwe mu muco, urukundo n’ubwiza.", coll: "Ibihangano Byacu" }
};

const languageSelect = document.getElementById("language");
if(languageSelect) {
    languageSelect.addEventListener("change", () => {
        const l = languageSelect.value;
        localStorage.setItem("language", l);
        applyLanguage(l);
    });
}

function applyLanguage(l) {
    const t = translations[l];
    if(!t) return;
    document.getElementById("navHome").innerText = t.navHome;
    document.getElementById("navOurProducts").innerText = t.navProd;
    document.getElementById("navContact").innerText = t.navCont;
    document.getElementById("navServices").innerText = t.navServ;
    document.getElementById("navLogin").innerText = t.navLog;
    document.getElementById("heroTitle").innerText = t.title;
    document.getElementById("heroText").innerText = t.text;
    document.getElementById("collTitle").innerText = t.coll;
}

// --- CART SYSTEM LOGIC ---
let cart = JSON.parse(localStorage.getItem('dalaCart')) || [];

function toggleCart() {
    const dropdown = document.getElementById('cart-dropdown');
    if(dropdown) dropdown.classList.toggle('active');
}

function addToCart(name, price) {
    // Added uniqueId so we can remove specific items
    const uniqueId = Date.now() + Math.random();
    cart.push({ uniqueId, name, price });
    localStorage.setItem('dalaCart', JSON.stringify(cart));
    updateCartUI();
    const dropdown = document.getElementById('cart-dropdown');
    if(dropdown) dropdown.classList.add('active');
}

// NEW FUNCTION: Removes item by uniqueId
function removeFromCart(id) {
    cart = cart.filter(item => item.uniqueId !== id);
    localStorage.setItem('dalaCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const count = document.querySelector('.cart-count');
    const totalSpan = document.getElementById('cart-total-value');
    const whatsappBtn = document.getElementById('whatsapp-order-btn');

    if(count) count.innerText = cart.length;
    
    if(!list || !totalSpan) return;

    if(cart.length === 0) {
        list.innerHTML = '<p style="font-size:0.8rem; color:#888;">Cart is empty</p>';
        totalSpan.innerText = "0";
    } else {
        list.innerHTML = "";
        let total = 0;
        let itemsText = "";

        cart.forEach((item) => {
            total += item.price;
            itemsText += `- ${item.name} (${item.price} RWF)\n`;
            
            // Added a trash icon with an onclick event to remove the item
            list.innerHTML += `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span>${item.name}</span>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span><b>${item.price.toLocaleString()}</b></span>
                        <i class="fa-solid fa-trash" onclick="removeFromCart(${item.uniqueId})" style="color:#ff4757; cursor:pointer; font-size:0.9rem;"></i>
                    </div>
                </div>`;
        });

        totalSpan.innerText = total.toLocaleString();
        
        // Generate WhatsApp Link
        if(whatsappBtn) {
            const message = encodeURIComponent(`Hello Dala Threads! I'd like to order:\n${itemsText}\nTotal: ${total.toLocaleString()} RWF`);
            whatsappBtn.href = `https://wa.me/250795013119?text=${message}`;
        }
    }
}

// Initialize settings on load
window.onload = () => {
    updateCartUI();
    if(localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        const btnIcon = document.querySelector(".top-icons button i");
        if(btnIcon) btnIcon.className = "fa-solid fa-sun";
    }
    const savedLang = localStorage.getItem("language") || "en";
    if(languageSelect) languageSelect.value = savedLang;
    applyLanguage(savedLang);
};