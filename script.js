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

// ===== MOVIMENTO =====
// Um só gesto em todo o site: a linha dourada que se traça da esquerda para a direita
// (barra de leitura, divisores, sublinhado dos links e entrada dos blocos).
//
// Este arquivo roda no <head>, antes de a página ser desenhada:
// - "js" no <html> liga o cabeçalho transparente no topo;
// - "revela" no <html> esconde os blocos [data-reveal] até entrarem na tela.
// Sem JS (ou com "menos movimento" ativado no sistema) nada fica escondido.
(function () {
    var html = document.documentElement;
    var menosMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var podeRevelar = "IntersectionObserver" in window && !menosMovimento;

    html.classList.add("js");
    if (podeRevelar) html.classList.add("revela");

    // ---------- Revelar ao entrar na tela (esquerda -> direita, com escalonamento) ----------
    var ATRASO_ENTRE_ITENS = 90; // ms entre irmãos que entram juntos
    var MAX_ITENS_ESCALONADOS = 6;
    var DURACAO_MAIS_LONGA = 1100; // igual à transição mais longa em style.css
    var observador = null;

    // Depois da entrada, tira o data-reveal para o hover próprio de cada card voltar a valer.
    function mostrar(el, atraso) {
        el.style.setProperty("--reveal-delay", atraso + "ms");
        el.classList.add("is-visible");
        window.setTimeout(function () {
            el.removeAttribute("data-reveal");
            el.classList.remove("is-visible");
            el.style.removeProperty("--reveal-delay");
        }, atraso + DURACAO_MAIS_LONGA + 100);
    }

    function aoCruzar(entradas) {
        var visiveis = entradas
            .filter(function (e) { return e.isIntersecting; })
            .map(function (e) { return e.target; })
            .sort(function (a, b) {
                return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            });

        visiveis.forEach(function (el, i) {
            observador.unobserve(el);
            mostrar(el, Math.min(i, MAX_ITENS_ESCALONADOS) * ATRASO_ENTRE_ITENS);
        });
    }

    // Também usado por publicacoes.js para os cards que chegam depois.
    function revelar(elementos) {
        var lista = Array.prototype.slice.call(elementos || []);
        if (!html.classList.contains("revela")) {
            lista.forEach(function (el) { el.removeAttribute("data-reveal"); });
            return;
        }
        if (!observador) {
            observador = new IntersectionObserver(aoCruzar, {
                rootMargin: "0px 0px -8% 0px",
                threshold: 0.12,
            });
        }
        lista.forEach(function (el) {
            if (el.hasAttribute("data-reveal")) observador.observe(el);
        });
    }

    window.revelar = revelar;

    // [data-reveal="inicio"]: blocos do topo da página. Entram em sequência assim que a
    // página abre, sem esperar o observador (os botões de contato nunca ficam escondidos).
    function revelarInicio(elementos) {
        // Dois quadros de espera: garante que o estado inicial foi desenhado e a transição acontece.
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                Array.prototype.forEach.call(elementos, function (el, i) {
                    mostrar(el, 120 + i * ATRASO_ENTRE_ITENS);
                });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        try {
            var inicio = document.querySelectorAll('[data-reveal="inicio"]');
            if (html.classList.contains("revela")) {
                revelarInicio(inicio);
            } else {
                revelar(inicio);
            }
            revelar(document.querySelectorAll('[data-reveal]:not([data-reveal="inicio"])'));
        } catch (erro) {
            // Se algo falhar, o conteúdo aparece sem animação.
            html.classList.remove("revela");
        }
    });

    // ---------- Cabeçalho que encolhe + barra de leitura + parallax ----------
    document.addEventListener("DOMContentLoaded", function () {
        var cabecalho = document.querySelector(".site-header");
        var barra = cabecalho ? cabecalho.querySelector(".leitura span") : null;
        var paralaxe = menosMovimento ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
        var agendado = false;

        if (!cabecalho && !paralaxe.length) return;

        function atualizar() {
            agendado = false;
            var y = window.scrollY || window.pageYOffset;
            var alturaTela = window.innerHeight;

            if (cabecalho) {
                cabecalho.classList.toggle("is-condensed", y > 24);
            }

            if (barra) {
                var maximo = document.documentElement.scrollHeight - alturaTela;
                var progresso = maximo > 0 ? Math.min(1, Math.max(0, y / maximo)) : 0;
                barra.style.transform = "scaleX(" + progresso + ")";
            }

            // A imagem anda mais devagar que a moldura (no máximo 5% da altura dela).
            paralaxe.forEach(function (img) {
                var caixa = img.parentElement.getBoundingClientRect();
                if (caixa.bottom < 0 || caixa.top > alturaTela) return;
                var desvio = (caixa.top + caixa.height / 2 - alturaTela / 2) / alturaTela;
                desvio = Math.max(-1, Math.min(1, desvio));
                img.style.setProperty("--parallax-y", (-desvio * caixa.height * 0.05).toFixed(1) + "px");
            });
        }

        function agendar() {
            if (agendado) return;
            agendado = true;
            window.requestAnimationFrame(atualizar);
        }

        window.addEventListener("scroll", agendar, { passive: true });
        window.addEventListener("resize", agendar);
        atualizar();
    });
})();

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

    // Ao fechar o menu, a lista de áreas de "Serviços" também fecha
    details.addEventListener("toggle", function () {
        if (details.open) return;
        details.querySelectorAll(".submenu-mobile[open]").forEach(function (sub) {
            sub.removeAttribute("open");
        });
    });
});

// ===== ANO AUTOMÁTICO ===== //
document.addEventListener("DOMContentLoaded", function () {
    const ano = document.getElementById("ano");
    if (ano) ano.textContent = new Date().getFullYear();
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
