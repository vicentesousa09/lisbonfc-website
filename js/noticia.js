const TAG_LABELS = {
  clube: "Clube",
  desafio: "Desafio",
  contratacao: "Contratação",
  gala: "Gala",
  "lisbon-fc-foundation": "Lisbon FC Foundation",
  comunicado: "Comunicado",
  solidariedade: "Solidariedade",
  programa: "Programa",
  sad: "SAD",
  reconquista: "Reconquista",
  "play-arena-belem": "Play Arena Belém",
  reforco: "Reforço",
};

const noticiasData = {
  "lisbon-fc-2-anos": {
    tag: "clube",
    title: "Lisbon FC celebra 2 anos de história",
    dateLabel: "Há 2 horas",
    lead: "A caminhar para o terceiro ano de existência, o Lisbon FC celebra dois anos de história desde a fundação por Vicente Sousa, Duarte Gomes e Alfredo Bidarra. Duas épocas depois, o clube já soma o troféu da Supertaça 2024 e prepara a defesa do título em 2026.",
    media: {
      type: "gallery",
      gallery: ["Logos/LogoBackground(Blue).png", "Logos/LogoBackground(Yellow).png", "Logos/Logo.png"],
    },
    relacionados: ["supertaca-2024-conquista", "antevisao-supertaca-2026", "nova-colecao-2-anos"],
  },

  "supertaca-2024-conquista": {
    tag: "reconquista",
    title: "Lisbon FC conquista a Supertaça 2024 frente ao Amadora FC",
    dateLabel: "Há 5 horas",
    lead: "Um triunfo por 4-2 sobre o Amadora FC que ficou para a história do clube. Com apenas cinco jogadores disponíveis, Duarte Gomes assinou contrato de jogador dias antes da final e ainda marcou um golo. Gonçalo Pereira bisou e Sánchez fechou a contagem no Play Arena Belém.",
    media: {
      type: "gallery",
      gallery: ["Logos/Supertaça/Supertaça_BlueLogo.png", "Logos/Logo.png", "Logos/LogoBackground(Blue).png"],
    },
    relacionados: ["golos-supertaca-2024", "festa-conquista-supertaca-2024", "antevisao-supertaca-2026"],
  },

  "antevisao-supertaca-2026": {
    tag: "desafio",
    title: "Antevisão: Lisbon FC defende o título da Supertaça frente ao Malandros FC",
    dateLabel: "Ontem",
    lead: "O Lisbon FC recebe o Malandros FC a 25 de outubro, no Play Arena Belém, para defender o título da Supertaça. O jogo estreia um novo formato, com duas partes de 30 minutos e 7 titulares por equipa, e marca a primeira vez de Daria Vinokurova ao comando técnico.",
    media: {
      type: "gallery",
      gallery: ["Logos/Equipa Visitante/MalandrosFC-cropped.png", "Logos/Logo.png", "Logos/LogoBackground(Blue).png"],
    },
    relacionados: ["novo-formato-supertaca-2026", "duarte-silva-perto-da-estreia", "supertaca-2024-conquista"],
  },

  "fundacao-novo-programa": {
    tag: "lisbon-fc-foundation",
    title: "Fundação Lisbon FC lança novo programa social",
    dateLabel: "Ontem",
    lead: "A Fundação Lisbon FC lançou um novo programa social para a época 26/27, dirigido a crianças e jovens da comunidade envolvente ao Play Arena Belém. A iniciativa inclui treinos orientados por jogadores do plantel, workshops de hábitos saudáveis e apoio ao estudo em parceria com escolas locais.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Lisbon FC Foundation/LisbonFCFoundation-Logo.jpg",
        "Logos/Lisbon FC Foundation/LisbonFCFoundation-LogoTransparent.png",
        "Logos/LogoBackground(Blue).png",
      ],
    },
    relacionados: ["fundacao-visita-escola", "fundacao-aniversario-programa", "dia-de-socio"],
  },

  "entrevista-vicente-sousa-pre-epoca": {
    tag: "desafio",
    title: "Entrevista: Vicente Sousa fala sobre a pré-época",
    dateLabel: "Há 1 dia",
    lead: "Em entrevista aos meios do clube, Vicente Sousa fez o balanço à pré-época, destacando a evolução do grupo rumo à Supertaça 2026. O guarda-redes e presidente-fundador falou também sobre o seu duplo papel no Lisbon FC e sobre a identidade que levou à fundação do clube em 2023.",
    media: { type: "video", crest: "Logos/Jogadores/cutout/vicente-sousa.png" },
    relacionados: ["resumo-abertura-2023", "antevisao-supertaca-2026", "lisbon-fc-2-anos"],
  },

  "resumo-abertura-2023": {
    tag: "desafio",
    title: "Resumo: Lisbon FC 4-4 no Jogo de Abertura 2023",
    dateLabel: "Há 1 dia",
    lead: "O Jogo de Abertura de 2023 marcou o arranque competitivo do Lisbon FC. Disputado a 1 de março, terminou empatado a 4-4 ao fim dos 40 minutos e só ficou decidido no desempate por grandes penalidades, perdido por 2-1. Ficou como o primeiro grande momento competitivo da história do clube.",
    media: { type: "video", crest: "Logos/Logo.png" },
    relacionados: ["entrevista-vicente-sousa-pre-epoca", "supertaca-2024-conquista", "alfredo-bidarra-renovacao"],
  },

  "alfredo-bidarra-renovacao": {
    tag: "contratacao",
    title: "Alfredo Bidarra renova contrato com o Lisbon FC",
    dateLabel: "Há 2 dias",
    lead: "O Lisbon FC anunciou a renovação de contrato de Alfredo Bidarra, um dos jogadores fundadores do plantel e peça-chave na conquista da Supertaça 2024, onde assistiu um dos golos da vitória sobre o Amadora FC. O defesa-central garante assim continuidade rumo à defesa do título em 2026.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Jogadores/raw/alfredo-bidarra-main.jpeg",
        "Logos/Jogadores/raw/alfredo-bidarra-secondary.jpeg",
        "Logos/Logo.png",
      ],
    },
    relacionados: ["supertaca-2024-conquista", "nova-campanha-socios", "martim-neves-em-grande-plano"],
  },

  "nova-campanha-socios": {
    tag: "sad",
    title: "Nova campanha de sócios para a época 26/27",
    dateLabel: "Há 2 dias",
    lead: "O Lisbon FC lançou a nova campanha de sócios para a época 2026/27, com condições especiais para quem se associar nas próximas semanas. Entre as vantagens estão descontos na loja oficial, acesso prioritário a eventos do clube e a possibilidade de acompanhar de perto a Supertaça 2026.",
    media: {
      type: "gallery",
      gallery: ["Logos/Logo_tranparent(blue).png", "Logos/LogoBackground(Blue).png", "Logos/LogoBackground(Yellow).png"],
    },
    relacionados: ["nova-colecao-2-anos", "camisola-principal-26-27", "dia-de-socio"],
  },

  "nova-colecao-2-anos": {
    tag: "comunicado",
    title: "Nova coleção 2 Anos já disponível na loja",
    dateLabel: "Há 3 dias",
    lead: "Para celebrar o segundo aniversário do Lisbon FC, a loja oficial lançou uma coleção especial com peças inspiradas na história recente do clube, incluindo referências à conquista da Supertaça 2024. Já está disponível online e nas lojas físicas junto ao Play Arena Belém.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Lisbon FC 2 Anos/Lisbon2Anos-Logo2.jpg",
        "Logos/Lisbon FC 2 Anos/Lisbon2Anos-Logo.jpg",
        "Logos/Loja/camisola-principal-1.png",
      ],
    },
    relacionados: ["lisbon-fc-2-anos", "camisola-principal-26-27", "nova-campanha-socios"],
  },

  "fundacao-visita-escola": {
    tag: "programa",
    title: "Lisbon FC visita escola local no âmbito do programa social",
    dateLabel: "Há 3 dias",
    lead: "No âmbito do programa social da Fundação Lisbon FC, um grupo de jogadores do plantel principal visitou uma escola local, participando em atividades desportivas com alunos do primeiro ciclo. A iniciativa deverá repetir-se ao longo da época para aproximar o clube da comunidade.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Lisbon FC Foundation/LisbonFCFoundation-Logo.jpg",
        "Logos/Jogadores/raw/martim-neves-main.jpeg",
        "Logos/Jogadores/raw/goncalo-rodrigues-main.jpeg",
        "Logos/Lisbon FC Foundation/LisbonFCFoundation-LogoTransparent.png",
        "Logos/Jogadores/raw/alfredo-bidarra-secondary.jpeg",
        "Logos/Jogadores/raw/duarte-silva-main.jpeg",
      ],
      galleryCaptions: [
        "Logótipo da Fundação Lisbon FC",
        "Martim Neves durante a visita à escola",
        "Gonçalo Rodrigues com os alunos do primeiro ciclo",
        "Programa social da Fundação Lisbon FC",
        "Alfredo Bidarra nas atividades desportivas",
        "Duarte Silva a interagir com os alunos",
      ],
    },
    relacionados: ["fundacao-novo-programa", "fundacao-aniversario-programa", "dia-de-socio"],
  },

  "daria-vinokurova-entrevista-objetivos": {
    tag: "comunicado",
    title: "Daria Vinokurova: \"Queremos lutar por todos os troféus\"",
    dateLabel: "Há 4 dias",
    lead: "A poucas semanas da Supertaça 2026, Daria Vinokurova falou sobre os objetivos do Lisbon FC para a época e sobre a adaptação da equipa ao novo formato de 30+30 minutos com 7 titulares. \"Queremos lutar por todos os troféus que aparecerem pela frente\", afirmou a treinadora.",
    media: { type: "video", crest: "Logos/Jogadores/raw/tecnica/daria-vinokurova-main.png" },
    relacionados: ["antevisao-supertaca-2026", "novo-formato-supertaca-2026", "duarte-silva-perto-da-estreia"],
  },

  "golos-supertaca-2024": {
    tag: "reconquista",
    title: "Golos: Lisbon FC 4-2 Amadora FC · Supertaça 2024",
    dateLabel: "Há 4 dias",
    lead: "Gonçalo Pereira abriu e bisou (3' e 9'), Duarte Gomes fez o terceiro aos 19' e Sánchez fechou a contagem aos 40', depois do Amadora FC ter reduzido por duas vezes com Xavier Ramos. Reveja os quatro golos que garantiram ao Lisbon FC a conquista da Supertaça 2024.",
    media: { type: "video", crest: "Logos/Logo.png" },
    relacionados: ["supertaca-2024-conquista", "goncalo-pereira-sanchez-supertaca-2024", "festa-conquista-supertaca-2024"],
  },

  "martim-neves-em-grande-plano": {
    tag: "desafio",
    title: "Martim Neves em grande plano nos treinos de preparação",
    dateLabel: "Há 5 dias",
    lead: "Ainda sem estreia oficial pelo Lisbon FC, Martim Neves tem impressionado a equipa técnica nos treinos de preparação para a Supertaça 2026. O médio é apontado como uma das possíveis novidades no onze de Daria Vinokurova frente ao Malandros FC, a 25 de outubro.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Jogadores/raw/martim-neves-main.jpeg",
        "Logos/Jogadores/raw/martim-neves-secondary.jpeg",
        "Logos/Logo.png",
      ],
    },
    relacionados: ["duarte-silva-perto-da-estreia", "antevisao-supertaca-2026", "alfredo-bidarra-renovacao"],
  },

  "estadio-renovacao-relvado": {
    tag: "play-arena-belem",
    title: "Estádio recebe obras de renovação do relvado",
    dateLabel: "Há 5 dias",
    lead: "O Play Arena Belém foi alvo de obras de renovação do relvado nas últimas semanas, garantindo as melhores condições de jogo para equipa e adeptos. Os trabalhos ficaram concluídos a tempo da defesa do título na Supertaça 2026, frente ao Malandros FC.",
    media: {
      type: "gallery",
      gallery: ["Logos/LogoBackground(Blue).png", "Logos/Logo.png", "Logos/LogoBackground(Yellow).png"],
    },
    relacionados: ["antevisao-supertaca-2026", "novo-formato-supertaca-2026", "camisola-principal-26-27"],
  },

  "camisola-principal-26-27": {
    tag: "comunicado",
    title: "Camisola principal 26/27 já à venda",
    dateLabel: "Há 6 dias",
    lead: "O Lisbon FC apresentou o novo equipamento principal para 2026/27, já disponível na loja online e nas lojas físicas junto ao Play Arena Belém. A camisola mantém as cores tradicionais do clube e deve vestir a equipa pela primeira vez em competição oficial na Supertaça 2026.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Loja/camisola-principal-1.png",
        "Logos/Loja/camisola-principal-2.png",
        "Logos/Loja/camisola-guarda-redes-1.png",
      ],
    },
    relacionados: ["nova-colecao-2-anos", "nova-campanha-socios", "estadio-renovacao-relvado"],
  },

  "duarte-silva-perto-da-estreia": {
    tag: "reforco",
    title: "Duarte Silva cada vez mais perto da estreia",
    dateLabel: "Há 6 dias",
    lead: "Duarte Silva ainda aguarda a oportunidade de se estrear oficialmente pelo Lisbon FC, mas essa oportunidade pode estar cada vez mais próxima. Com bom desempenho nos treinos, o médio é apontado como opção de Daria Vinokurova para a Supertaça 2026, frente ao Malandros FC.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Jogadores/raw/duarte-silva-main.jpeg",
        "Logos/Jogadores/raw/duarte-silva-secondary.jpeg",
        "Logos/Logo.png",
      ],
    },
    relacionados: ["martim-neves-em-grande-plano", "antevisao-supertaca-2026", "alfredo-bidarra-renovacao"],
  },

  "dia-de-socio": {
    tag: "solidariedade",
    title: "Dia de Sócio reúne centenas de adeptos no Estádio",
    dateLabel: "Há 1 semana",
    lead: "O Play Arena Belém recebeu mais uma edição do Dia de Sócio, com atividades para toda a família, insufláveis, animação e a oportunidade de conhecer de perto o plantel principal. A iniciativa reuniu centenas de adeptos e reforça o compromisso do clube com a comunidade.",
    media: {
      type: "gallery",
      gallery: ["Logos/LogoBackground(Blue).png", "Logos/LogoBackground(Yellow).png", "Logos/Logo.png"],
    },
    relacionados: ["fundacao-novo-programa", "nova-campanha-socios", "lisbon-fc-2-anos"],
  },

  "novo-formato-supertaca-2026": {
    tag: "comunicado",
    title: "Supertaça 2026 estreia novo formato de jogo",
    dateLabel: "Há 1 semana",
    lead: "A Supertaça 2026, entre Lisbon FC e Malandros FC, vai ter um formato inédito: duas partes de 30 minutos, com intervalo de 10, e 7 titulares por equipa em vez dos 5 habituais. O jogo está agendado para as 14h00 de domingo, 25 de outubro, no Play Arena Belém.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Supertaça/2Supertaça2026_Logo.png",
        "Logos/Supertaça/Supertaça_BlueLogo.png",
        "Logos/Supertaça/Supertaça_YellowLogo.png",
      ],
    },
    relacionados: ["antevisao-supertaca-2026", "daria-vinokurova-entrevista-objetivos", "estadio-renovacao-relvado"],
  },

  "goncalo-pereira-sanchez-supertaca-2024": {
    tag: "desafio",
    title: "Gonçalo Pereira e Sánchez: os rostos da conquista da Supertaça 2024",
    dateLabel: "Há 1 semana",
    lead: "Na conquista da Supertaça 2024, Gonçalo Pereira bisou (3' e 9') e Sánchez fechou a contagem aos 40', ambos assistidos por Duarte Gomes e Alfredo Bidarra. Uma exibição que consagrou a dupla de ataque como peças fundamentais na vitória por 4-2 sobre o Amadora FC.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Jogadores/raw/goncalo-pereira-main.jpeg",
        "Logos/Jogadores/raw/eduardo-sanchez-main.jpeg",
        "Logos/Jogadores/raw/goncalo-pereira-secondary.jpeg",
      ],
    },
    relacionados: ["golos-supertaca-2024", "supertaca-2024-conquista", "festa-conquista-supertaca-2024"],
  },

  "festa-conquista-supertaca-2024": {
    tag: "reconquista",
    title: "Em imagens: a festa da conquista da Supertaça 2024",
    dateLabel: "Há 1 semana",
    lead: "Depois do apito final no Play Arena Belém, jogadores e equipa técnica festejaram a conquista da Supertaça 2024, o primeiro grande troféu da história do Lisbon FC. Reveja em imagens os melhores momentos da noite, da festa em campo à entrega da taça à equipa.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Supertaça/Supertaça_BlueLogo.png",
        "Logos/Jogadores/raw/eduardo-sanchez-secondary.jpeg",
        "Logos/Jogadores/raw/goncalo-pereira-secondary.jpeg",
        "Logos/Jogadores/raw/goncalo-rodrigues-main.jpeg",
        "Logos/Jogadores/raw/martim-neves-secondary.jpeg",
        "Logos/Jogadores/raw/duarte-silva-secondary.jpeg",
      ],
    },
    relacionados: ["supertaca-2024-conquista", "golos-supertaca-2024", "goncalo-pereira-sanchez-supertaca-2024"],
  },

  "fundacao-aniversario-programa": {
    tag: "lisbon-fc-foundation",
    title: "Fundação Lisbon FC celebra primeiro aniversário de programa social",
    dateLabel: "Há 2 semanas",
    lead: "A Fundação Lisbon FC celebrou o primeiro aniversário de um dos seus programas sociais, que já levou atividades desportivas e educativas a centenas de crianças da comunidade envolvente ao Play Arena Belém, com a participação regular de jogadores do plantel principal.",
    media: {
      type: "gallery",
      gallery: [
        "Logos/Lisbon FC Foundation/LisbonFCFoundation-LogoTransparent.png",
        "Logos/Lisbon FC Foundation/LisbonFCFoundation-Logo.jpg",
        "Logos/LogoBackground(Blue).png",
      ],
    },
    relacionados: ["fundacao-novo-programa", "fundacao-visita-escola", "dia-de-socio"],
  },

  "sub15-estreia-vitoria": {
    tag: "desafio",
    title: "Sub-15 conquista vitória confortável na estreia",
    dateLabel: "Há 2 semanas",
    lead: "A formação de sub-15 do Lisbon FC estreou-se na nova época com uma vitória confortável, num jogo dominado do início ao fim. O resultado é um bom indicador para o trabalho feito na formação do clube, à procura de preparar os futuros valores do plantel principal.",
    media: {
      type: "gallery",
      gallery: ["Logos/LogoBackground(Yellow).png", "Logos/Logo.png", "Logos/LogoBackground(Blue).png"],
    },
    relacionados: ["fundacao-visita-escola", "feminina-estreia-vitoria", "lisbon-fc-2-anos"],
  },

  "feminina-estreia-vitoria": {
    tag: "desafio",
    title: "Equipa feminina estreia-se na nova época com vitória",
    dateLabel: "Há 2 semanas",
    lead: "A equipa feminina do Lisbon FC venceu o primeiro jogo da nova época, um resultado que deixa boas indicações para os objetivos da temporada. A secção feminina do clube tem vindo a crescer nos últimos meses, com a chegada de novas atletas ao plantel.",
    media: {
      type: "gallery",
      gallery: ["Logos/LogoBackground(Blue).png", "Logos/LogoBackground(Yellow).png", "Logos/Logo.png"],
    },
    relacionados: ["sub15-estreia-vitoria", "lisbon-fc-2-anos", "dia-de-socio"],
  },
};

