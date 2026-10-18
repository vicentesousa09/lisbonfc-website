const matchesData = {
  "abertura-2023": {
    opponentName: "Equipa Adversária",
    opponentBadge: "",
    competition: "Jogo de Abertura",
    dateLabel: "Qua, 01 Mar 2023",
    timeLabel: "18h00",
    hasLineups: true,
    isPast: true,
    isHome: true,
    regulationMinutes: 40,
    scoreOpponent: 4,
    scoreLisbon: 4,
    shootout: {
      lisbonScore: 1,
      opponentScore: 2,
      kicks: [
        { team: "lisbon", player: "Sánchez", photo: "Logos/Jogadores/cutout/eduardo-sanchez.png", result: "miss", description: "Sánchez abriu a marcação de grandes penalidades, mas o guarda-redes adversário adivinhou o canto e defendeu, deixando o Lisbon FC em desvantagem logo de início." },
        { team: "opponent", player: "Jogador 9", result: "goal", description: "A equipa adversária não desperdiçou e converteu a sua primeira tentativa." },
        { team: "lisbon", player: "Gonçalo Rodrigues", photo: "Logos/Jogadores/cutout/goncalo-rodrigues.png", result: "goal", description: "Rodrigues não hesitou, correu para a bola e converteu com autoridade, repondo a igualdade." },
        { team: "opponent", player: "Santiago", result: "goal", description: "Santiago colocou a bola no canto superior esquerdo com uma grande penalidade fantástica, sem qualquer hipótese para Vicente Sousa." },
        { team: "lisbon", player: "Gonçalo Pereira", photo: "Logos/Jogadores/cutout/goncalo-pereira.png", result: "miss", description: "Pereira rematou, mas a bola saiu junto ao poste esquerdo, desperdiçando a oportunidade de igualar." },
        { team: "opponent", player: "Jogador 8", result: "miss", description: "O remate saiu em direção ao meio da baliza e Vicente Sousa defendeu, mantendo o Lisbon FC na luta." },
        { team: "lisbon", player: "Alfredo Bidarra", photo: "Logos/Jogadores/cutout/alfredo-bidarra.png", result: "miss", description: "Bidarra rematou ao centro, mas o guarda-redes adversário defendeu sem grande dificuldade." },
        { team: "opponent", player: "Jogador 6", result: "miss", description: "Numa penalidade crucial, o remate foi para o canto superior direito, mas Vicente Sousa voou para fazer uma defesa soberba e manter viva a esperança do Lisbon FC." },
        { team: "lisbon", player: "Sánchez", photo: "Logos/Jogadores/cutout/eduardo-sanchez.png", result: "miss", description: "Sem mais jogadores disponíveis, Sánchez voltou a bater, mas rematou ao meio e falhou, selando a vitória da equipa adversária por 2-1 nas grandes penalidades." },
      ],
    },
    events: [
      {
        minute: 2,
        type: "goal",
        team: "lisbon",
        player: "Sánchez",
        photo: "Logos/Jogadores/cutout/eduardo-sanchez.png",
        assist: "Gonçalo Rodrigues",
        description: "Logo aos 2 minutos do primeiro jogo oficial do clube, Rodrigues cruzou para o poste mais afastado e Sánchez, de joelho, desviou para o fundo da baliza, adiantando o Lisbon FC.",
      },
      {
        minute: 11,
        type: "goal",
        team: "lisbon",
        player: "Sánchez",
        photo: "Logos/Jogadores/cutout/eduardo-sanchez.png",
        assist: "Gonçalo Pereira",
        description: "Gonçalo Pereira serviu com um passe rasteiro dentro da área e Sánchez apenas teve de encostar para o fundo das redes, bisando na tarde e fazendo o 2-0.",
      },
      { minute: 13, type: "goal", team: "opponent", player: "Jogador 9", description: "A equipa adversária respondeu com um passe em profundidade para o avançado, que finalizou sem hipóteses para Vicente Sousa." },
      { minute: 14, type: "goal", team: "opponent", player: "Jogador 6", description: "Um minuto depois, uma perda de bola de Rodrigues no meio-campo permitiu à equipa adversária um simples passe rasteiro para empatar a partida em 2-2." },
      { minute: 20, type: "goal", team: "opponent", player: "Jogador 8", description: "Após um alívio de Vicente Sousa, a equipa adversária recuperou a bola, combinou entre vários jogadores e, com um passe em profundidade, rematou para o canto inferior esquerdo, adiantando-se pela primeira vez na tarde." },
      { minute: 20, type: "yellow", team: "opponent", player: "Jogador 6", description: "Ainda no reatamento do jogo após o golo, este jogador provocou Sánchez ao tocar na bola antes do pontapé de saída, sendo amarelado pelo árbitro Tomé Beles." },
      {
        minute: 22,
        type: "goal",
        team: "lisbon",
        player: "Sánchez",
        photo: "Logos/Jogadores/cutout/eduardo-sanchez.png",
        description: "Logo após o intervalo, uma mão na bola da equipa adversária perto da grande área resultou num livre perigoso. Sánchez rematou para o canto inferior esquerdo e fez o 3-3.",
      },
      { minute: 37, type: "goal", team: "opponent", player: "Jogador 9", description: "Um longo lançamento lateral chegou à grande área e encontrou este jogador completamente isolado, que rematou de primeira em pleno voo para fazer o 3-4." },
      {
        minute: 40,
        type: "goal",
        team: "lisbon",
        player: "Sánchez",
        photo: "Logos/Jogadores/cutout/eduardo-sanchez.png",
        description: "Já no último minuto do jogo de abertura, Sánchez sofreu falta exatamente no mesmo local do livre da segunda parte e apontou o quarto golo pessoal, empatando a partida em 4-4 e completando o poker.",
      },
    ],
  },
  "amistoso-mar-2023": {
    opponentName: "Equipa Adversária",
    opponentBadge: "",
    competition: "Jogo Amigável",
    dateLabel: "Qua, 15 Mar 2023",
    timeLabel: "18h00",
    hasLineups: true,
    isPast: true,
    isHome: true,
    regulationMinutes: 40,
    scoreOpponent: 3,
    scoreLisbon: 3,
    events: [
      { minute: 6, type: "goal", team: "opponent", player: "Jogador 9", description: "A equipa adversária abriu o marcador logo aos 6 minutos, com um remate de fora da área sem hipóteses para Vicente Sousa." },
      {
        minute: 7,
        type: "goal",
        team: "lisbon",
        player: "Gonçalo Rodrigues",
        photo: "Logos/Jogadores/cutout/goncalo-rodrigues.png",
        description: "Na sequência de um canto, Sánchez recebeu o cruzamento e tentou rematar, mas viu o remate bloqueado. Rodrigues aproveitou o ressalto para empatar a partida.",
      },
      { minute: 8, type: "goal", team: "opponent", player: "Jogador 11", description: "Logo no pontapé de saída que se seguiu ao golo, o avançado adversário viu Vicente Sousa adiantado e rematou em arco desde o meio-campo, surpreendendo o guarda-redes." },
      {
        minute: 16,
        type: "goal",
        team: "lisbon",
        player: "Sánchez",
        photo: "Logos/Jogadores/cutout/eduardo-sanchez.png",
        assist: "Alfredo Bidarra",
        description: "Alfredo Bidarra serviu um passe em profundidade primoroso para Sánchez, que fez um túnel ao guarda-redes antes de rematar para o fundo da baliza, num golo fantástico.",
      },
      { minute: 29, type: "goal", team: "opponent", player: "Jogador 7", description: "A equipa adversária voltou a colocar-se em vantagem com um remate bem colocado ao poste esquerdo, sem hipóteses para Vicente Sousa." },
      {
        minute: 29,
        type: "substitution",
        team: "lisbon",
        playerOut: { name: "Gonçalo Pereira", position: "Avançado", photo: "Logos/Jogadores/cutout/goncalo-pereira.png" },
        playerIn: { name: "Gabriel Santos", position: "Médio", photo: "Logos/Jogadores/cutout/gabriel-santos.png" },
      },
      {
        minute: 36,
        type: "goal",
        team: "lisbon",
        player: "Gonçalo Rodrigues",
        photo: "Logos/Jogadores/cutout/goncalo-rodrigues.png",
        assist: "Sánchez",
        description: "Sánchez serviu Rodrigues à entrada da área, que rematou de primeira, em pleno voo, para o fundo da baliza, completando o seu bis e fechando o resultado em 3-3.",
      },
    ],
  },
  "amistoso-mai-2023": {
    opponentName: "Equipa Adversária",
    opponentBadge: "",
    competition: "Jogo Amigável",
    dateLabel: "Qua, 03 Mai 2023",
    timeLabel: "18h00",
    hasLineups: true,
    isPast: true,
    isHome: true,
    venueName: "Antigo Lisbon FC CT",
    regulationMinutes: 40,
    scoreOpponent: 7,
    scoreLisbon: 2,
    events: [
      { minute: 2, type: "goal", team: "opponent", player: "Jogador 7", description: "Alfredo Bidarra cometeu uma mão na bola perto da área e a equipa visitante não perdoou, marcando o livre direto no canto inferior esquerdo da baliza." },
      { minute: 3, type: "goal", team: "opponent", player: "Ricardo Fialho", description: "Na sequência de um canto, a equipa visitante construiu uma jogada coletiva e Ricardo Fialho, depois de driblar vários defesas, bateu Vicente Sousa." },
      { minute: 4, type: "substitution", team: "lisbon", playerOut: { name: "Alfredo Bidarra", position: "Defesa", photo: "Logos/Jogadores/cutout/alfredo-bidarra.png" }, playerIn: { name: "Gonçalo Pereira", position: "Avançado", photo: "Logos/Jogadores/cutout/goncalo-pereira.png" } },
      { minute: 11, type: "goal", team: "opponent", player: "Miguel Ladeira", description: "Na sequência de um cruzamento para a área, Miguel Ladeira cabeceou para o fundo da baliza, ampliando a vantagem da equipa visitante." },
      { minute: 11, type: "substitution", team: "lisbon", playerOut: { name: "Gabriel Santos", position: "Médio", photo: "Logos/Jogadores/cutout/gabriel-santos.png" }, playerIn: { name: "Alfredo Bidarra", position: "Defesa", photo: "Logos/Jogadores/cutout/alfredo-bidarra.png" } },
      { minute: 17, type: "goal", team: "opponent", player: "Ricardo Fialho", description: "Ricardo Fialho voltou a driblar a defesa do Lisbon FC de forma isolada antes de finalizar para o fundo da baliza." },
      { minute: 27, type: "goal", team: "opponent", player: "Jogador 11", description: "Mais um cruzamento para a área e mais um cabeceamento certeiro da equipa visitante, que ampliou a vantagem." },
      { minute: 30, type: "substitution", team: "lisbon", playerOut: { name: "Alfredo Bidarra", position: "Defesa", photo: "Logos/Jogadores/cutout/alfredo-bidarra.png" }, playerIn: { name: "Gabriel Santos", position: "Médio", photo: "Logos/Jogadores/cutout/gabriel-santos.png" } },
      { minute: 32, type: "goal", team: "opponent", player: "Jogador 7", description: "Um erro na saída de bola da defesa do Lisbon FC ofereceu a bola à equipa visitante, que não perdoou." },
      {
        minute: 37,
        type: "goal",
        team: "lisbon",
        player: "Gonçalo Pereira",
        photo: "Logos/Jogadores/cutout/goncalo-pereira.png",
        assist: "Sánchez",
        description: "Sánchez fez a mudança de ala e Rodrigues simulou o remate, deixando a bola seguir para Gonçalo Pereira, que a rematou de primeira para reduzir a desvantagem.",
      },
      { minute: 39, type: "goal", team: "opponent", player: "Miguel Ladeira", description: "Um cruzamento rasteiro ao segundo poste apanhou a defesa mal posicionada; Vicente Sousa tentou o corte mas chegou tarde, sofrendo o golo que fez o 1-7." },
      {
        minute: 40,
        type: "goal",
        team: "lisbon",
        player: "Gonçalo Rodrigues",
        photo: "Logos/Jogadores/cutout/goncalo-rodrigues.png",
        assist: "Gonçalo Pereira",
        description: "Já no último minuto, Gonçalo Pereira assistiu Rodrigues, que rematou com muita força para reduzir a diferença para o resultado final.",
      },
    ],
  },
  "supertaca-2024": {
    opponentName: "Amadora FC",
    opponentBadge: "",
    competition: "Supertaça 2024",
    dateLabel: "Sex, 24 Mai 2024",
    timeLabel: "19h00",
    hasLineups: true,
    isPast: true,
    isHome: true,
    regulationMinutes: 40,
    scoreOpponent: 2,
    scoreLisbon: 4,
    events: [
      {
        minute: 3,
        type: "goal",
        team: "lisbon",
        player: "Gonçalo Pereira",
        photo: "Logos/Jogadores/cutout/goncalo-pereira.png",
        assist: "Duarte Gomes",
        description: "Ainda no arranque da final, Gonçalo Pereira roubou a bola à equipa que atacava e combinou com Duarte Gomes, que serviu um passe em profundidade decisivo. Pereira ficou isolado frente ao guarda-redes e faturou de pé esquerdo.",
      },
      {
        minute: 9,
        type: "goal",
        team: "lisbon",
        player: "Gonçalo Pereira",
        photo: "Logos/Jogadores/cutout/goncalo-pereira.png",
        assist: "Alfredo Bidarra",
        description: "Alfredo Bidarra encontrou Gonçalo Pereira a cortar para dentro pela direita, com um passe em profundidade. Pereira, de primeira e de pé esquerdo, mudou a direção da bola para bisar e colocar o Lisbon FC a vencer por 2-0.",
      },
      {
        minute: 19,
        type: "goal",
        team: "lisbon",
        player: "Duarte Gomes",
        assist: "Gonçalo Pereira",
        description: "Sánchez serviu Gonçalo Pereira para distribuir o jogo, e Duarte Gomes apareceu na ala esquerda para receber o passe do avançado. Numa jogada individual notável, Duarte deixou o defesa da Amadora FC para trás e rematou de fora da área, batendo Ricardo no canto inferior esquerdo.",
      },
      {
        minute: 35,
        type: "goal",
        team: "opponent",
        player: "Xavier Ramos",
        description: "Já na segunda parte, a Amadora FC chegou ao golo em contra-ataque: Santiago serviu Xavier Ramos, que encontrou um espaço e rematou colocado, superando Vicente Sousa.",
      },
      {
        minute: 37,
        type: "goal",
        team: "opponent",
        player: "Xavier Ramos",
        description: "Alfredo Bidarra tentou roubar a bola a Xavier Ramos, que procurava espaço para rematar, mas o avançado da Amadora FC acabou por concluir na mesma, sem que Vicente Sousa conseguisse sequer reagir.",
      },
      {
        minute: 40,
        type: "goal",
        team: "lisbon",
        player: "Sánchez",
        photo: "Logos/Jogadores/cutout/eduardo-sanchez.png",
        assist: "Duarte Gomes",
        description: "No último minuto, com a Amadora FC lançada em busca do empate, Duarte Gomes travou o ataque e serviu um passe em profundidade para Sánchez. Com Ricardo longe da baliza, Sánchez rematou de longe para fechar a contagem e confirmar o primeiro título da história do Lisbon FC.",
      },
    ],
  },
  "supertaca-2026": {
    opponentName: "Malandros FC",
    opponentBadge: "MFC",
    opponentLogo: "Logos/Equipa Visitante/MalandrosFC-cropped.png",
    competition: "Supertaça 2026",
    dateLabel: "Dom, 25 Out 2026",
    timeLabel: "14h00",
    hasLineups: true,
    isHome: true,
    regulationMinutes: 60,
    // Countdown is only meaningful in the final 24h before kickoff. Re-enable
    // (remove this flag, or set it to true) once the match is within a day away.
    showCountdown: false,
  },
};

