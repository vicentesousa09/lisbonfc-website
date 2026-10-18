const DEFAULT_VIDEO_MOMENTS = [
  { time: "00:45", label: "Lance de destaque", text: "Jogada de destaque nos primeiros minutos do encontro." },
  { time: "01:15", label: "Falta", text: "Falta cometida a meio-campo, sem consequências de maior." },
  { time: "02:10", label: "Golo", text: "Golo do Lisbon FC que abre o marcador do encontro." },
  { time: "03:00", label: "Substituição", text: "Primeira substituição da equipa, entrada de sangue novo no meio-campo." },
  { time: "03:45", label: "Remate", text: "Remate perigoso que obriga o guarda-redes a uma defesa apertada." },
  { time: "04:20", label: "Fora de jogo", text: "Lance assinalado como fora de jogo após revisão da assistência." },
  { time: "05:30", label: "Canto", text: "Lance de canto perigoso criado na área adversária." },
  { time: "06:00", label: "Canto", text: "Novo lance de canto, desta vez sem perigo para a baliza adversária." },
  { time: "06:40", label: "Cartão amarelo", text: "Segundo cartão amarelo da partida, mostrado a um jogador da equipa adversária." },
  { time: "07:15", label: "Cartão amarelo", text: "Cartão amarelo mostrado após uma falta tática." },
  { time: "07:50", label: "Defesa", text: "Grande defesa do guarda-redes que evita o empate." },
];
const VIDEO_DURATION_SECONDS = 8 * 60;

const CAPTION_FAMILIES = [
  { label: "Inter", value: "var(--font-body)" },
  { label: "Monoespaçada", value: "'Courier New', monospace" },
  { label: "Serifada", value: "Georgia, serif" },
  { label: "Arredondada", value: "'Arial Rounded MT Bold', sans-serif" },
  { label: "Cursiva", value: "'Brush Script MT', cursive" },
  { label: "Pequenas Maiúsculas", value: "Copperplate, fantasy" },
  { label: "Condensada", value: "'Arial Narrow', sans-serif" },
];
const CAPTION_COLORS = [
  { label: "Branco", value: "#ffffff" },
  { label: "Amarelo", value: "#ffde5a" },
  { label: "Verde Claro", value: "#8bc34a" },
  { label: "Azul Claro", value: "#4fc3f7" },
  { label: "Azul Marinho", value: "#000080" },
  { label: "Roxo Claro", value: "#ce93d8" },
  { label: "Vermelho", value: "#e53935" },
  { label: "Preto", value: "#000000" },
];
const CAPTION_SIZES = ["50%", "100%", "150%", "200%"];
const CAPTION_OPACITIES = ["25%", "50%", "75%", "100%"];
const CAPTION_WINDOW_OPACITIES = ["0%", "25%", "50%", "75%", "100%"];
const CAPTION_EDGE_STYLES = [
  { label: "Nenhum", value: "none" },
  { label: "Sombra", value: "shadow" },
  { label: "Relevo", value: "raised" },
  { label: "Rebaixada", value: "depressed" },
  { label: "Contorno", value: "outline" },
];

function timeToSeconds(time) {
  const [min, sec] = time.split(":").map(Number);
  return min * 60 + sec;
}

