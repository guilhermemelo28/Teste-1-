/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./script.js"],
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
    plugins: [],
};
