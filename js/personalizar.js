const pwParams = new URLSearchParams(window.location.search);
const pwProduto = pwParams.get("produto") === "guarda-redes" ? "guarda-redes" : "principal";
const pwTamanho = pwParams.get("tamanho") || "";

const pwData = {
  principal: {
    title: "Camisola Principal do Lisbon FC 2026-2027",
    price: "30,00 €",
    img: "Logos/Loja/camisola-principal-1.png",
    imgBack: "Logos/Loja/camisola-principal-2.png",
    genero: "Homem",
  },
  "guarda-redes": {
    title: "Camisola de Guarda-Redes do Lisbon FC 2026-2027",
    price: "30,00 €",
    img: "Logos/Loja/camisola-guarda-redes-1.png",
    imgBack: "Logos/Loja/camisola-guarda-redes-2.png",
    genero: "Homem",
  },
};
const pwInfo = pwData[pwProduto];

const pwTitle = document.getElementById("pwTitle");
const pwPrice = document.getElementById("pwPrice");
const pwImg = document.getElementById("pwImg");
const pwStepThumb = document.getElementById("pwStepThumb");
if (pwTitle) pwTitle.textContent = pwInfo.title;
if (pwPrice) pwPrice.textContent = pwInfo.price;
if (pwImg) pwImg.src = pwInfo.img;
if (pwStepThumb) pwStepThumb.src = pwInfo.img;

const pwStepLabel = document.getElementById("pwStepLabel");
const pwPrevBtn = document.getElementById("pwPrevBtn");
const pwNextBtn = document.getElementById("pwNextBtn");
const pwOptionsRow = document.getElementById("pwOptionsRow");
const pwPreviewName = document.getElementById("pwPreviewName");
const pwPreviewNumber = document.getElementById("pwPreviewNumber");
const pwSurcharge = document.getElementById("pwSurcharge");
const pwPriceTrigger = document.getElementById("pwPriceTrigger");
const pwPriceDropdown = document.getElementById("pwPriceDropdown");
const pwDropSurchargeTotal = document.getElementById("pwDropSurchargeTotal");
const pwDropSurchargeName = document.getElementById("pwDropSurchargeName");
const pwSectionRow = document.querySelector(".pw-price-row--section");
const pwSubRow = document.querySelector(".pw-price-row--sub");
const pwStepTrigger = document.getElementById("pwStepTrigger");
const pwStepDropdown = document.getElementById("pwStepDropdown");
const pwSummaryTipo = document.getElementById("pwSummaryTipo");
const pwSummaryTamanho = document.getElementById("pwSummaryTamanho");
const pwSummaryNome = document.getElementById("pwSummaryNome");
const pwSummaryNumero = document.getElementById("pwSummaryNumero");

function pwSetSummaryRow(row, value) {
  if (!row) return;
  const strong = row.querySelector("strong");
  const isEmpty = value === "";
  strong.textContent = isEmpty ? "Por selecionar" : value;
  row.classList.toggle("is-empty", isEmpty);
}

function pwUpdateSummary() {
  pwSetSummaryRow(pwSummaryTipo, pwInfo.genero);
  pwSetSummaryRow(pwSummaryTamanho, pwTamanho);
  pwSetSummaryRow(pwSummaryNome, pwState.name.trim());
  pwSetSummaryRow(pwSummaryNumero, pwState.number.trim());
}

function pwUpdatePreview() {
  if (pwPreviewName) pwPreviewName.textContent = pwState.name.toUpperCase();
  if (pwPreviewNumber) pwPreviewNumber.textContent = pwState.number;
  const hasPersonalization = pwState.name.trim() !== "" || pwState.number.trim() !== "";
  const surchargeText = hasPersonalization ? "+5,00 €" : "+0,00 €";
  if (pwSurcharge) pwSurcharge.textContent = surchargeText;
  if (pwDropSurchargeTotal) pwDropSurchargeTotal.textContent = surchargeText;
  if (pwDropSurchargeName) pwDropSurchargeName.textContent = pwState.name.trim() !== "" ? "+5,00 €" : "+0,00 €";
  if (pwSectionRow) pwSectionRow.style.display = pwState.reachedNameStep ? "flex" : "none";
  if (pwSubRow) pwSubRow.style.display = pwState.reachedNameStep ? "flex" : "none";
  pwUpdateSummary();
}

