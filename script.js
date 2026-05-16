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
 