function secondsToTime(totalSeconds) {
  const min = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 60);
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function buildVideoPlayer(media) {
  const moments = media.moments || DEFAULT_VIDEO_MOMENTS;

  const player = document.createElement("div");
  player.className = "video-player";
  player.innerHTML = `
    <div class="video-stage">
    <img src="${media.crest}" alt="" class="noticia-video-crest">
    <video class="video-remote-target" hidden muted playsinline></video>
    <div class="video-pip-overlay">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 18 L3 18 L3 6 L21 6 L21 11"/>
        <path d="M6 8 L10 12 M10 9.4 L10 12 L7.4 12"/>
        <rect x="14" y="15" width="10" height="7" fill="currentColor" stroke="none"/>
      </svg>
      <p>Reproduzindo em PiP (picture-in-picture)</p>
    </div>
    <div class="video-seek-indicator video-seek-indicator--left" id="videoSeekLeft">
      <div class="video-seek-indicator-content">
        <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="22,5 22,19 13,12"/><polygon points="11,5 11,19 2,12"/></svg>
        <span>5 segundos</span>
      </div>
    </div>
    <div class="video-seek-indicator video-seek-indicator--right" id="videoSeekRight">
      <div class="video-seek-indicator-content">
        <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="2,5 2,19 11,12"/><polygon points="13,5 13,19 22,12"/></svg>
        <span>5 segundos</span>
      </div>
    </div>
    <div class="video-captions" id="videoCaptions" hidden><span class="video-captions-window" id="videoCaptionsWindow"><span id="videoCaptionsText"></span></span></div>
    <div class="video-controls">
      <button type="button" class="video-play-btn" id="videoPlayBtn" aria-label="Reproduzir">
        <svg class="video-icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        <svg class="video-icon-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
      </button>
      <div class="video-timeline-bar">
        <div class="video-scrubber" id="videoScrubber">
          <div class="video-scrubber-fill" id="videoScrubberFill"></div>
          <div class="video-scrubber-thumb" id="videoScrubberThumb"></div>
          <div class="video-time-bubble" id="videoTimeBubble">00:00</div>
          <div class="video-hover-preview" id="videoHoverPreview" hidden>
            <div class="video-hover-preview-thumb"><img src="${media.crest}" alt=""></div>
            <div class="video-hover-preview-time" id="videoHoverPreviewTime">00:00</div>
          </div>
        </div>
        <div class="video-volume-control" id="videoVolumeControl">
          <button type="button" class="video-icon-btn" id="videoVolumeBtn" aria-label="Volume">
            <svg class="video-icon-volume-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a9 9 0 0 1 0 12"/></svg>
            <svg class="video-icon-volume-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a9 9 0 0 1 0 12"/><line class="video-icon-mute-stroke-gap" x1="4.5" y1="19.5" x2="19.5" y2="4.5"/><line x1="4.5" y1="19.5" x2="19.5" y2="4.5"/></svg>
          </button>
          <div class="video-volume-popup" id="videoVolumePopup">
            <div class="video-volume-slider" id="videoVolumeSlider">
              <div class="video-volume-track" id="videoVolumeTrack">
                <div class="video-volume-fill" id="videoVolumeFill"></div>
                <div class="video-volume-thumb" id="videoVolumeThumb"></div>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="video-icon-btn" id="videoCaptionsBtn" aria-label="Legendas">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9.5 10.2c-.3-.5-.9-.8-1.6-.8-1.1 0-1.9.8-1.9 2.1s.8 2.1 1.9 2.1c.7 0 1.3-.3 1.6-.8"/><path d="M16.5 10.2c-.3-.5-.9-.8-1.6-.8-1.1 0-1.9.8-1.9 2.1s.8 2.1 1.9 2.1c.7 0 1.3-.3 1.6-.8"/></svg>
        </button>
        <div class="video-settings-control" id="videoSettingsControl">
          <button type="button" class="video-icon-btn" id="videoSettingsBtn" aria-label="Definições">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7.1 7.1 0 0 0-.1-1.2l2-1.6-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.4 2.5a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.6a7.1 7.1 0 0 0 0 2.4l-2 1.6 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.4-2.5a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <button type="button" class="video-icon-btn" id="videoSearchBtn" aria-label="Pesquisar momentos">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect class="video-search-sheet" x="3" y="5" width="14" height="14" rx="1.5"/>
            <line class="video-search-sheet-line" x1="6" y1="9" x2="15" y2="9"/>
            <line class="video-search-sheet-line" x1="6" y1="12.5" x2="12.5" y2="12.5"/>
            <line class="video-search-sheet-line" x1="6" y1="16" x2="10" y2="16"/>
            <circle class="video-search-glass-halo" cx="15.6" cy="16.8" r="6.4"/>
            <circle class="video-search-glass-body" cx="15.6" cy="16.8" r="4.4"/>
            <line class="video-search-glass-handle" x1="18.71" y1="19.91" x2="21.11" y2="22.31"/>
          </svg>
        </button>
        <button type="button" class="video-icon-btn" id="videoCastBtn" aria-label="Transmitir para outro ecrã" disabled hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 8 L3 7 A2 2 0 0 1 5 5 L19 5 A2 2 0 0 1 21 7 L21 17 A2 2 0 0 1 19 19 L14 19"/>
            <path d="M4 9.7a8.3 8.3 0 0 1 8.3 8.3"/>
            <path d="M4 13.9a4.1 4.1 0 0 1 4.1 4.1"/>
            <circle cx="4" cy="18" r="1.45" fill="currentColor" stroke="none"/>
          </svg>
        </button>
        <button type="button" class="video-icon-btn" id="videoPipBtn" aria-label="Ecrã dentro de ecrã">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 18 L5 18 A2 2 0 0 1 3 16 L3 8 A2 2 0 0 1 5 6 L19 6 A2 2 0 0 1 21 8 L21 11"/>
            <path class="video-pip-arrow" d="M6 8 L10 12 M10 9.4 L10 12 L7.4 12"/>
            <rect x="14" y="15" width="10" height="7" rx="1.5" fill="currentColor" stroke="none"/>
          </svg>
        </button>
        <button type="button" class="video-icon-btn" id="videoFullscreenBtn" aria-label="Ecrã inteiro">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path class="video-fs-expand" d="M9.5 9.5 L4.3 4.3 M8.2 4.3 L4.3 4.3 L4.3 8.2"/>
            <path class="video-fs-expand" d="M14.6 9.5 L19.7 4.3 M15.8 4.3 L19.7 4.3 L19.7 8.2"/>
            <path class="video-fs-expand" d="M9.5 14.6 L4.3 19.7 M8.2 19.7 L4.3 19.7 L4.3 15.8"/>
            <path class="video-fs-expand" d="M14.6 14.6 L19.7 19.7 M15.8 19.7 L19.7 19.7 L19.7 15.8"/>
            <path class="video-fs-contract" d="M4.3 4.3 L9.5 9.5 M5.6 9.5 L9.5 9.5 L9.5 5.6"/>
            <path class="video-fs-contract" d="M19.7 4.3 L14.6 9.5 M18.5 9.5 L14.6 9.5 L14.6 5.6"/>
            <path class="video-fs-contract" d="M4.3 19.7 L9.5 14.6 M5.6 14.6 L9.5 14.6 L9.5 18.5"/>
            <path class="video-fs-contract" d="M19.7 19.7 L14.6 14.6 M18.5 14.6 L14.6 14.6 L14.6 18.5"/>
          </svg>
        </button>
        <div class="video-settings-menu" id="videoSettingsMenu">
       <div class="video-settings-track" id="videoSettingsTrack">
        <div class="video-settings-panel" id="videoSettingsMain">
          <button type="button" class="video-settings-row" data-panel="quality">
            <span class="video-settings-label">Qualidade</span>
            <span class="video-settings-value" id="videoQualityValue">1080p<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>
          </button>
          <button type="button" class="video-settings-row" data-panel="captions">
            <span class="video-settings-label">CC/Legendas</span>
            <span class="video-settings-value" id="videoCaptionsValue"><span class="video-settings-value-text">Desativado</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>
          </button>
          <div class="video-settings-divider"></div>
          <button type="button" class="video-settings-row video-settings-row--debug-log" id="videoSettingsDebugLog">
            <svg class="video-settings-row-icon" viewBox="0 0 24 24" aria-hidden="true"><circle class="video-settings-row-icon-ring" cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none"/></svg>
            <span class="video-settings-label">Registro de depuração</span>
          </button>
        </div>
        <div class="video-settings-panel" id="videoSettingsQuality">
          <div class="video-settings-back">
            <button type="button" class="video-settings-back-icon" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="video-settings-back-label">Qualidade</span>
          </div>
          <button type="button" class="video-settings-item" data-value="Automático"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>Automático</button>
          <button type="button" class="video-settings-item is-selected" data-value="1080p"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>1080p</button>
          <button type="button" class="video-settings-item" data-value="720p"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>720p</button>
          <button type="button" class="video-settings-item" data-value="480p"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>480p</button>
        </div>
        <div class="video-settings-panel" id="videoSettingsCaptionsList">
          <div class="video-settings-back">
            <button type="button" class="video-settings-back-icon" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="video-settings-back-label">CC/Legendas</span>
          </div>
          <button type="button" class="video-settings-item is-selected" data-value="Desativado"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>Desativar</button>
          <button type="button" class="video-settings-item" data-value="Português (geradas automaticamente)"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>Português (geradas automaticamente)</button>
          <div class="video-settings-divider"></div>
          <button type="button" class="video-settings-row video-settings-row--customize" data-panel="captions-customize">
            <span class="video-settings-label">Customizar</span>
            <span class="video-settings-value"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>
          </button>
        </div>
        <div class="video-settings-panel" id="videoSettingsCaptionsCustomize">
          <div class="video-settings-back">
            <button type="button" class="video-settings-back-icon" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="video-settings-back-label">Customizar</span>
          </div>
          <button type="button" class="video-settings-row" data-panel="captions-font">
            <span class="video-settings-label">Fonte</span>
            <span class="video-settings-value" id="videoCaptionsFontValue"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>
          </button>
          <button type="button" class="video-settings-row" data-panel="captions-background">
            <span class="video-settings-label">Fundo</span>
            <span class="video-settings-value" id="videoCaptionsBgValue"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>
          </button>
          <button type="button" class="video-settings-row" data-panel="captions-window">
            <span class="video-settings-label">Janela</span>
            <span class="video-settings-value" id="videoCaptionsWindowValue"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>
          </button>
          <button type="button" class="video-settings-row" id="videoCaptionsResetAll">
            <span class="video-settings-label">Redefinir tudo</span>
          </button>
        </div>
        <div class="video-settings-panel video-settings-panel--captions-font" id="videoSettingsCaptionsFont">
          <div class="video-settings-back">
            <button type="button" class="video-settings-back-icon" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="video-settings-back-label">Fonte</span>
          </div>
          <div class="video-caption-dropdown">
            <button type="button" class="video-settings-row video-caption-dropdown-toggle" id="videoCaptionsFamilyToggle">
              <span class="video-settings-label">Família</span>
              <span class="video-settings-value"><span id="videoCaptionsFamilyCurrent">Inter</span><svg class="video-caption-dropdown-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg></span>
            </button>
            <div class="video-caption-dropdown-list" id="videoCaptionsFamilyList" hidden>
              ${CAPTION_FAMILIES.map((f) => `<button type="button" class="video-settings-item${f.label === "Inter" ? " is-selected" : ""}" data-value="${f.value}"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>${f.label}</button>`).join("")}
            </div>
          </div>
          <div class="video-caption-setting">
            <span class="video-settings-label">Cor</span>
            <div class="video-caption-swatches" id="videoCaptionsColorSwatches">
              ${CAPTION_COLORS.map((c) => `<button type="button" class="video-caption-swatch${c.value === "#ffffff" ? " is-selected" : ""}" data-value="${c.value}" style="background:${c.value}" aria-label="${c.label}" title="${c.label}"></button>`).join("")}
            </div>
          </div>
          <div class="video-caption-setting">
            <span class="video-settings-label">Tamanho</span>
            <div class="video-caption-chip-group" id="videoCaptionsSizeChips">
              ${CAPTION_SIZES.map((s) => `<button type="button" class="video-caption-chip${s === "100%" ? " is-selected" : ""}" data-value="${s}">${s}</button>`).join("")}
            </div>
          </div>
          <div class="video-caption-setting" id="videoCaptionsOpacitySetting">
            <span class="video-settings-label">Opacidade</span>
            <div class="video-caption-chip-group" id="videoCaptionsOpacityChips">
              ${CAPTION_OPACITIES.map((s) => `<button type="button" class="video-caption-chip${s === "100%" ? " is-selected" : ""}" data-value="${s}">${s}</button>`).join("")}
            </div>
          </div>
          <div class="video-caption-dropdown">
            <button type="button" class="video-settings-row video-caption-dropdown-toggle" id="videoCaptionsEdgeToggle">
              <span class="video-settings-label">Estilo da borda</span>
              <span class="video-settings-value"><span id="videoCaptionsEdgeCurrent">Nenhum</span><svg class="video-caption-dropdown-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg></span>
            </button>
            <div class="video-caption-dropdown-list" id="videoCaptionsEdgeList" hidden>
              ${CAPTION_EDGE_STYLES.map((s) => `<button type="button" class="video-settings-item${s.value === "none" ? " is-selected" : ""}" data-value="${s.value}"><svg class="video-settings-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>${s.label}</button>`).join("")}
            </div>
          </div>
          <button type="button" class="video-settings-row" id="videoCaptionsResetAllFont">
            <span class="video-settings-label">Redefinir tudo</span>
          </button>
        </div>
        <div class="video-settings-panel" id="videoSettingsCaptionsBackground">
          <div class="video-settings-back">
            <button type="button" class="video-settings-back-icon" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="video-settings-back-label">Fundo</span>
          </div>
          <div class="video-caption-setting">
            <span class="video-settings-label">Cor</span>
            <div class="video-caption-swatches" id="videoCaptionsBgColorSwatches">
              ${CAPTION_COLORS.map((c) => `<button type="button" class="video-caption-swatch${c.value === "#000000" ? " is-selected" : ""}" data-value="${c.value}" style="background:${c.value}" aria-label="${c.label}" title="${c.label}"></button>`).join("")}
            </div>
          </div>
          <div class="video-caption-setting" id="videoCaptionsBgOpacitySetting">
            <span class="video-settings-label">Opacidade</span>
            <div class="video-caption-chip-group" id="videoCaptionsBgOpacityChips">
              ${CAPTION_OPACITIES.map((s) => `<button type="button" class="video-caption-chip${s === "100%" ? " is-selected" : ""}" data-value="${s}">${s}</button>`).join("")}
            </div>
          </div>
          <button type="button" class="video-settings-row" id="videoCaptionsResetAllBg">
            <span class="video-settings-label">Redefinir tudo</span>
          </button>
        </div>
        <div class="video-settings-panel" id="videoSettingsCaptionsWindow">
          <div class="video-settings-back">
            <button type="button" class="video-settings-back-icon" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="video-settings-back-label">Janela</span>
          </div>
          <div class="video-caption-setting">
            <span class="video-settings-label">Cor</span>
            <div class="video-caption-swatches" id="videoCaptionsWindowColorSwatches">
              ${CAPTION_COLORS.map((c) => `<button type="button" class="video-caption-swatch" data-value="${c.value}" style="background:${c.value}" aria-label="${c.label}" title="${c.label}"></button>`).join("")}
            </div>
          </div>
          <div class="video-caption-setting" id="videoCaptionsWindowOpacitySetting">
            <span class="video-settings-label">Opacidade</span>
            <div class="video-caption-chip-group" id="videoCaptionsWindowOpacityChips">
              ${CAPTION_WINDOW_OPACITIES.map((s) => `<button type="button" class="video-caption-chip${s === "0%" ? " is-selected" : ""}" data-value="${s}">${s}</button>`).join("")}
            </div>
          </div>
          <button type="button" class="video-settings-row" id="videoCaptionsResetAllWindow">
            <span class="video-settings-label">Redefinir tudo</span>
          </button>
        </div>
       </div>
      </div>
      </div>
      <div class="video-logo-box">
        <img src="Logos/Logo.png" alt="Lisbon FC">
      </div>
    </div>
    <div class="video-context-menu" id="videoContextMenu" hidden>
      <button type="button" class="video-context-menu-item" data-action="debug-panel">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="8" y="8" width="8" height="10" rx="4"/>
          <line x1="12" y1="2" x2="12" y2="5"/>
          <line x1="9" y1="3" x2="10.5" y2="5.5"/>
          <line x1="15" y1="3" x2="13.5" y2="5.5"/>
          <line x1="8" y1="10" x2="4" y2="8"/>
          <line x1="8" y1="13" x2="3" y2="13"/>
          <line x1="8" y1="16" x2="4" y2="18"/>
          <line x1="16" y1="10" x2="20" y2="8"/>
          <line x1="16" y1="13" x2="21" y2="13"/>
          <line x1="16" y1="16" x2="20" y2="18"/>
          <line x1="12" y1="8" x2="12" y2="18"/>
        </svg>
        Abrir painel de depuração
      </button>
      <button type="button" class="video-context-menu-item" data-action="copy-debug">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Copiar informações de depuração
      </button>
      <button type="button" class="video-context-menu-item" data-action="shortcuts">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
        </svg>
        Ver atalhos do teclado
      </button>
    </div>
    <div class="video-info-panel video-debug-panel" id="videoDebugPanel" hidden>
      <button type="button" class="video-info-panel-close video-debug-panel-close" id="videoDebugPanelClose" aria-label="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
      <div class="video-info-panel-body" id="videoDebugPanelBody"></div>
      <div class="video-debug-panel-key" id="videoDebugKey" hidden><span>Debug Key:</span> <span id="videoDebugKeyValue"></span></div>
      <div class="video-debug-panel-actions">
        <button type="button" class="video-debug-action-btn" id="videoDebugCopyPayload">Copy Debug Payload</button>
        <button type="button" class="video-debug-action-btn" id="videoDebugSendPayload">Send Debug Payload</button>
      </div>
    </div>
    <div class="video-shortcuts-panel" id="videoShortcutsPanel" hidden>
      <button type="button" class="video-shortcuts-panel-close" id="videoShortcutsPanelClose" aria-label="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
      <div class="video-shortcuts-panel-content">
        <h3 class="video-shortcuts-title">Atalhos do Teclado</h3>
        <div class="video-shortcuts-list">
          <div class="video-shortcut-item"><span class="video-shortcut-key"><svg class="video-shortcut-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 8 L12 4.5 L15.5 8"/><line x1="12" y1="4" x2="12" y2="21"/></svg></span><span class="video-shortcut-desc">Aumentar volume</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key"><svg class="video-shortcut-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 16 L12 19.5 L15.5 16"/><line x1="12" y1="3" x2="12" y2="20"/></svg></span><span class="video-shortcut-desc">Abaixar volume</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key"><svg class="video-shortcut-arrow video-shortcut-arrow--horizontal" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8.5 L19.5 12 L16 15.5"/><line x1="3" y1="12" x2="20" y2="12"/></svg></span><span class="video-shortcut-desc">Para frente</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key"><svg class="video-shortcut-arrow video-shortcut-arrow--horizontal" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8.5 L4.5 12 L8 15.5"/><line x1="4" y1="12" x2="21" y2="12"/></svg></span><span class="video-shortcut-desc">Para trás</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">C</span><span class="video-shortcut-desc">Ativar/Desativar Closed Captions (CC)</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">F</span><span class="video-shortcut-desc">Ativar/Desativar tela cheia</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">&#8679;T</span><span class="video-shortcut-desc">Alternar transcrição</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">J</span><span class="video-shortcut-desc">Para trás</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">K</span><span class="video-shortcut-desc">Reproduzir/Pausar</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">L</span><span class="video-shortcut-desc">Para frente</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">M</span><span class="video-shortcut-desc">Ativar som ou silenciar</span></div>
          <div class="video-shortcut-item"><span class="video-shortcut-key">P</span><span class="video-shortcut-desc">Frame da captura de tela</span></div>
        </div>
      </div>
    </div>
    <div class="video-toast" id="videoToast" hidden></div>
    <div class="video-copy-toast" id="videoCopyToast" hidden>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
      <span>Informações de depuração copiadas</span>
      <span class="video-copy-toast-divider"></span>
      <button type="button" class="video-copy-toast-close" id="videoCopyToastClose" aria-label="Fechar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
      <div class="video-copy-toast-progress" id="videoCopyToastProgress"></div>
    </div>
    </div>
    <div class="video-moments-panel" id="videoMomentsPanel">
     <div class="video-moments-panel-inner">
      <h3>Transcrição</h3>
      <div class="video-transcript-search">
        <svg class="video-transcript-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.3" y1="15.3" x2="21" y2="21"/></svg>
        <input type="text" placeholder="Buscar transcrição" id="videoTranscriptInput">
        <div class="video-transcript-search-controls" id="videoTranscriptControls" hidden>
          <span class="video-transcript-search-count" id="videoTranscriptCount">0/0</span>
          <button type="button" class="video-transcript-nav-btn" id="videoTranscriptPrev" aria-label="Resultado anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>
          <button type="button" class="video-transcript-nav-btn" id="videoTranscriptNext" aria-label="Resultado seguinte"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <button type="button" class="video-transcript-clear-btn" id="videoTranscriptClear" aria-label="Limpar pesquisa"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg></button>
        </div>
      </div>
      <div class="video-moments-list">
        ${moments.map((mo) => `<button type="button" class="video-moment" data-time="${mo.time}"><span class="video-moment-text">${mo.text || mo.label}</span><span class="video-moment-time-block">${mo.time}</span></button>`).join("")}
      </div>
     </div>
    </div>
  `;

  initVideoPlayer(player);
  return player;
}

function initVideoPlayer(player) {
  const playBtn = player.querySelector("#videoPlayBtn");
  const controlsBar = player.querySelector(".video-controls");
  const scrubber = player.querySelector("#videoScrubber");
  const scrubberFill = player.querySelector("#videoScrubberFill");
  const scrubberThumb = player.querySelector("#videoScrubberThumb");
  const timeBubble = player.querySelector("#videoTimeBubble");
  const hoverPreview = player.querySelector("#videoHoverPreview");
  const hoverPreviewTime = player.querySelector("#videoHoverPreviewTime");
  const volumeBtn = player.querySelector("#videoVolumeBtn");
  const volumeTrack = player.querySelector("#videoVolumeTrack");
  const volumeFill = player.querySelector("#videoVolumeFill");
  const volumeThumb = player.querySelector("#videoVolumeThumb");
  const captionsBtn = player.querySelector("#videoCaptionsBtn");
  const captionsBox = player.querySelector("#videoCaptions");
  const captionsWindow = player.querySelector("#videoCaptionsWindow");
  const captionsText = player.querySelector("#videoCaptionsText");
  const settingsBtn = player.querySelector("#videoSettingsBtn");
  const settingsMenu = player.querySelector("#videoSettingsMenu");
  const settingsTrack = player.querySelector("#videoSettingsTrack");
  const settingsMain = player.querySelector("#videoSettingsMain");
  const qualityPanel = player.querySelector("#videoSettingsQuality");
  const captionsPanel = player.querySelector("#videoSettingsCaptionsList");
  const captionsCustomizePanel = player.querySelector("#videoSettingsCaptionsCustomize");
  const captionsFontPanel = player.querySelector("#videoSettingsCaptionsFont");
  const captionsBackgroundPanel = player.querySelector("#videoSettingsCaptionsBackground");
  const captionsWindowPanel = player.querySelector("#videoSettingsCaptionsWindow");
  const qualityValue = player.querySelector("#videoQualityValue");
  const captionsValue = player.querySelector("#videoCaptionsValue");
  const captionsValueText = captionsValue.querySelector(".video-settings-value-text");

  function setCaptionsValueText(text) {
    captionsValueText.innerHTML = text === "Português (geradas automaticamente)"
      ? "Português (geradas<br>automaticamente)"
      : text;
  }
  const settingsPanelOrder = [
    settingsMain, qualityPanel, captionsPanel,
    captionsCustomizePanel, captionsFontPanel, captionsBackgroundPanel, captionsWindowPanel,
  ];
  const searchBtn = player.querySelector("#videoSearchBtn");
  const momentsPanel = player.querySelector("#videoMomentsPanel");
  const transcriptSearch = player.querySelector(".video-transcript-search");
  const transcriptSearchInput = transcriptSearch.querySelector("input");
  const transcriptControls = player.querySelector("#videoTranscriptControls");
  const transcriptCount = player.querySelector("#videoTranscriptCount");
  const transcriptPrev = player.querySelector("#videoTranscriptPrev");
  const transcriptNext = player.querySelector("#videoTranscriptNext");
  const transcriptClear = player.querySelector("#videoTranscriptClear");
  const momentEls = [...player.querySelectorAll(".video-moment")];
  const captionCues = momentEls
    .map((el) => ({ seconds: timeToSeconds(el.dataset.time), text: el.querySelector(".video-moment-text").textContent }))
    .sort((a, b) => a.seconds - b.seconds);
  const videoStage = player.querySelector(".video-stage");
  const pipBtn = player.querySelector("#videoPipBtn");
  const fullscreenBtn = player.querySelector("#videoFullscreenBtn");
  const castBtn = player.querySelector("#videoCastBtn");
  const remoteTarget = player.querySelector(".video-remote-target");
  const contextMenu = player.querySelector("#videoContextMenu");
  const debugPanel = player.querySelector("#videoDebugPanel");
  const debugPanelBody = player.querySelector("#videoDebugPanelBody");
  const debugPanelClose = player.querySelector("#videoDebugPanelClose");
  const shortcutsPanel = player.querySelector("#videoShortcutsPanel");
  const shortcutsPanelClose = player.querySelector("#videoShortcutsPanelClose");
  const toast = player.querySelector("#videoToast");
  const seekLeft = player.querySelector("#videoSeekLeft");
  const seekRight = player.querySelector("#videoSeekRight");
  const copyToast = player.querySelector("#videoCopyToast");
  const copyToastIcon = copyToast.querySelector("svg");
  const copyToastText = copyToast.querySelector("span");
  const copyToastProgress = player.querySelector("#videoCopyToastProgress");
  const copyToastClose = player.querySelector("#videoCopyToastClose");

  const clipId = (() => {
    const src = new URLSearchParams(location.search).get("video") || document.title || location.pathname;
    let hash = 5381;
    for (let i = 0; i < src.length; i++) hash = ((hash << 5) + hash + src.charCodeAt(i)) >>> 0;
    return 1000000000 + (hash % 900000000);
  })();

  const debugKey = (() => {
    const src = (new URLSearchParams(location.search).get("video") || document.title || location.pathname) + "_key";
    let hash = 5381;
    for (let i = 0; i < src.length; i++) hash = ((hash << 5) + hash + src.charCodeAt(i)) >>> 0;
    const prefix = 10000000 + (hash % 90000000);
    let x = (clipId * 2654435761) >>> 0;
    let hex = "";
    while (hex.length < 52) {
      x = (Math.imul(x, 1103515245) + 12345) >>> 0;
      hex += x.toString(16).padStart(8, "0");
    }
    return `${prefix}_${clipId}_${hex.slice(0, 52)}`;
  })();

  let currentSeconds = 0;
  let playTimer = null;

  function setProgress(seconds) {
    currentSeconds = Math.max(0, Math.min(VIDEO_DURATION_SECONDS, seconds));
    const pct = (currentSeconds / VIDEO_DURATION_SECONDS) * 100;
    scrubberFill.style.width = pct + "%";
    scrubberThumb.style.left = pct + "%";
    timeBubble.style.left = pct + "%";
    timeBubble.textContent = secondsToTime(currentSeconds);
    if (!debugPanel.hidden) updateDebugPanel();
    updateCaptions();
  }

  function updateCaptions() {
    if (!captionsBtn.classList.contains("is-active")) {
      captionsBox.hidden = true;
      return;
    }
    let active = null;
    for (const cue of captionCues) {
      if (cue.seconds <= currentSeconds) active = cue; else break;
    }
    if (!active) {
      captionsBox.hidden = true;
      return;
    }
    captionsText.textContent = active.text;
    captionsBox.hidden = false;
  }

  function pause() {
    clearInterval(playTimer);
    playTimer = null;
    playBtn.classList.remove("is-playing");
  }

  function play() {
    playBtn.classList.add("is-playing");
    playTimer = setInterval(() => {
      if (currentSeconds >= VIDEO_DURATION_SECONDS) { pause(); return; }
      setProgress(currentSeconds + 1);
    }, 1000);
  }

  playBtn.addEventListener("click", () => {
    if (playTimer) pause(); else play();
  });

  const HOVER_PREVIEW_WIDTH = 149;

  function scrubPctFromEvent(e) {
    const rect = scrubber.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }

  function updateHoverPreview(pct) {
    const rect = scrubber.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const desiredLeftAbs = rect.left + pct * rect.width - HOVER_PREVIEW_WIDTH / 2;
    const snappedLeftAbs = Math.round(desiredLeftAbs * dpr) / dpr;
    hoverPreview.style.left = (snappedLeftAbs - rect.left) + "px";
    hoverPreviewTime.textContent = secondsToTime(pct * VIDEO_DURATION_SECONDS);
    hoverPreview.hidden = false;
  }

  let draggingScrubber = false;

  scrubber.addEventListener("mousedown", (e) => {
    e.preventDefault();
    draggingScrubber = true;
    scrubber.classList.add("is-dragging");
    videoStage.classList.add("is-scrubbing");
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    const pct = scrubPctFromEvent(e);
    setProgress(pct * VIDEO_DURATION_SECONDS);
    updateHoverPreview(pct);
  });

  scrubber.addEventListener("mousemove", (e) => {
    updateHoverPreview(scrubPctFromEvent(e));
  });

  scrubber.addEventListener("mouseleave", () => {
    if (!draggingScrubber) hoverPreview.hidden = true;
  });

  document.addEventListener("mousemove", (e) => {
    if (!draggingScrubber) return;
    const pct = scrubPctFromEvent(e);
    setProgress(pct * VIDEO_DURATION_SECONDS);
    const barRect = controlsBar.getBoundingClientRect();
    const overBar = e.clientY >= barRect.top && e.clientY <= barRect.bottom;
    if (overBar) {
      updateHoverPreview(pct);
    } else {
      hoverPreview.hidden = true;
    }
  });

  document.addEventListener("mouseup", () => {
    if (!draggingScrubber) return;
    draggingScrubber = false;
    scrubber.classList.remove("is-dragging");
    videoStage.classList.remove("is-scrubbing");
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  });

  let lastVolume = 100;

  function setVolume(pct) {
    pct = Math.max(0, Math.min(100, pct));
    volumeFill.style.height = pct + "%";
    volumeThumb.style.bottom = pct + "%";
    volumeBtn.classList.toggle("is-active", pct === 0);
    if (pct > 0) lastVolume = pct;
  }

  volumeBtn.addEventListener("click", () => {
    setVolume(volumeBtn.classList.contains("is-active") ? lastVolume : 0);
  });

  function volumeFromEvent(e) {
    const rect = volumeTrack.getBoundingClientRect();
    return ((rect.bottom - e.clientY) / rect.height) * 100;
  }

  let draggingVolume = false;

  volumeTrack.addEventListener("mousedown", (e) => {
    draggingVolume = true;
    volumeTrack.classList.add("is-dragging");
    document.body.style.cursor = "grabbing";
    setVolume(volumeFromEvent(e));
  });

  document.addEventListener("mousemove", (e) => {
    if (draggingVolume) setVolume(volumeFromEvent(e));
  });

  document.addEventListener("mouseup", () => {
    if (!draggingVolume) return;
    draggingVolume = false;
    volumeTrack.classList.remove("is-dragging");
    document.body.style.cursor = "";
  });

  setVolume(100);

  captionsBtn.addEventListener("click", () => {
    const enabling = !captionsBtn.classList.contains("is-active");
    captionsBtn.classList.toggle("is-active", enabling);
    setCaptionsValueText(enabling ? "Português (geradas automaticamente)" : "Desativado");
    captionsItems.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === (enabling ? "Português (geradas automaticamente)" : "Desativado")));
    updateCaptions();
  });
  let currentSettingsPanel = null;
  const SETTINGS_MENU_TOP_GAP = 12;

  function updateSettingsMenuMaxHeight() {
    const stageRect = videoStage.getBoundingClientRect();
    const menuRect = settingsMenu.getBoundingClientRect();
    const available = menuRect.bottom - stageRect.top - SETTINGS_MENU_TOP_GAP;
    settingsMenu.style.maxHeight = Math.max(120, available) + "px";
  }

  function showSettingsPanel(panel) {
    currentSettingsPanel = panel;
    const index = settingsPanelOrder.indexOf(panel);
    settingsTrack.style.transform = `translateX(-${index * 100}%)`;
    settingsMenu.style.height = panel.offsetHeight + "px";
    updateSettingsMenuMaxHeight();
  }

  function refreshCurrentPanelHeight() {
    if (!currentSettingsPanel) return;
    settingsMenu.style.height = currentSettingsPanel.offsetHeight + "px";
    updateSettingsMenuMaxHeight();
  }

  function closeSettingsMenu() {
    settingsBtn.classList.remove("is-active");
    settingsMenu.classList.remove("is-open");
    videoStage.classList.remove("is-settings-open");
  }

  settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const opening = !settingsMenu.classList.contains("is-open");
    if (opening) {
      settingsBtn.classList.add("is-active");
      settingsMenu.classList.add("is-open");
      videoStage.classList.add("is-settings-open");
      showSettingsPanel(settingsMain);
    } else {
      closeSettingsMenu();
    }
  });

  settingsMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    closeCaptionDropdowns(null);
  });

  document.addEventListener("click", (e) => {
    const outsidePlayer = !player.contains(e.target);
    if (settingsMenu.classList.contains("is-open")) {
      closeSettingsMenu();
      if (outsidePlayer) videoStage.classList.add("is-controls-sticky");
      return;
    }
    if (outsidePlayer) videoStage.classList.remove("is-controls-sticky");
  });

  const panelByKey = {
    "quality": qualityPanel,
    "captions": captionsPanel,
    "captions-customize": captionsCustomizePanel,
    "captions-font": captionsFontPanel,
    "captions-background": captionsBackgroundPanel,
    "captions-window": captionsWindowPanel,
  };

  settingsMenu.querySelectorAll(".video-settings-row[data-panel]").forEach((row) => {
    row.addEventListener("click", (e) => {
      e.stopPropagation();
      showSettingsPanel(panelByKey[row.dataset.panel]);
    });
  });

  const settingsDebugLogBtn = player.querySelector("#videoSettingsDebugLog");
  settingsDebugLogBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeSettingsMenu();
    updateDebugPanel();
    debugPanel.hidden = false;
  });

  const backTargetByPanel = new Map([
    [qualityPanel, settingsMain],
    [captionsPanel, settingsMain],
    [captionsCustomizePanel, captionsPanel],
    [captionsFontPanel, captionsCustomizePanel],
    [captionsBackgroundPanel, captionsCustomizePanel],
    [captionsWindowPanel, captionsCustomizePanel],
  ]);

  backTargetByPanel.forEach((target, panel) => {
    panel.querySelector(".video-settings-back-icon").addEventListener("click", (e) => {
      e.stopPropagation();
      showSettingsPanel(target);
    });
  });

  const qualityItems = qualityPanel.querySelectorAll(".video-settings-item");
  qualityItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      qualityItems.forEach((i) => i.classList.toggle("is-selected", i === item));
      qualityValue.firstChild.textContent = item.dataset.value;
    });
  });

  const captionsItems = captionsPanel.querySelectorAll(".video-settings-item");
  captionsItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      captionsItems.forEach((i) => i.classList.toggle("is-selected", i === item));
      setCaptionsValueText(item.dataset.value);
      captionsBtn.classList.toggle("is-active", item.dataset.value !== "Desativado");
      updateCaptions();
    });
  });

  const captionsEdgeStyles = {
    "none": "",
    "shadow": "2px 2px 4px rgba(0, 0, 0, 0.8)",
    "raised": "-1px -1px 0 rgba(255, 255, 255, 0.5), 1px 1px 2px rgba(0, 0, 0, 0.8)",
    "depressed": "1px 1px 0 rgba(255, 255, 255, 0.5), -1px -1px 2px rgba(0, 0, 0, 0.8)",
    "outline": "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  };

  function makeCaptionChipGroup(container, apply) {
    const chips = container.querySelectorAll("button");
    chips.forEach((chip) => {
      chip.addEventListener("click", (e) => {
        e.stopPropagation();
        chips.forEach((c) => c.classList.toggle("is-selected", c === chip));
        apply(chip.dataset.value);
      });
    });
    return chips;
  }

  const openCaptionDropdowns = [];

  function closeCaptionDropdowns(except) {
    openCaptionDropdowns.forEach(({ toggle, list }) => {
      if (list === except) return;
      list.hidden = true;
      toggle.classList.remove("is-open");
    });
  }

  function setupCaptionDropdown(toggleId, listId, currentId, apply) {
    const toggle = player.querySelector(toggleId);
    const list = player.querySelector(listId);
    const current = player.querySelector(currentId);
    const items = list.querySelectorAll(".video-settings-item");
    openCaptionDropdowns.push({ toggle, list });

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const opening = list.hidden;
      closeCaptionDropdowns(opening ? list : null);
      list.hidden = !opening;
      toggle.classList.toggle("is-open", opening);
      refreshCurrentPanelHeight();
    });

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        items.forEach((i) => i.classList.toggle("is-selected", i === item));
        current.textContent = item.textContent.trim();
        list.hidden = true;
        toggle.classList.remove("is-open");
        refreshCurrentPanelHeight();
        apply(item.dataset.value);
      });
    });

    return { toggle, list, items, current };
  }

  const captionsFamilyDropdown = setupCaptionDropdown("#videoCaptionsFamilyToggle", "#videoCaptionsFamilyList", "#videoCaptionsFamilyCurrent", (value) => {
    captionsText.style.fontFamily = value;
  });

  const captionsEdgeDropdown = setupCaptionDropdown("#videoCaptionsEdgeToggle", "#videoCaptionsEdgeList", "#videoCaptionsEdgeCurrent", (value) => {
    captionsText.style.textShadow = captionsEdgeStyles[value];
  });

  const captionsColorSwatches = makeCaptionChipGroup(player.querySelector("#videoCaptionsColorSwatches"), (value) => {
    captionsText.style.color = value;
  });
  const captionsSizeChips = makeCaptionChipGroup(player.querySelector("#videoCaptionsSizeChips"), (value) => {
    captionsText.style.fontSize = (1.8 * parseFloat(value) / 100) + "rem";
  });
  const captionsOpacityChips = makeCaptionChipGroup(player.querySelector("#videoCaptionsOpacityChips"), (value) => {
    captionsText.style.opacity = parseFloat(value) / 100;
  });

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  let captionsBgColor = "#000000";
  let captionsBgOpacity = 100;
  function applyCaptionsBg() {
    captionsText.style.background = hexToRgba(captionsBgColor, captionsBgOpacity / 100);
  }

  const captionsBgColorSwatches = makeCaptionChipGroup(player.querySelector("#videoCaptionsBgColorSwatches"), (value) => {
    captionsBgColor = value;
    applyCaptionsBg();
  });
  const captionsBgOpacityChips = makeCaptionChipGroup(player.querySelector("#videoCaptionsBgOpacityChips"), (value) => {
    captionsBgOpacity = parseFloat(value);
    applyCaptionsBg();
  });

  let captionsWindowColor = null;
  let captionsWindowOpacity = 0;
  function applyCaptionsWindowBg() {
    const prevTransition = captionsBox.style.transition;
    captionsBox.style.transition = "none";
    void captionsBox.offsetWidth;
    if (!captionsWindowColor) {
      captionsWindow.style.background = "";
      captionsWindow.style.padding = "";
      captionsBox.style.setProperty("--captions-window-pad", "0px");
    } else {
      captionsWindow.style.background = hexToRgba(captionsWindowColor, captionsWindowOpacity / 100);
      captionsWindow.style.padding = "10px";
      captionsBox.style.setProperty("--captions-window-pad", "10px");
    }
    void captionsBox.offsetWidth;
    captionsBox.style.transition = prevTransition;
  }

  const captionsWindowColorSwatches = makeCaptionChipGroup(player.querySelector("#videoCaptionsWindowColorSwatches"), (value) => {
    captionsWindowColor = value;
    applyCaptionsWindowBg();
  });
  const captionsWindowOpacityChips = makeCaptionChipGroup(player.querySelector("#videoCaptionsWindowOpacityChips"), (value) => {
    captionsWindowOpacity = parseFloat(value);
    applyCaptionsWindowBg();
  });

  function resetAllCaptionSettings(e) {
    e.stopPropagation();
    captionsText.style.fontFamily = "var(--font-body)";
    captionsText.style.color = "";
    captionsText.style.fontSize = "";
    captionsText.style.opacity = "";
    captionsText.style.textShadow = "";
    captionsText.style.background = "";
    captionsFamilyDropdown.items.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "var(--font-body)"));
    captionsFamilyDropdown.current.textContent = "Inter";
    captionsEdgeDropdown.items.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "none"));
    captionsEdgeDropdown.current.textContent = "Nenhum";
    captionsColorSwatches.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "#ffffff"));
    captionsSizeChips.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "100%"));
    captionsOpacityChips.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "100%"));
    captionsBgColorSwatches.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "#000000"));
    captionsBgOpacityChips.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "100%"));
    captionsBgColor = "#000000";
    captionsBgOpacity = 100;
    captionsWindowColorSwatches.forEach((i) => i.classList.remove("is-selected"));
    captionsWindowOpacityChips.forEach((i) => i.classList.toggle("is-selected", i.dataset.value === "0%"));
    captionsWindowColor = null;
    captionsWindowOpacity = 0;
    applyCaptionsWindowBg();
  }

  player.querySelector("#videoCaptionsResetAll").addEventListener("click", resetAllCaptionSettings);
  player.querySelector("#videoCaptionsResetAllFont").addEventListener("click", resetAllCaptionSettings);
  player.querySelector("#videoCaptionsResetAllBg").addEventListener("click", resetAllCaptionSettings);
  player.querySelector("#videoCaptionsResetAllWindow").addEventListener("click", resetAllCaptionSettings);

  searchBtn.addEventListener("click", () => {
    searchBtn.classList.toggle("is-active");
    momentsPanel.classList.toggle("is-open");
    searchBtn.blur();
  });

  transcriptSearch.addEventListener("click", () => {
    transcriptSearchInput.focus();
  });

  let transcriptMatches = [];
  let transcriptMatchIndex = 0;

  function updateTranscriptMatchHighlight() {
    momentEls.forEach((el) => el.classList.remove("is-current-match"));
    if (!transcriptMatches.length) return;
    const current = transcriptMatches[transcriptMatchIndex];
    current.classList.add("is-current-match");
    current.scrollIntoView({ block: "nearest" });
  }

  function runTranscriptSearch() {
    const query = transcriptSearchInput.value.trim().toLowerCase();
    if (!query) {
      transcriptControls.hidden = true;
      transcriptMatches = [];
      momentEls.forEach((el) => el.classList.remove("is-current-match"));
      return;
    }
    transcriptControls.hidden = false;
    transcriptMatches = momentEls.filter((el) =>
      el.querySelector(".video-moment-text").textContent.toLowerCase().includes(query)
    );
    transcriptMatchIndex = 0;
    transcriptCount.textContent = transcriptMatches.length
      ? `${transcriptMatchIndex + 1}/${transcriptMatches.length}`
      : "0/0";
    updateTranscriptMatchHighlight();
  }

  transcriptSearchInput.addEventListener("input", runTranscriptSearch);

  transcriptPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!transcriptMatches.length) return;
    transcriptMatchIndex = (transcriptMatchIndex - 1 + transcriptMatches.length) % transcriptMatches.length;
    transcriptCount.textContent = `${transcriptMatchIndex + 1}/${transcriptMatches.length}`;
    updateTranscriptMatchHighlight();
  });

  transcriptNext.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!transcriptMatches.length) return;
    transcriptMatchIndex = (transcriptMatchIndex + 1) % transcriptMatches.length;
    transcriptCount.textContent = `${transcriptMatchIndex + 1}/${transcriptMatches.length}`;
    updateTranscriptMatchHighlight();
  });

  transcriptClear.addEventListener("click", (e) => {
    e.stopPropagation();
    transcriptSearchInput.value = "";
    runTranscriptSearch();
    transcriptSearchInput.focus();
  });

  momentsPanel.querySelectorAll(".video-moment").forEach((btn) => {
    btn.addEventListener("click", () => {
      setProgress(timeToSeconds(btn.dataset.time));
      momentEls.forEach((el) => el.classList.toggle("is-current-match", el === btn));
    });
  });

  if (remoteTarget) {
    const pipCanvas = document.createElement("canvas");
    pipCanvas.width = 320;
    pipCanvas.height = 180;
    const pipCtx = pipCanvas.getContext("2d");
    const crestImg = player.querySelector(".noticia-video-crest");
    pipCtx.fillStyle = "#0a2a5e";
    pipCtx.fillRect(0, 0, pipCanvas.width, pipCanvas.height);
    if (crestImg && crestImg.complete && crestImg.naturalWidth) {
      const size = 90;
      pipCtx.globalAlpha = 0.35;
      pipCtx.drawImage(crestImg, (pipCanvas.width - size) / 2, (pipCanvas.height - size) / 2, size, size);
      pipCtx.globalAlpha = 1;
    }
    remoteTarget.srcObject = pipCanvas.captureStream(1);
    remoteTarget.play().catch(() => {});
  }

  if (document.pictureInPictureEnabled && remoteTarget && !remoteTarget.disablePictureInPicture) {
    pipBtn.addEventListener("click", async () => {
      try {
        if (document.pictureInPictureElement === remoteTarget) {
          await document.exitPictureInPicture();
        } else {
          await remoteTarget.requestPictureInPicture();
        }
      } catch (e) {}
    });
    remoteTarget.addEventListener("enterpictureinpicture", () => {
      pipBtn.classList.add("is-active");
      videoStage.classList.add("is-pip-active");
    });
    remoteTarget.addEventListener("leavepictureinpicture", () => {
      pipBtn.classList.remove("is-active");
      videoStage.classList.remove("is-pip-active");
    });
  } else {
    pipBtn.hidden = true;
    pipBtn.disabled = true;
  }

  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (player.requestFullscreen) {
      player.requestFullscreen().catch(() => {});
    }
    fullscreenBtn.blur();
  });

  let fsIdleTimer = null;
  const FS_EDGE_PX = 1;
  const FS_EDGE_PX_FAR = 12;

  function handleFsMouseMove(e) {
    if (document.fullscreenElement !== player) return;
    const rect = videoStage.getBoundingClientRect();
    const nearEdge =
      e.clientX - rect.left < FS_EDGE_PX ||
      rect.right - e.clientX < FS_EDGE_PX_FAR ||
      e.clientY - rect.top < FS_EDGE_PX ||
      rect.bottom - e.clientY < FS_EDGE_PX_FAR;
    clearTimeout(fsIdleTimer);
    if (nearEdge) {
      videoStage.classList.add("is-idle");
    } else {
      videoStage.classList.remove("is-idle");
      fsIdleTimer = setTimeout(() => videoStage.classList.add("is-idle"), 2200);
    }
  }
  player.addEventListener("mousemove", handleFsMouseMove);

  document.addEventListener("fullscreenchange", () => {
    fullscreenBtn.classList.toggle("is-active", document.fullscreenElement === player);
    clearTimeout(fsIdleTimer);
    videoStage.classList.remove("is-idle");
    if (document.fullscreenElement === player) {
      fsIdleTimer = setTimeout(() => videoStage.classList.add("is-idle"), 2200);
    }
  });

  if (remoteTarget && "remote" in remoteTarget) {
    remoteTarget.remote
      .watchAvailability((available) => {
        castBtn.hidden = !available;
        castBtn.disabled = !available;
      })
      .catch(() => {
        castBtn.hidden = true;
        castBtn.disabled = true;
      });

    castBtn.addEventListener("click", () => {
      if (castBtn.disabled) return;
      remoteTarget.remote.prompt().catch(() => {});
    });
  } else {
    castBtn.hidden = true;
    castBtn.disabled = true;
  }

  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }

  let copyToastTimer = null;
  let copyToastHideTimer = null;
  const COPY_TOAST_DURATION = 2200;
  const COPY_TOAST_SLIDE_MS = 220;

  function showCopyToast(message = "Informações de depuração copiadas", showIcon = true) {
    clearTimeout(copyToastHideTimer);
    copyToastText.textContent = message;
    copyToastIcon.style.display = showIcon ? "" : "none";
    copyToast.classList.remove("is-open");
    copyToast.hidden = false;
    void copyToast.offsetWidth;
    copyToast.classList.add("is-open");
    copyToastProgress.style.transition = "none";
    copyToastProgress.style.transform = "scaleX(0)";
    void copyToastProgress.offsetWidth;
    copyToastProgress.style.transition = `transform ${COPY_TOAST_DURATION}ms linear`;
    copyToastProgress.style.transform = "scaleX(1)";
    clearTimeout(copyToastTimer);
    copyToastTimer = setTimeout(hideCopyToast, COPY_TOAST_DURATION);
  }

  function hideCopyToast() {
    clearTimeout(copyToastTimer);
    copyToast.classList.remove("is-open");
    clearTimeout(copyToastHideTimer);
    copyToastHideTimer = setTimeout(() => { copyToast.hidden = true; }, COPY_TOAST_SLIDE_MS);
  }

  let seekIndicatorTimer = null;

  function showSeekIndicator(el) {
    seekLeft.classList.remove("is-active");
    seekRight.classList.remove("is-active");
    void el.offsetWidth;
    el.classList.add("is-active");
    clearTimeout(seekIndicatorTimer);
    seekIndicatorTimer = setTimeout(() => { el.classList.remove("is-active"); }, 650);
  }

  copyToastClose.addEventListener("click", hideCopyToast);

  function closeContextMenu() {
    contextMenu.hidden = true;
  }

  videoStage.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextMenu.hidden = false;
    const menuRect = contextMenu.getBoundingClientRect();
    const maxLeft = window.innerWidth - menuRect.width - 8;
    const maxTop = window.innerHeight - menuRect.height - 8;
    contextMenu.style.left = Math.max(8, Math.min(e.clientX, maxLeft)) + "px";
    contextMenu.style.top = Math.max(8, Math.min(e.clientY, maxTop)) + "px";
  });

  document.addEventListener("click", (e) => {
    if (!contextMenu.hidden && !contextMenu.contains(e.target)) closeContextMenu();
  });

  const SHORTCUTS_PANEL_TRANSITION_MS = 220;
  let shortcutsPanelCloseTimer = null;

  function openShortcutsPanel() {
    clearTimeout(shortcutsPanelCloseTimer);
    shortcutsPanel.classList.remove("is-open");
    shortcutsPanel.hidden = false;
    void shortcutsPanel.offsetWidth;
    shortcutsPanel.classList.add("is-open");
  }

  function closeShortcutsPanel() {
    shortcutsPanel.classList.remove("is-open");
    clearTimeout(shortcutsPanelCloseTimer);
    shortcutsPanelCloseTimer = setTimeout(() => { shortcutsPanel.hidden = true; }, SHORTCUTS_PANEL_TRANSITION_MS);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeContextMenu();
    if (!shortcutsPanel.hidden) closeShortcutsPanel();
  });

  function captureScreenshotAndCopy() {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
    const crestImg = player.querySelector(".noticia-video-crest");
    ctx.fillStyle = "#0a2a5e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (crestImg && crestImg.complete && crestImg.naturalWidth) {
      const size = 90;
      ctx.globalAlpha = 0.35;
      ctx.drawImage(crestImg, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
      ctx.globalAlpha = 1;
    }
    canvas.toBlob((blob) => {
      if (!blob) { showToast("Não foi possível copiar"); return; }
      const write = (navigator.clipboard && window.ClipboardItem)
        ? navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        : Promise.reject(new Error("clipboard unavailable"));
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500));
      Promise.race([write, timeout])
        .then(() => showCopyToast("Captura de tela copiada para a sua área de transferência!", false))
        .catch(() => showToast("Não foi possível copiar"));
    }, "image/png");
  }

  function buildDebugRows() {
    const rect = player.getBoundingClientRect();
    const dpr = Math.round((window.devicePixelRatio || 1) * 100) / 100;
    const playhead = Math.floor(currentSeconds);
    const bufferEnd = Math.floor(currentSeconds);
    const bufferAhead = bufferEnd - playhead;
    return [
      ["Clip ID", String(clipId)],
      ["Player Version", "4.46.126"],
      ["Delivery", "application/vnd.vimeo.dash+json"],
      ["Embed Size", `${Math.round(rect.width)}×${Math.round(rect.height)} @${dpr}x`],
      ["Separate AV", "true"],
      ["Dropped Frames", "0 / 0 - 0"],
      ["Playhead / Buffer End", `${playhead} / ${bufferEnd}`],
      ["Buffer Ahead / Target", `${bufferAhead} / 6`],
      ["Bandwidth", "0 (0 Kbps 0 Kbps)"],
    ];
  }

  function updateDebugPanel() {
    debugPanelBody.innerHTML = buildDebugRows()
      .map(([k, v]) => `<div><span>${k}:</span><span>${v}</span></div>`)
      .join("");
  }

  contextMenu.querySelector('[data-action="debug-panel"]').addEventListener("click", () => {
    closeContextMenu();
    updateDebugPanel();
    debugPanel.hidden = false;
  });

  function copyToClipboard(text, onSuccess) {
    const clipboardWrite = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(text)
      : Promise.reject(new Error("clipboard unavailable"));
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500));
    Promise.race([clipboardWrite, timeout])
      .then(onSuccess)
      .catch(() => showToast("Não foi possível copiar"));
  }

  contextMenu.querySelector('[data-action="copy-debug"]').addEventListener("click", () => {
    closeContextMenu();
    const info = buildDebugRows().map(([k, v]) => `${k}: ${v}`).join("\n");
    copyToClipboard(info, showCopyToast);
  });

  contextMenu.querySelector('[data-action="shortcuts"]').addEventListener("click", () => {
    closeContextMenu();
    openShortcutsPanel();
  });

  debugPanelClose.addEventListener("click", () => { debugPanel.hidden = true; });
  shortcutsPanelClose.addEventListener("click", closeShortcutsPanel);

  const debugCopyPayloadBtn = player.querySelector("#videoDebugCopyPayload");
  const debugSendPayloadBtn = player.querySelector("#videoDebugSendPayload");
  const debugKeyEl = player.querySelector("#videoDebugKey");
  const debugKeyValueEl = player.querySelector("#videoDebugKeyValue");

  let debugCopyRevertTimer = null;

  debugCopyPayloadBtn.addEventListener("click", () => {
    const payload = {};
    buildDebugRows().forEach(([k, v]) => { payload[k] = v; });
    copyToClipboard(JSON.stringify(payload, null, 2), () => {
      clearTimeout(debugCopyRevertTimer);
      debugCopyPayloadBtn.classList.add("is-copied");
      debugCopyPayloadBtn.textContent = "Copied";
      debugCopyRevertTimer = setTimeout(() => {
        debugCopyPayloadBtn.classList.remove("is-copied");
        debugCopyPayloadBtn.textContent = "Copy Debug Payload";
      }, 1800);
    });
  });

  debugSendPayloadBtn.addEventListener("click", () => {
    debugKeyValueEl.textContent = debugKey;
    debugKeyEl.hidden = false;
    showToast("Debug payload enviado");
  });

  let stageHovered = false;
  videoStage.addEventListener("mouseenter", () => { stageHovered = true; });
  videoStage.addEventListener("mouseleave", () => { stageHovered = false; });

  document.addEventListener("keydown", (e) => {
    if (!stageHovered) return;
    switch (e.key) {
      case " ":
      case "k":
      case "K":
        e.preventDefault();
        if (playTimer) pause(); else play();
        break;
      case "ArrowLeft":
      case "j":
      case "J":
        e.preventDefault();
        if (currentSeconds <= 0) break;
        setProgress(currentSeconds - 5);
        showSeekIndicator(seekLeft);
        break;
      case "ArrowRight":
      case "l":
      case "L":
        e.preventDefault();
        if (currentSeconds >= VIDEO_DURATION_SECONDS) break;
        setProgress(currentSeconds + 5);
        showSeekIndicator(seekRight);
        break;
      case "ArrowUp":
        e.preventDefault();
        setVolume(parseFloat(volumeFill.style.height || "100") + 5);
        break;
      case "ArrowDown":
        e.preventDefault();
        setVolume(parseFloat(volumeFill.style.height || "100") - 5);
        break;
      case "m":
      case "M":
        e.preventDefault();
        setVolume(volumeBtn.classList.contains("is-active") ? lastVolume : 0);
        break;
      case "f":
      case "F":
        e.preventDefault();
        fullscreenBtn.click();
        break;
      case "c":
      case "C":
        e.preventDefault();
        captionsBtn.click();
        break;
      case "p":
      case "P":
        e.preventDefault();
        captureScreenshotAndCopy();
        break;
    }
  });

  setProgress(0);
  setTimeout(() => { scrubber.classList.add("is-loaded"); }, 400);
}