const requestedMatch = new URLSearchParams(window.location.search).get("match");
const activeMatchId = matchesData[requestedMatch] ? requestedMatch : "supertaca-2026";
const activeMatch = matchesData[activeMatchId];

const heroOpponentName = document.getElementById("heroOpponentName");
const heroOpponentBadge = document.getElementById("heroOpponentBadge");
const heroOpponentWatermark = document.getElementById("heroOpponentWatermark");
const heroLisbonWatermark = document.getElementById("heroLisbonWatermark");
const heroComp = document.getElementById("heroComp");
const heroDate = document.getElementById("heroDate");
const heroTime = document.getElementById("heroTime");
const stickyOpponentName = document.getElementById("stickyOpponentName");
const stickyOpponentBadge = document.getElementById("stickyOpponentBadge");
const stickyDate = document.getElementById("stickyDate");
const stickyTime = document.getElementById("stickyTime");
const mcHeroFlip = document.getElementById("mcHeroFlip");
const mcHeroResult = document.getElementById("mcHeroResult");
const heroScoreOpponent = document.getElementById("heroScoreOpponent");
const heroScoreLisbon = document.getElementById("heroScoreLisbon");
const mcStickyCenter = document.getElementById("mcStickyCenter");
const mcStickyResult = document.getElementById("mcStickyResult");
const stickyScoreFirst = document.getElementById("stickyScoreFirst");
const stickyScoreSecond = document.getElementById("stickyScoreSecond");
const mcMatchTimeline = document.getElementById("mcMatchTimeline");
const mcTimelineAxis = document.getElementById("mcTimelineAxis");
const mcTimelineTrack = document.getElementById("mcTimelineTrack");

