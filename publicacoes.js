// ===== PUBLICAÇÕES DO INSTAGRAM (@dr.wesleymelo) =====
//
// COLE AQUI a URL do feed JSON do Behold.so, entre as aspas.
// No painel do Behold: abra o feed > "Embed on your website" > "JSON" e copie a URL.
// Exemplo: "https://feeds.behold.so/AbCdEf1234567890"
// Enquanto estiver vazia, o site mostra o convite para acompanhar o perfil no Instagram.
const INSTAGRAM_FEED_URL = "https://feeds.behold.so/OEYWCIXA0U4Elu7MS9QI";

const INSTAGRAM_PERFIL_URL = "https://www.instagram.com/dr.wesleymelo/";
const TEMPO_LIMITE_MS = 8000;

// Uso no HTML:
//   <div data-publicacoes data-quantidade="6">           -> home: 6 posts
//   <div data-publicacoes data-quantidade="12" data-carregar-mais="12">  -> página com "Carregar mais"
//   Dentro dele, um bloco [data-pub-aviso] (convite para o Instagram) já pronto no HTML:
//   é o que aparece sem JS, sem URL configurada ou se o feed falhar.
//   [data-pub-com-feed]: elementos que só fazem sentido com o feed (ex.: "Ver todas").
//   [data-pub-mais] (botão), [data-pub-fim] (aviso de fim), [data-pub-status] (leitor de tela).
(function () {
    "use strict";

    var raiz = document.querySelector("[data-publicacoes]");
    if (!raiz) return;

    var aviso = raiz.querySelector("[data-pub-aviso]");
    var comFeed = document.querySelectorAll("[data-pub-com-feed]");
    var botaoMais = document.querySelector("[data-pub-mais]");
    var fim = document.querySelector("[data-pub-fim]");
    var status = document.querySelector("[data-pub-status]");

    var quantidade = parseInt(raiz.getAttribute("data-quantidade"), 10) || 6;
    var passo = parseInt(raiz.getAttribute("data-carregar-mais"), 10) || 0;

    var formatoData = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" });

    function revelar(elementos) {
        if (typeof window.revelar === "function") window.revelar(elementos);
    }

    function el(tag, classe) {
        var no = document.createElement(tag);
        if (classe) no.className = classe;
        return no;
    }

    function textoOculto(texto) {
        var span = el("span", "sr-only");
        span.textContent = texto;
        return span;
    }

    function anunciar(texto) {
        if (status) status.textContent = texto;
    }

    // ---------- Estado: convite para o Instagram (nunca deixa a seção vazia) ----------
    function mostrarAviso() {
        if (!aviso) return;
        raiz.removeAttribute("aria-busy");
        raiz.replaceChildren(aviso);
        Array.prototype.forEach.call(comFeed, function (e) { e.hidden = true; });
        if (botaoMais) botaoMais.hidden = true;
        if (fim) fim.hidden = true;
        revelar([aviso]);
    }

    if (!INSTAGRAM_FEED_URL.trim()) {
        mostrarAviso();
        return;
    }

    // ---------- Dados: parser tolerante ----------
    // Só aceita endereços https (o conteúdo vem de fora: nada de "javascript:").
    function urlSegura(valor) {
        if (typeof valor !== "string" || !valor) return "";
        try {
            var url = new URL(valor);
            return url.protocol === "https:" ? url.href : "";
        } catch (erro) {
            return "";
        }
    }

    // Tira as hashtags e menções do fim da legenda e junta as linhas.
    function limparLegenda(texto) {
        return String(texto || "")
            .replace(/(\s*[#@][^\s#@]+)+\s*$/u, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function trecho(texto, maximo) {
        if (texto.length <= maximo) return texto;
        var corte = texto.slice(0, maximo);
        var espaco = corte.lastIndexOf(" ");
        return (espaco > maximo * 0.6 ? corte.slice(0, espaco) : corte).replace(/[\s.,;:!?-]+$/, "") + "…";
    }

    function normalizar(post) {
        if (!post || typeof post !== "object") return null;

        var tipo = String(post.mediaType || post.media_type || "IMAGE").toUpperCase();
        var tamanhos = post.sizes || {};
        var media = post.mediaUrl || post.media_url || "";
        var miniatura = post.thumbnailUrl || post.thumbnail_url || "";

        var imagem =
            urlSegura(tamanhos.medium && tamanhos.medium.mediaUrl) ||
            urlSegura(tamanhos.small && tamanhos.small.mediaUrl) ||
            urlSegura(tipo === "VIDEO" ? miniatura : media) ||
            urlSegura(miniatura);

        var data = new Date(post.timestamp || post.date || "");

        return {
            link: urlSegura(post.permalink || post.url),
            imagem: imagem,
            tipo: tipo,
            legenda: limparLegenda(post.prunedCaption || post.caption || ""),
            data: isNaN(data.getTime()) ? null : data,
        };
    }

    function lerFeed(dados) {
        var lista = Array.isArray(dados)
            ? dados
            : (dados && (dados.posts || dados.data || dados.items)) || [];

        return lista
            .map(normalizar)
            .filter(function (p) { return p && p.link; })
            .sort(function (a, b) {
                return (b.data ? b.data.getTime() : 0) - (a.data ? a.data.getTime() : 0);
            });
    }

    function buscarFeed() {
        var controle = "AbortController" in window ? new AbortController() : null;
        var limite = window.setTimeout(function () { if (controle) controle.abort(); }, TEMPO_LIMITE_MS);

        return fetch(INSTAGRAM_FEED_URL, controle ? { signal: controle.signal } : {})
            .then(function (resposta) {
                if (!resposta.ok) throw new Error("Feed respondeu " + resposta.status);
                return resposta.json();
            })
            .finally(function () { window.clearTimeout(limite); });
    }

    // ---------- Cards ----------
    var TIPOS = {
        VIDEO: { icone: "fa-solid fa-play", nome: "Vídeo" },
        CAROUSEL_ALBUM: { icone: "fa-regular fa-clone", nome: "Carrossel com várias imagens" },
    };

    function semImagem(caixa) {
        caixa.classList.add("sem-imagem");
        var icone = el("i", "fa-brands fa-instagram");
        icone.setAttribute("aria-hidden", "true");
        caixa.prepend(icone);
    }

    function criarCartao(post) {
        var item = el("li", "pub-item");
        item.setAttribute("data-reveal", "");

        var link = el("a", "pub-card");
        link.href = post.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        var caixa = el("div", "pub-thumb");
        if (post.imagem) {
            var img = el("img");
            img.src = post.imagem;
            img.alt = post.legenda
                ? "Imagem da publicação: " + trecho(post.legenda, 110)
                : "Imagem de uma publicação do Dr. Wesley de Oliveira Melo no Instagram";
            img.width = 640;
            img.height = 640;
            img.loading = "lazy";
            img.decoding = "async";
            img.addEventListener("error", function () {
                img.remove();
                semImagem(caixa);
            });
            caixa.appendChild(img);
        } else {
            semImagem(caixa);
        }

        var tipo = TIPOS[post.tipo];
        if (tipo) {
            var selo = el("span", "pub-tipo");
            var icone = el("i", tipo.icone);
            icone.setAttribute("aria-hidden", "true");
            selo.appendChild(icone);
            selo.appendChild(textoOculto(tipo.nome));
            caixa.appendChild(selo);
        }

        var corpo = el("div", "pub-corpo");

        var legenda = el("p", "pub-legenda");
        legenda.textContent = post.legenda ? trecho(post.legenda, 260) : "Publicação no Instagram";
        corpo.appendChild(legenda);

        if (post.data) {
            var data = el("time", "pub-data");
            data.dateTime = post.data.toISOString();
            data.textContent = formatoData.format(post.data);
            corpo.appendChild(data);
        }

        link.appendChild(caixa);
        link.appendChild(corpo);
        link.appendChild(textoOculto(" (abre no Instagram, em nova aba)"));
        item.appendChild(link);
        return item;
    }

    function criarEsqueleto() {
        var item = el("li", "pub-item pub-esqueleto");
        item.setAttribute("aria-hidden", "true");
        var card = el("div", "pub-card");
        var caixa = el("div", "pub-thumb");
        var corpo = el("div", "pub-corpo");
        ["92%", "78%", "40%"].forEach(function (largura, i) {
            var linha = el("span", "pub-linha");
            linha.style.width = largura;
            if (i === 2) linha.style.marginTop = "0.5rem";
            corpo.appendChild(linha);
        });
        card.appendChild(caixa);
        card.appendChild(corpo);
        item.appendChild(card);
        return item;
    }

    // ---------- Fluxo ----------
    var grade = el("ul", "pub-grade");
    var publicacoes = [];
    var mostradas = 0;

    function mostrarProximas(total) {
        var novas = publicacoes.slice(mostradas, mostradas + total).map(criarCartao);
        var pacote = document.createDocumentFragment();
        novas.forEach(function (item) { pacote.appendChild(item); });
        grade.appendChild(pacote);
        mostradas += novas.length;
        revelar(novas);

        var restam = mostradas < publicacoes.length;
        if (botaoMais) botaoMais.hidden = !passo || !restam;
        if (fim) fim.hidden = !passo || restam;
        return novas;
    }

    // Esqueleto enquanto carrega
    var esqueleto = el("ul", "pub-grade");
    for (var i = 0; i < quantidade; i++) esqueleto.appendChild(criarEsqueleto());
    raiz.setAttribute("aria-busy", "true");
    raiz.replaceChildren(esqueleto);
    anunciar("Carregando as publicações do Instagram.");

    buscarFeed()
        .then(function (dados) {
            publicacoes = lerFeed(dados);
            if (!publicacoes.length) throw new Error("Feed sem publicações");

            raiz.removeAttribute("aria-busy");
            raiz.replaceChildren(grade);
            mostrarProximas(quantidade);
            anunciar(mostradas + " publicações carregadas.");
        })
        .catch(function () {
            anunciar("");
            mostrarAviso();
        });

    if (botaoMais && passo) {
        botaoMais.addEventListener("click", function () {
            var novas = mostrarProximas(passo);
            if (!novas.length) return;
            anunciar("Mais " + novas.length + " publicações carregadas.");
            // Leva o foco para a primeira publicação nova, sem pular a tela.
            var primeiro = novas[0].querySelector("a");
            if (primeiro) primeiro.focus({ preventScroll: true });
        });
    }
})();