if (pwPriceTrigger && pwPriceDropdown) {
  pwPriceTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = pwPriceDropdown.classList.toggle("is-open");
    pwPriceTrigger.classList.toggle("is-open", isOpen);
  });
}

if (pwStepTrigger && pwStepDropdown) {
  pwStepTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    pwUpdateSummary();
    pwStepDropdown.classList.toggle("is-open");
  });
}

const pwTotalSteps = 2;
const pwStepNames = { 1: "Tipo", 2: "Nome" };
const pwState = { step: 1, skip: false, name: "", number: "", reachedNameStep: false };

function pwCanAdd() {
  return true;
}

function pwRenderOptions() {
  pwOptionsRow.innerHTML = "";

  const group = document.createElement("div");
  group.className = "personalize-opt-group";

  if (pwState.step === 1) {
    const skipBtn = document.createElement("button");
    skipBtn.className = "personalize-opt-icon";
    skipBtn.setAttribute("aria-label", "Sem personalização");
    skipBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
    skipBtn.classList.toggle("is-active", pwState.skip);
    skipBtn.addEventListener("click", () => {
      pwState.skip = true;
      pwRender();
    });

    const namePill = document.createElement("button");
    namePill.className = "personalize-opt-pill";
    namePill.textContent = "Nome";
    namePill.addEventListener("click", () => {
      pwState.skip = false;
      pwState.step = 2;
      pwState.reachedNameStep = true;
      pwRender();
    });

    group.appendChild(skipBtn);
    group.appendChild(namePill);
  } else if (pwState.step === 2) {
    const nameField = document.createElement("div");
    nameField.className = "personalize-field-group";
    const nameLabel = document.createElement("span");
    nameLabel.className = "personalize-field-label";
    nameLabel.textContent = "Nome (máx. 12)";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.maxLength = 12;
    nameInput.className = "personalize-card-input personalize-card-input--name";
    nameInput.value = pwState.name;
    nameInput.addEventListener("input", () => {
      nameInput.value = nameInput.value.replace(/[0-9]/g, "");
      pwState.name = nameInput.value;
      pwUpdatePreview();
    });
    nameField.appendChild(nameLabel);
    nameField.appendChild(nameInput);

    const numberField = document.createElement("div");
    numberField.className = "personalize-field-group";
    const numberLabel = document.createElement("span");
    numberLabel.className = "personalize-field-label";
    numberLabel.textContent = "Número";
    const numberInput = document.createElement("input");
    numberInput.type = "text";
    numberInput.inputMode = "numeric";
    numberInput.maxLength = 2;
    numberInput.className = "personalize-card-input personalize-card-input--number";
    numberInput.value = pwState.number;
    numberInput.addEventListener("input", () => {
      numberInput.value = numberInput.value.replace(/\D/g, "").slice(0, 2);
      pwState.number = numberInput.value;
      pwUpdatePreview();
    });
    numberField.appendChild(numberLabel);
    numberField.appendChild(numberInput);

    group.appendChild(nameField);
    group.appendChild(numberField);
  }
  pwOptionsRow.appendChild(group);

  const addBtn = document.createElement("button");
  addBtn.className = "btn personalize-add-btn";
  addBtn.id = "pwAddBtn";
  addBtn.textContent = "Adicionar";
  addBtn.disabled = !pwCanAdd();
  addBtn.addEventListener("click", () => {
    if (!addBtn.disabled) window.location.href = pwProduto === "guarda-redes" ? "camisola-guarda-redes.html" : "camisola-principal.html";
  });
  pwOptionsRow.appendChild(addBtn);
}

function pwRender() {
  pwStepLabel.textContent = `${pwState.step}/${pwTotalSteps} ${pwStepNames[pwState.step]}`;
  pwNextBtn.classList.toggle("is-disabled", pwState.step >= pwTotalSteps || pwState.skip);
  pwPrevBtn.classList.toggle("is-visible", pwState.step > 1);
  if (pwImg) pwImg.src = pwState.step === 2 ? pwInfo.imgBack : pwInfo.img;
  pwRenderOptions();
  pwUpdatePreview();
  pwUpdateSummary();
}

pwNextBtn.addEventListener("click", () => {
  if (pwState.step < pwTotalSteps) {
    pwState.step += 1;
    pwState.skip = false;
    if (pwState.step === 2) pwState.reachedNameStep = true;
    pwRender();
  }
});

pwPrevBtn.addEventListener("click", () => {
  if (pwState.step > 1) {
    pwState.step -= 1;
    pwRender();
  }
});

pwRender();