if (heroOpponentName) heroOpponentName.textContent = activeMatch.opponentName;
if (heroOpponentBadge) heroOpponentBadge.textContent = activeMatch.opponentBadge;
if (heroOpponentWatermark) heroOpponentWatermark.textContent = activeMatch.opponentBadge;
const timelineOpponentIcon = document.getElementById("timelineOpponentIcon");
if (timelineOpponentIcon) timelineOpponentIcon.textContent = activeMatch.opponentBadge;
if (heroComp) heroComp.textContent = activeMatch.competition;
const infoCompetitionLabel = document.getElementById("infoCompetitionLabel");
if (infoCompetitionLabel) infoCompetitionLabel.textContent = activeMatch.competition.split(" · ")[0];

if (activeMatch.venueName) {
  const infoVenueName = document.getElementById("infoVenueName");
  const infoVenueLocation = document.getElementById("infoVenueLocation");
  const mcVenueApps = document.getElementById("mcVenueApps");
  const mcVenuePhoto = document.getElementById("mcVenuePhoto");
  if (infoVenueName) infoVenueName.textContent = activeMatch.venueName;
  if (infoVenueLocation) infoVenueLocation.textContent = activeMatch.venueLocation || "Lisboa, Portugal";
  if (mcVenueApps) mcVenueApps.hidden = true;
  if (mcVenuePhoto) mcVenuePhoto.hidden = true;
}
if (heroDate) heroDate.textContent = activeMatch.dateLabel;
if (heroTime) heroTime.textContent = activeMatch.timeLabel;
if (stickyOpponentName) stickyOpponentName.textContent = activeMatch.opponentName;
if (stickyOpponentBadge) stickyOpponentBadge.textContent = activeMatch.opponentBadge;
if (stickyDate) stickyDate.textContent = activeMatch.dateLabel;
if (stickyTime) stickyTime.textContent = activeMatch.timeLabel;

