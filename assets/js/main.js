document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     FUNÇÕES DE FORMATAÇÃO
  ============================== */
  function formatMoney(value) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatPercent(value) {
    return value.toFixed(2) + "%";
  }

  /* =============================
     MENU LATERAL (NAVEGAÇÃO)
  ============================== */
  const navButtons = document.querySelectorAll(".nav-btn[data-tool]");
  const toolBancaSection = document.getElementById("tool-banca");
  const toolPosicaoSection = document.getElementById("tool-posicao");
  const toolBreakEvenSection = document.getElementById("tool-breakeven");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedTool = btn.dataset.tool;

      // Estilo ativo no menu
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Mostrar/ocultar seções
      if (selectedTool === "tool-banca") {
        if (toolBancaSection) toolBancaSection.style.display = "block";
        if (toolPosicaoSection) toolPosicaoSection.style.display = "none";
        if (toolBreakEvenSection) toolBreakEvenSection.style.display = "none";
      } else if (selectedTool === "tool-posicao") {
        if (toolBancaSection) toolBancaSection.style.display = "none";
        if (toolPosicaoSection) toolPosicaoSection.style.display = "block";
        if (toolBreakEvenSection) toolBreakEvenSection.style.display = "none";
      } else if (selectedTool === "tool-breakeven") {
        if (toolBancaSection) toolBancaSection.style.display = "none";
        if (toolPosicaoSection) toolPosicaoSection.style.display = "none";
        if (toolBreakEvenSection) toolBreakEvenSection.style.display = "block";
      }
    });
  });

  // Visibilidade inicial
  if (toolBancaSection) toolBancaSection.style.display = "block";
  if (toolPosicaoSection) toolPosicaoSection.style.display = "none";
  if (toolBreakEvenSection) toolBreakEvenSection.style.display = "none";

  /* =============================
     FERRAMENTA A – SIMULADOR DE BANCA
  ============================== */
  const simulateBtn = document.getElementById("simulateBtn");

  if (simulateBtn) {
    simulateBtn.addEventListener("click", () => {
      const bankInput = document.getElementById("bank");
      const riskPctInput = document.getElementById("riskPct");
      const winRateInput = document.getElementById("winRate");
      const rrInput = document.getElementById("rr");
      const numTradesInput = document.getElementById("numTrades");

      const bankValue = parseFloat(bankInput.value);
      const riskPctValue = parseFloat(riskPctInput.value);
      const winRateValue = parseFloat(winRateInput.value);
      const rrValue = parseFloat(rrInput.value);
      const tradesValue = parseInt(numTradesInput.value, 10);

      const errorBox = document.getElementById("simError");
      const resultsBox = document.getElementById("simResults");
      const expBadge = document.getElementById("expBadge");

      errorBox.style.display = "none";
      resultsBox.style.display = "none";
      expBadge.className = "badge";

      if (
        isNaN(bankValue) ||
        isNaN(riskPctValue) ||
        isNaN(winRateValue) ||
        isNaN(rrValue) ||
        isNaN(tradesValue) ||
        bankValue <= 0 ||
        riskPctValue <= 0 ||
        rrValue <= 0 ||
        tradesValue <= 0
      ) {
        errorBox.textContent = "Preencha todos os campos corretamente.";
        errorBox.style.display = "block";
        return;
      }

      const riskDecimal = riskPctValue / 100;
      const riskAmount = bankValue * riskDecimal;
      const winAmount = riskAmount * rrValue;

      const p = winRateValue / 100;
      const expectancy = p * rrValue - (1 - p);
      const growth = 1 + expectancy * riskDecimal;

      const expected = bankValue * Math.pow(growth, tradesValue);
      const allWins = bankValue * Math.pow(1 + riskDecimal * rrValue, tradesValue);
      const allLosses = bankValue * Math.pow(1 - riskDecimal, tradesValue);

      document.getElementById("labelExpected").innerText =
        `Banca esperada após ${tradesValue} trades`;

      document.getElementById("labelAllWins").innerText =
        `Banca se TODOS os ${tradesValue} trades forem vencedores`;

      document.getElementById("labelAllLosses").innerText =
        `Banca se TODOS os ${tradesValue} trades forem perdedores`;

      document.getElementById("winPerTrade").innerText =
        "US$ " + formatMoney(winAmount);

      document.getElementById("lossPerTrade").innerText =
        "US$ " + formatMoney(riskAmount);

      document.getElementById("expectedBank").innerText =
        "US$ " + formatMoney(expected);

      document.getElementById("bankAllWins").innerText =
        "US$ " + formatMoney(allWins);

      document.getElementById("bankAllLosses").innerText =
        "US$ " + formatMoney(allLosses);

      if (expectancy > 0) {
        expBadge.textContent = "Estratégia com expectativa POSITIVA";
      } else if (expectancy < 0) {
        expBadge.textContent = "Estratégia com expectativa NEGATIVA";
        expBadge.classList.add("badge-neg");
      } else {
        expBadge.textContent = "Expectativa NEUTRA";
      }

      resultsBox.style.display = "block";
    });
  }

  /* =============================
     FERRAMENTA B – CALCULADORA DE POSIÇÃO
  ============================== */

  let currentMode = "mode1";

  const mode1Btn = document.getElementById("mode1Btn");
  const mode2Btn = document.getElementById("mode2Btn");
  const mode1Fields = document.getElementById("mode1Fields");
  const mode2Fields = document.getElementById("mode2Fields");

  const resultPosBox = document.getElementById("result");
  const errorPosBox = document.getElementById("error");

  function setMode(mode) {
    currentMode = mode;

    if (!mode1Fields || !mode2Fields || !mode1Btn || !mode2Btn) {
      return;
    }

    if (mode === "mode1") {
      mode1Fields.style.display = "flex";
      mode2Fields.style.display = "none";

      mode1Btn.classList.add("active");
      mode2Btn.classList.remove("active");
    } else {
      mode1Fields.style.display = "none";
      mode2Fields.style.display = "flex";

      mode2Btn.classList.add("active");
      mode1Btn.classList.remove("active");
    }

    if (resultPosBox) resultPosBox.style.display = "none";
    if (errorPosBox) errorPosBox.style.display = "none";
  }

  if (mode1Btn && mode2Btn) {
    mode1Btn.addEventListener("click", () => setMode("mode1"));
    mode2Btn.addEventListener("click", () => setMode("mode2"));
  }

  setMode("mode1");

  const calcBtn = document.getElementById("calcBtn");

  if (calcBtn) {
    calcBtn.addEventListener("click", () => {
      const riskInput = document.getElementById("risk");
      const leverageInput = document.getElementById("leverage");
      const stopPercentInput = document.getElementById("stopPercent");
      const entryInput = document.getElementById("entryPrice");
      const stopPriceInput = document.getElementById("stopPrice");

      if (!errorPosBox || !resultPosBox) return;

      errorPosBox.style.display = "none";
      resultPosBox.style.display = "none";

      const riskValue = parseFloat(riskInput.value);
      let leverageValue = parseFloat(leverageInput.value);

      if (isNaN(riskValue) || riskValue <= 0) {
        errorPosBox.textContent = "Informe um risco válido em US$.";
        errorPosBox.style.display = "block";
        return;
      }

      if (isNaN(leverageValue) || leverageValue <= 0) {
        leverageValue = 1;
      }

      let stopPercentValue;

      if (currentMode === "mode1") {
        const stopRaw = parseFloat(stopPercentInput.value);

        if (isNaN(stopRaw) || stopRaw <= 0) {
          errorPosBox.textContent = "Informe um Stop Loss (%) válido.";
          errorPosBox.style.display = "block";
          return;
        }

        stopPercentValue = stopRaw;
      } else {
        const entryValue = parseFloat(entryInput.value);
        const stopPriceValue = parseFloat(stopPriceInput.value);

        if (
          isNaN(entryValue) ||
          isNaN(stopPriceValue) ||
          entryValue <= 0 ||
          stopPriceValue <= 0
        ) {
          errorPosBox.textContent = "Informe entrada e stop corretamente.";
          errorPosBox.style.display = "block";
          return;
        }

        if (entryValue === stopPriceValue) {
          errorPosBox.textContent = "Entrada e stop não podem ser iguais.";
          errorPosBox.style.display = "block";
          return;
        }

        const diff = Math.abs(entryValue - stopPriceValue);
        stopPercentValue = (diff / entryValue) * 100;
      }

      if (stopPercentValue <= 0) {
        errorPosBox.textContent = "Stop calculado inválido. Verifique os valores.";
        errorPosBox.style.display = "block";
        return;
      }

      const positionSize = riskValue / (stopPercentValue / 100);
      const marginValue = positionSize / leverageValue;

      document.getElementById("stopValue").textContent =
        formatPercent(stopPercentValue);

      document.getElementById("posValue").textContent =
        "US$ " + formatMoney(positionSize);

      document.getElementById("marginValue").textContent =
        "US$ " + formatMoney(marginValue);

      resultPosBox.style.display = "block";
    });
  }
});
