# 🚀 WOM Advogados — Site Institucional

Site institucional do escritório **WOM Advogados (Dr. Wesley Oliveira Melo)**, de Votuporanga-SP, publicado em [womadv.com](https://womadv.com).

Projeto desenvolvido com foco em design moderno, responsividade e experiência do usuário, apresentando uma interface limpa, elegante e otimizada para diferentes dispositivos.

## 📌 Sobre o Projeto

Este projeto foi criado com o objetivo de demonstrar habilidades em desenvolvimento web, organização visual e construção de interfaces modernas.

A aplicação possui:

- Layout responsivo
- Interface moderna e intuitiva
- Estrutura organizada
- Navegação fluida
- Componentes reutilizáveis
- Design otimizado para desktop e mobile

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- TailwindCSS
- Git & GitHub

## 🎨 Funcionalidades

- ✅ Navbar responsiva
- ✅ Seções organizadas
- ✅ Efeitos visuais suaves
- ✅ Hover animations
- ✅ Favicon personalizado
- ✅ Botão flutuante do WhatsApp
- ✅ Ano automático no rodapé
- ✅ SEO e Open Graph (preview em redes sociais)

## 📱 Responsividade

O projeto foi desenvolvido pensando em diferentes tamanhos de tela:

- Desktop
- Tablet
- Smartphone

## 📂 Estrutura do Projeto

```text
📦 Teste-1-
 ┣ 📂 assets
 ┃ ┗ 📂 imagens
 ┃   ┣ 📜 logo.png
 ┃   ┗ 📜 fotopai.jpg
 ┣ 📂 src
 ┃ ┗ 📜 input.css      (entrada do Tailwind)
 ┣ 📜 index.html
 ┣ 📜 tailwind.css      (CSS gerado — não editar à mão)
 ┣ 📜 tailwind.config.js
 ┣ 📜 style.css
 ┣ 📜 script.js
 ┣ 📜 site.webmanifest
 ┣ 📜 favicon.ico / favicon.svg / favicon-96x96.png
 ┣ 📜 apple-touch-icon.png
 ┣ 📜 web-app-manifest-192x192.png / 512x512.png
 ┣ 📜 CNAME
 ┗ 📜 README.md
```

## ⚙️ Gerando o CSS do Tailwind

O Tailwind é compilado (não usa mais o CDN). Sempre que adicionar ou mudar classes no `index.html`, gere o CSS de novo:

```bash
npx tailwindcss@3 -c tailwind.config.js -i src/input.css -o tailwind.css --minify
```

Sem Node, dá para usar o [binário standalone do Tailwind CLI v3](https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17) com os mesmos parâmetros.

## 👨‍💻 Autor

Desenvolvido por Guilherme Melo.