if (activeMatch.opponentLogo) {
  [heroOpponentBadge, stickyOpponentBadge].forEach((badge) => {
    if (!badge) return;
    const img = document.createElement("img");
    img.src = activeMatch.opponentLogo;
    img.alt = activeMatch.opponentName;
    img.id = badge.id;
    badge.replaceWith(img);
  });
}

const mcHeroRow = document.querySelector(".mc-hero-row");
const mcStickyHeaderInner = document.querySelector(".mc-sticky-header-inner");
const mcStickyHeaderEl = document.querySelector(".mc-sticky-header");
if (activeMatch.isHome) {
  if (mcHeroRow) mcHeroRow.classList.add("mc-hero-row--home-first");
  if (mcStickyHeaderInner) mcStickyHeaderInner.classList.add("mc-sticky-header-inner--home-first");
  if (mcStickyHeaderEl) mcStickyHeaderEl.classList.add("mc-sticky-header--home-first");
  if (mcTimelineAxis) mcTimelineAxis.classList.add("mc-timeline-axis--home-first");
}

if (activeMatch.isPast) {
  if (mcHeroFlip) mcHeroFlip.hidden = true;
  if (mcHeroResult) mcHeroResult.hidden = false;
  const firstScore = activeMatch.isHome ? activeMatch.scoreLisbon : activeMatch.scoreOpponent;
  const secondScore = activeMatch.isHome ? activeMatch.scoreOpponent : activeMatch.scoreLisbon;
  if (heroScoreOpponent) heroScoreOpponent.textContent = firstScore;
  if (heroScoreLisbon) heroScoreLisbon.textContent = secondScore;

  if (mcStickyCenter) mcStickyCenter.hidden = true;
  if (mcStickyResult) mcStickyResult.hidden = false;
  if (stickyScoreFirst) stickyScoreFirst.textContent = firstScore;
  if (stickyScoreSecond) stickyScoreSecond.textContent = secondScore;

  if (mcMatchTimeline) mcMatchTimeline.hidden = false;

  document.querySelectorAll(".mc-roster-events").forEach((el) => { el.hidden = false; });

  const heroOpponentScorers = document.getElementById("heroOpponentScorers");
  const heroLisbonScorers = document.getElementById("heroLisbonScorers");

  function renderScorers(container, events) {
    if (!container) return;
    const scorers = events
      .filter((event) => event.type === "goal" || event.type === "goal-penalty")
      .sort((a, b) => a.minute - b.minute);
    scorers.forEach((event) => {
      const line = document.createElement("span");
      line.className = "mc-hero-scorer-line";
      const penaltyTag = event.type === "goal-penalty" ? " (g.p.)" : "";
      const ownGoalTag = event.ownGoal ? " (autogolo)" : "";
      line.innerHTML = `<span class="mc-hero-scorer-minute">${event.minute}'</span> <span class="mc-hero-scorer-name">${event.player}${penaltyTag}${ownGoalTag}</span>`;
      container.appendChild(line);
    });
  }

  if (Array.isArray(activeMatch.events)) {
    renderScorers(heroOpponentScorers, activeMatch.events.filter((e) => e.team === "opponent"));
    renderScorers(heroLisbonScorers, activeMatch.events.filter((e) => e.team === "lisbon"));
  }

  const EVENT_ICONS = {
    goal: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="var(--ink)" stroke-width="1.4"/><path d="M12 7.8L8 10.7L9.5 15.4L14.5 15.4L16 10.7Z" fill="var(--ink)"/><path d="M12 3v4.8M3.4 9.2l4.6 1.5M20.6 9.2l-4.6 1.5M6.7 19.3l2.8-3.9M17.3 19.3l-2.8-3.9" stroke="var(--ink)" stroke-width="1" stroke-linecap="round"/></svg>',
    "goal-penalty": '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="var(--ink)" stroke-width="1.4"/><path d="M12 7.8L8 10.7L9.5 15.4L14.5 15.4L16 10.7Z" fill="var(--ink)"/><path d="M12 3v4.8M3.4 9.2l4.6 1.5M20.6 9.2l-4.6 1.5M6.7 19.3l2.8-3.9M17.3 19.3l-2.8-3.9" stroke="var(--ink)" stroke-width="1" stroke-linecap="round"/></svg>',
    yellow: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="1.5" fill="#F0C419"/></svg>',
    red: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="1.5" fill="#E24949"/></svg>',
    substitution: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20V10M8 20l-3.2-3.2M8 20l3.2-3.2" stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 4v10M16 4l-3.2 3.2M16 4l3.2 3.2" stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const ALLOWED_TIMELINE_TYPES = ["goal", "goal-penalty", "yellow", "red", "substitution"];

  function initials(name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase();
  }

  function lastName(name) {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1];
  }

  function getRunningScoreAfter(targetEvent) {
    if (!Array.isArray(activeMatch.events)) return "";
    const goals = activeMatch.events
      .filter((e) => e.type === "goal" || e.type === "goal-penalty")
      .slice()
      .sort((a, b) => a.minute - b.minute);
    let opp = 0;
    let lis = 0;
    for (const g of goals) {
      if (g.team === "lisbon") lis += 1;
      else opp += 1;
      if (g === targetEvent) break;
    }
    return `${opp}-${lis}`;
  }

  function buildPopupContent(event) {
    const minuteLabel = `${event.minute}'`;
    if (event.type === "substitution") {
      const teamName = event.team === "lisbon" ? "Lisbon FC" : activeMatch.opponentName;
      const inPhoto = event.playerIn.photo
        ? `<img class="mc-timeline-popup-photo" src="${event.playerIn.photo}" alt="">`
        : `<span class="mc-timeline-popup-avatar">${initials(event.playerIn.name)}</span>`;
      const outPhoto = event.playerOut.photo
        ? `<img class="mc-timeline-popup-photo" src="${event.playerOut.photo}" alt="">`
        : `<span class="mc-timeline-popup-avatar">${initials(event.playerOut.name)}</span>`;
      const arrowIn = '<span class="mc-timeline-popup-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="4" x2="12" y2="17" stroke="#2E9E4F" stroke-width="2.4" stroke-linecap="round"/><path d="M7 12l5 6 5-6" fill="none" stroke="#2E9E4F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
      const arrowOut = '<span class="mc-timeline-popup-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="20" x2="12" y2="7" stroke="#E24949" stroke-width="2.4" stroke-linecap="round"/><path d="M7 12l5-6 5 6" fill="none" stroke="#E24949" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
      const titleClass = event.team === "lisbon" ? "mc-timeline-popup-title--home" : "mc-timeline-popup-title--away";
      return `
        <strong class="mc-timeline-popup-title ${titleClass}">${minuteLabel} Substituição no ${teamName}</strong>
        <div class="mc-timeline-popup-sub-row">
          <div class="mc-timeline-popup-player mc-timeline-popup-player--in">
            ${inPhoto}
            <span class="mc-timeline-popup-info">
              ${arrowIn}
              <span class="mc-timeline-popup-name">${lastName(event.playerIn.name)}</span>
              <span class="mc-timeline-popup-position">${event.playerIn.position}</span>
            </span>
          </div>
          <div class="mc-timeline-popup-player mc-timeline-popup-player--out">
            ${outPhoto}
            <span class="mc-timeline-popup-info">
              ${arrowOut}
              <span class="mc-timeline-popup-name">${lastName(event.playerOut.name)}</span>
              <span class="mc-timeline-popup-position">${event.playerOut.position}</span>
            </span>
          </div>
        </div>`;
    }
    if (event.type === "goal" || event.type === "goal-penalty") {
      const teamName = event.team === "lisbon" ? "Lisbon FC" : activeMatch.opponentName;
      const titleClass = event.team === "lisbon" ? "mc-timeline-popup-title--home" : "mc-timeline-popup-title--away";
      const photo = event.photo
        ? `<img class="mc-timeline-popup-photo" src="${event.photo}" alt="">`
        : `<span class="mc-timeline-popup-avatar">${initials(event.player)}</span>`;
      const penaltyNote = event.type === "goal-penalty" ? " (Grande Penalidade)" : "";
      const ownGoalNote = event.ownGoal ? " (autogolo)" : "";
      const runningScore = getRunningScoreAfter(event);
      const fullDescription = runningScore ? `${runningScore}. ${event.description || ""}` : event.description || "";
      return `
        <span class="mc-timeline-popup-photo-center">${photo}</span>
        <strong class="mc-timeline-popup-title mc-timeline-popup-title--goal ${titleClass}">${minuteLabel} Golo de ${lastName(event.player)}${penaltyNote}${ownGoalNote} (${teamName})</strong>
        <div class="mc-timeline-popup-goal-row mc-timeline-popup-goal-row--indent">
          <span class="mc-timeline-popup-goal-info">
            <span class="mc-timeline-popup-description">${fullDescription}</span>
          </span>
        </div>`;
    }
    const teamName = event.team === "lisbon" ? "Lisbon FC" : activeMatch.opponentName;
    const titleClass = event.team === "lisbon" ? "mc-timeline-popup-title--home" : "mc-timeline-popup-title--away";
    const cardWord = event.type === "red" ? "vermelho" : "amarelo";
    const cardPhoto = event.photo
      ? `<img class="mc-timeline-popup-photo" src="${event.photo}" alt="">`
      : `<span class="mc-timeline-popup-avatar">${initials(event.player)}</span>`;
    return `
        ${cardPhoto}
        <strong class="mc-timeline-popup-title mc-timeline-popup-title--card ${titleClass}">${minuteLabel} Cartão ${cardWord} para ${lastName(event.player)} (${teamName})</strong>`;
  }

  function minuteToPct(minute) {
    const regulation = activeMatch.regulationMinutes || 90;
    const floorMinute = (regulation / 90) * 2;
    if (minute <= regulation) return Math.max(minute, floorMinute) / regulation * 95;
    return 95 + Math.min((minute - regulation) / 5, 1) * 5;
  }

  if (mcTimelineTrack && Array.isArray(activeMatch.events)) {
    const seenSlots = new Set();
    activeMatch.events
      .filter((event) => ALLOWED_TIMELINE_TYPES.includes(event.type))
      .forEach((event) => {
        const pct = minuteToPct(event.minute);
        const wrap = document.createElement("div");
        const sideClass = pct >= 50 ? " mc-timeline-event--popup-left" : " mc-timeline-event--popup-right";
        wrap.className = `mc-timeline-event mc-timeline-event--${event.team}${sideClass}`;
        wrap.style.left = `${pct}%`;

        const slotKey = `${event.team}-${event.minute}`;
        if (seenSlots.has(slotKey)) {
          wrap.style.setProperty("--ox", "22px");
          wrap.style.setProperty("--oy", "14px");
        }
        seenSlots.add(slotKey);

        const icon = document.createElement("span");
        icon.className = "mc-timeline-event-icon";
        icon.innerHTML = EVENT_ICONS[event.type] || EVENT_ICONS.goal;

        const popup = document.createElement("div");
        popup.className = "mc-timeline-event-popup";
        if (event.type === "yellow" || event.type === "red") popup.classList.add("mc-timeline-event-popup--card");
        popup.innerHTML = buildPopupContent(event);

        wrap.appendChild(icon);
        wrap.appendChild(popup);
        mcTimelineTrack.appendChild(wrap);
      });

    function snapTickPositions() {
      mcTimelineTrack.querySelectorAll(".mc-timeline-tick").forEach((tick) => {
        tick.style.transform = "translate(-50%, -50%)";
        const currentLeft = tick.getBoundingClientRect().left;
        const delta = Math.round(currentLeft) - currentLeft;
        tick.style.transform = `translate(-50%, -50%) translateX(${delta}px) scaleX(0.85)`;
      });
      const line = mcTimelineTrack.querySelector(".mc-timeline-axis-line");
      if (line) {
        line.style.transform = "";
        const currentTop = line.getBoundingClientRect().top;
        const lineDelta = Math.round(currentTop) - currentTop;
        line.style.transform = `translateY(${lineDelta}px) scaleY(0.85)`;
      }
    }
    requestAnimationFrame(snapTickPositions);
    window.addEventListener("resize", snapTickPositions);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(snapTickPositions);
    }
  }
} else {
  const mcMatchReport = document.getElementById("mcMatchReport");
  if (mcMatchReport) mcMatchReport.remove();
}

