// ===== CONFIGURAÇÃO DO TAILWIND =====
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    300: "#fde68a",
                    400: "#fbbf24",
                    500: "#d97706",
                    600: "#b45309",
                    700: "#92400e",
                },
                gold: {
                    100: "#fef3c7",
                    200: "#fde68a",
                    300: "#fcd34d",
                    400: "#fbbf24",
                    500: "#f59e0b",
                    600: "#d97706",
                    700: "#b45309",
                },
            },
            fontFamily: {
                sans: ["Urbanist", "system-ui", "sans-serif"],
            },
        },
    },
};
 
// ===== FECHAR MENU MOBILE AO CLICAR EM UM LINK =====
document.addEventListener("DOMContentLoaded", function () {
    const details = document.querySelector("details");
    const mobileLinks = document.querySelectorAll("details nav a");
 
    mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            details.removeAttribute("open");
        });
    });
});

// ===== ANO AUTOMÁTICO ===== //
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ano").textContent = new Date().getFullYear();
});
// ===== BOTÃO FLUTUANTE WHATSAPP =====
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.createElement("a");
    btn.href = "https://wa.me/5517997413122";
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.setAttribute("aria-label", "Falar no WhatsApp");
    btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    btn.style.cssText = `
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        background: #25d366;
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: 0 4px 20px rgba(37,211,102,0.4);
        transition: transform 0.2s, box-shadow 0.2s;
        text-decoration: none;
    `;
    btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.1)";
        btn.style.boxShadow = "0 6px 28px rgba(37,211,102,0.6)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
        btn.style.boxShadow = "0 4px 20px rgba(37,211,102,0.4)";
    });
    document.body.appendChild(btn);
});