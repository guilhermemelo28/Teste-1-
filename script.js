// ===== CONFIGURAÇÃO DO TAILWIND =====
// Uma única escala de dourado, no tom do site antigo e do favicon (#FBBF24).
// Os tons 200-600 também estão em style.css (:root).
tailwind.config = {
    theme: {
        extend: {
            colors: {
                gold: {
                    200: "#FDE68A", // brilho: hover, linha do nome
                    400: "#FBBF24", // links, foco, hover do botão
                    500: "#EAB308", // principal: botão, ícones, rótulos
                    600: "#CA8A04", // contornos
                    800: "#854D0E", // bordas
                    900: "#713F12", // bordas e divisórias suaves
                    950: "#422006", // fundos de hover
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
    const details = document.getElementById("menu-mobile");
    if (!details) return;
    const mobileLinks = details.querySelectorAll("nav a");

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

// ===== BOTÃO FLUTUANTE WHATSAPP ===== //
// Estilos, hover e foco ficam em style.css (.wa-flutuante).
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.createElement("a");
    btn.href = "https://wa.me/5517997413122?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o.";
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.className = "wa-flutuante";
    btn.setAttribute("aria-label", "Falar no WhatsApp");
    btn.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';
    document.body.appendChild(btn);
});