document.querySelectorAll("[data-match-content]").forEach((el) => {
  if (el.dataset.matchContent !== activeMatchId) el.remove();
});

if (activeMatch.isHome) {
  document.querySelectorAll(".mc-timeline-item--left, .mc-timeline-item--right").forEach((item) => {
    const isLeft = item.classList.contains("mc-timeline-item--left");
    item.classList.remove(isLeft ? "mc-timeline-item--left" : "mc-timeline-item--right");
    item.classList.add(isLeft ? "mc-timeline-item--right" : "mc-timeline-item--left");
  });
}

if (!activeMatch.hasLineups) {
  document
    .querySelectorAll('.mc-panel[data-panel="equipas"] .mc-roster, .mc-panel[data-panel="equipas"] .mc-referees-row')
    .forEach((el) => el.remove());
  document
    .querySelectorAll('.mc-panel[data-panel="equipas"] .mc-equipas-subtitle')
    .forEach((el) => el.classList.add("mc-equipas-subtitle--empty"));
}

function positionHeroWatermarks() {
  const heroSection = document.querySelector(".mc-hero");
  const oppTeam = document.querySelector(".mc-hero-side:not(.mc-hero-side--away) .mc-hero-team");
  const lisTeam = document.querySelector(".mc-hero-side--away .mc-hero-team");
  if (!heroSection || !oppTeam || !lisTeam || !heroOpponentWatermark || !heroLisbonWatermark) return;
  if (getComputedStyle(heroOpponentWatermark).display === "none") return;

  const EDGE_GAP = 20;
  const VERTICAL_OFFSET = 28;

  heroOpponentWatermark.style.width = "auto";
  heroLisbonWatermark.style.width = "auto";

  const heroRect = heroSection.getBoundingClientRect();
  const oppRect = oppTeam.getBoundingClientRect();
  const lisRect = lisTeam.getBoundingClientRect();

  const oppOnRight = activeMatch.isHome;

  const oppCenterY = oppRect.top - heroRect.top + oppRect.height / 2 + VERTICAL_OFFSET;
  heroOpponentWatermark.style.left = oppOnRight ? "auto" : `${EDGE_GAP}px`;
  heroOpponentWatermark.style.right = oppOnRight ? `${EDGE_GAP}px` : "auto";
  heroOpponentWatermark.style.textAlign = oppOnRight ? "left" : "right";
  heroOpponentWatermark.style.width = `${heroOpponentWatermark.scrollWidth}px`;
  heroOpponentWatermark.style.top = `${oppCenterY}px`;

  const lisCenterY = lisRect.top - heroRect.top + lisRect.height / 2 + VERTICAL_OFFSET;
  heroLisbonWatermark.style.right = oppOnRight ? "auto" : `${EDGE_GAP}px`;
  heroLisbonWatermark.style.left = oppOnRight ? `${EDGE_GAP}px` : "auto";
  heroLisbonWatermark.style.textAlign = oppOnRight ? "right" : "left";
  heroLisbonWatermark.style.width = `${heroLisbonWatermark.scrollWidth}px`;
  heroLisbonWatermark.style.top = `${lisCenterY}px`;

  const heroShareLisbon = document.getElementById("heroShareLisbon");
  if (heroShareLisbon) {
    const wmRect = heroLisbonWatermark.getBoundingClientRect();
    heroShareLisbon.style.left = oppOnRight ? `${EDGE_GAP + 24}px` : `${heroRect.width - EDGE_GAP - 24}px`;
    heroShareLisbon.style.top = `${wmRect.top - heroRect.top - 32}px`;
  }
}
window.addEventListener("resize", positionHeroWatermarks);
positionHeroWatermarks();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(positionHeroWatermarks);
}

