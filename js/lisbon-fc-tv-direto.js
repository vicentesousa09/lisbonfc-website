// Lisbon FC TV, live (lisbon-fc-tv-direto.html): the site's video player in the middle of the page, with the channel's
// mark and "Direto" over it (the score is in the stream itself)

// the player: the same as the video pages', its moments the match's
const tvdBox = document.getElementById("tvdPlayer");
tvdBox.prepend(buildVideoPlayer({
  type: "video",
  crest: "Logos/Logo.png",
  moments: [
    { time: "00:00", label: "Início", text: "Começa o jogo no Play Arena Belém." },
    { time: "00:45", label: "Remate", text: "Primeiro remate do Lisbon FC, por cima da baliza." },
    { time: "02:10", label: "Golo", text: "Golo do Lisbon FC, que abre o marcador." },
    { time: "03:45", label: "Defesa", text: "Grande defesa de Vicente Sousa." },
    { time: "05:30", label: "Canto", text: "Canto perigoso para o Malandros FC." },
    { time: "07:15", label: "Cartão amarelo", text: "Cartão amarelo após uma falta tática." },
  ],
}));