const requestedNoticia = new URLSearchParams(window.location.search).get("noticia");
const activeSlug = noticiasData[requestedNoticia] ? requestedNoticia : "supertaca-2024-conquista";
const noticia = noticiasData[activeSlug];

function renderNoticia() {
  document.title = `${noticia.title} | Lisbon FC`;

  const tagLabel = TAG_LABELS[noticia.tag] || noticia.tag;
  document.querySelectorAll("[data-noticia-tag]").forEach((el) => { el.textContent = tagLabel; });
  document.querySelectorAll("[data-noticia-title]").forEach((el) => { el.textContent = noticia.title; });
  document.querySelectorAll("[data-noticia-date]").forEach((el) => { el.textContent = noticia.dateLabel; });

  const leadEl = document.getElementById("noticiaLead");
  if (leadEl) leadEl.textContent = noticia.lead;

  const mediaEl = document.getElementById("noticiaMedia");
  if (mediaEl) {
    mediaEl.innerHTML = "";
    const media = noticia.media;
    mediaEl.classList.toggle("noticia-media--gallery", media.type === "gallery");

    if (media.type === "gallery") {
      const grid = document.createElement("div");
      grid.className = "noticia-gallery";
      media.gallery.forEach((src) => {
        const item = document.createElement("div");
        item.className = "noticia-gallery-item";
        const img = document.createElement("div");
        img.className = "noticia-gallery-img";
        img.style.backgroundImage = `url('${src}')`;
        item.appendChild(img);
        item.addEventListener("click", () => openLightbox(media.gallery, media.gallery.indexOf(src), media.galleryCaptions));
        grid.appendChild(item);
      });
      mediaEl.appendChild(grid);
    } else if (media.type === "video") {
      mediaEl.appendChild(buildVideoPlayer(media));
    } else {
      const hero = document.createElement("div");
      hero.className = "noticia-hero-image";
      hero.style.backgroundImage = `url('${media.image}')`;
      if (media.contain) {
        hero.style.backgroundSize = "contain";
        hero.style.backgroundColor = media.bg || "#fff";
      }
      mediaEl.appendChild(hero);
    }
  }

  const relatedEl = document.getElementById("noticiaRelacionados");
  if (relatedEl && noticia.relacionados) {
    relatedEl.innerHTML = "";
    noticia.relacionados
      .filter((slug) => noticiasData[slug])
      .forEach((slug) => {
        const related = noticiasData[slug];
        const card = document.createElement("a");
        card.className = "news-card";
        card.href = `noticia?noticia=${slug}`;

        const media = related.media;
        const bgImage = media.type === "gallery" ? media.gallery[0] : media.type === "video" ? media.crest : media.image;
        const bgStyle = `background-image:url('${bgImage}');background-size:cover;background-position:center;`;

        card.innerHTML = `
          <div class="news-image"><div class="news-media" style="${bgStyle}"></div></div>
          <span class="news-tag">${TAG_LABELS[related.tag] || related.tag}</span>
          <h3>${related.title}</h3>
          <p>${related.lead}</p>
          <span class="news-date">${related.dateLabel}</span>
        `;
        relatedEl.appendChild(card);
      });
  }
}

renderNoticia();