const mcTabs = [...document.querySelectorAll(".mc-tab")];
const mcPanels = [...document.querySelectorAll(".mc-panel")];
const mcContentSection = document.querySelector(".mc-content");
const mcTabsNav = document.querySelector(".mc-tabs");

mcTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    mcTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    mcPanels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tab.dataset.tab;
    });

    const showWhite = tab.dataset.tab === "equipas" || tab.dataset.tab === "relacionados" || tab.dataset.tab === "informacoes";
    if (mcContentSection) mcContentSection.classList.toggle("mc-content--white", showWhite);
    if (mcTabsNav) mcTabsNav.classList.toggle("mc-content--white", showWhite);

    updateStickyHeader();
    updateBackToTop();
  });
});

const mcStickyHeader = document.getElementById("mcStickyHeader");
const stickyHeaderTriggers = {
  antevisao: document.getElementById("aoMinutoTitle"),
  equipas: document.getElementById("equipasTitle"),
  relacionados: document.getElementById("relacionadosTitle"),
  informacoes: document.getElementById("informacoesTitle"),
};

function updateStickyHeader() {
  if (!mcStickyHeader) return;

  const activeTab = mcTabs.find((t) => t.classList.contains("active"))?.dataset.tab;
  const titleEl = stickyHeaderTriggers[activeTab];

  if (!titleEl) {
    mcStickyHeader.classList.remove("is-visible");
    return;
  }

  const titleTop = titleEl.getBoundingClientRect().top;
  mcStickyHeader.classList.toggle("is-visible", titleTop <= 250);
}

window.addEventListener("scroll", updateStickyHeader, { passive: true });
updateStickyHeader();

const mcBackToTop = document.getElementById("mcBackToTop");
const aoMinutoTitle = document.getElementById("aoMinutoTitle");

function updateBackToTop() {
  if (!mcBackToTop || !aoMinutoTitle) return;

  const activeTab = mcTabs.find((t) => t.classList.contains("active"))?.dataset.tab;
  const isVisible = activeTab === "antevisao" && aoMinutoTitle.getBoundingClientRect().top < 0;
  mcBackToTop.hidden = !isVisible;
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

if (mcBackToTop) {
  mcBackToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const timelineSideItems = [...document.querySelectorAll(".mc-timeline-item--left, .mc-timeline-item--right")];
if (timelineSideItems.length && "IntersectionObserver" in window) {
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" }
  );

  timelineSideItems.forEach((item) => timelineObserver.observe(item));
}

const relatedRevealItems = [...document.querySelectorAll(".mc-related-reveal")];
if (relatedRevealItems.length && "IntersectionObserver" in window) {
  const relatedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" }
  );

  relatedRevealItems.forEach((item) => relatedObserver.observe(item));
}

const equipasRevealItems = [...document.querySelectorAll(".mc-equipas-reveal")];
equipasRevealItems.forEach((item, i) => {
  item.style.transitionDelay = `${Math.min(i * 60, 600)}ms`;
});
if (equipasRevealItems.length && "IntersectionObserver" in window) {
  const equipasObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" }
  );

  equipasRevealItems.forEach((item) => equipasObserver.observe(item));
}

const infoRevealItems = [...document.querySelectorAll(".mc-info-reveal")];
infoRevealItems.forEach((item, i) => {
  item.style.transitionDelay = `${Math.min(i * 60, 600)}ms`;
});
if (infoRevealItems.length && "IntersectionObserver" in window) {
  const infoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" }
  );

  infoRevealItems.forEach((item) => infoObserver.observe(item));
}

const kickoff = new Date(Date.now() + 3 * 60 * 60 * 1000);
const heroFlipTrack = document.getElementById("mcHeroFlipTrack");
const cdHours = document.getElementById("cdHours");
const cdMins = document.getElementById("cdMins");
const cdSecs = document.getElementById("cdSecs");

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const diff = Math.max(0, kickoff.getTime() - Date.now());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  if (cdHours) cdHours.textContent = pad(hours);
  if (cdMins) cdMins.textContent = pad(mins);
  if (cdSecs) cdSecs.textContent = pad(secs);
}

function flipHero() {
  if (!heroFlipTrack) return;
  heroFlipTrack.classList.toggle("show-countdown");
}

// Countdown/flip is opt-out per match via `showCountdown: false` (e.g. while
// kickoff is still far away). Defaults to on when the field is omitted.
if (activeMatch.showCountdown !== false) {
  updateCountdown();
  const countdownTimer = setInterval(updateCountdown, 1000);
  const flipTimer = setInterval(flipHero, 3000);
}
