document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     FUNÇÕES DE FORMATAÇÃO
  ============================== */
  function formatMoney(value) {
    if (isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatPercent(value) {
    if (isNaN(value)) return "0.00%";
    return value.toFixed(2) + "%";
  }

  /* =============================
     MENU LATERAL (FERRAMENTAS)
  ============================== */
  const btnSimulator = document.getElementById("btnSimulator");
  const btnPosition = document.getElementById("btnPosition");

  const simulatorSection = document.getElementById("simulatorSection");
  const positionSection = document.getElementById("positionSection");

  function showSimulator() {
    btnSimulator.classList.add("active");
    btnPosition.classList.remove("active");
    simulatorSection.style.display = "block";
    positionSection.style.display = "none";
  }

  function showPositionCalculator() {
    btnPosition.classList.add("active");
    btnSimulator.classList.remove("active");
    simulatorSection.style.display = "none";
    positionSection.style.display = "block";
  }

  if (btnSimulator && btnPosition) {
    btnSimulator.addEventListener("click", showSimulator);
    btnPosition.addEventListener("click", showPositionCalculator);
  }

  // Estado inicial
  showSimulator();

  /* =============================
     FERRAMENTA A – SIMULADOR DE BANCA
  ============================== */
  const runSimulationBtn = document.getElementById("runSimulation");

  if (runSimulationBtn) {
    runSimulationBtn.addEventListener("click", () => {
      const bankInput = document.getElementById("simInitial");
      const riskPctInput = document.getElementById("simRisk");
      const winRateInput = document.getElementById("simWinRate");
      const rrInput = document.getElementById("simRR");
      const tradesInput = document.getElementById("simTrades");

      const bank = parseFloat(bankInput.value);
      const riskPct = parseFloat(riskPctInput.value);
      const winRate = parseFloat(winRateInput.value);
      const rr = parseFloat(rrInput.value);
      const trades = parseInt(tradesInput.value, 10);

      const errorBox = document.getElementById("simulatorError");
      const resultsBox = document.getElementById("simulatorResults");
      const badge = document.getElementById("expectancyBadge");

      errorBox.style.display = "none";
      resultsBox.style.display = "none";
      badge.className = "badge";

      if (
        isNaN(bank) || bank <= 0 ||
        isNaN(riskPct) || riskPct <= 0 ||
        isNaN(winRate) ||
        isNaN(rr) || rr <= 0 ||
        isNaN(trades) || trades <= 0
      ) {
        errorBox.textContent = "Preencha todos os campos com valores válidos.";
        errorBox.style.display = "block";
        return;
      }

      const riskDecimal = riskPct / 100;
      const riskAmount = bank * riskDecimal;
      const winAmount = riskAmount * rr;

      const p = winRate / 100;
      const expectancy = p * rr - (1 - p);
      const growth = 1 + expectancy * riskDecimal;

      const expectedBank = bank * Math.pow(growth, trades);
      const allWinsBank = bank * Math.pow(1 + riskDecimal * rr, trades);
      const allLossesBank = bank * Math.pow(1 - riskDecimal, trades);

      // Labels com N trades
      document.getElementById("expectedLabel").textContent =
        `Banca esperada após ${trades} trades`;
      document.getElementById("allWinLabel").textContent =
        `Banca se todos os ${trades} trades forem vencedores`;
      document.getElementById("allLossLabel").textContent =
        `Banca se todos os ${trades} trades forem perdedores`;

      // Valores
      document.getElementById("winValue").textContent =
        "US$ " + formatMoney(winAmount);
      document.getElementById("lossValue").textContent =
        "US$ " + formatMoney(riskAmount);

      document.getElementById("expectedBank").textContent =
        "US$ " + formatMoney(expectedBank);
      document.getElementById("allWinBank").textContent =
        "US$ " + formatMoney(allWinsBank);
      document.getElementById("allLossBank").textContent =
        "US$ " + formatMoney(allLossesBank);

      // Expectativa
      if (expectancy > 0) {
        badge.textContent = "Estratégia com expectativa POSITIVA";
      } else if (expectancy < 0) {
        badge.textContent = "Estratégia com expectativa NEGATIVA";
        badge.classList.add("badge-neg");
      } else {
        badge.textContent = "Expectativa NEUTRA";
      }

      resultsBox.style.display = "block";
    });
  }

  /* =============================
     FERRAMENTA B – CALCULADORA DE POSIÇÃO
  ============================== */

  let currentMode = "mode1"; // mode1 = stop em %, mode2 = entrada+stop

  const mode1Btn = document.getElementById("mode1Btn");
  const mode2Btn = document.getElementById("mode2Btn");
  const mode1Fields = document.getElementById("mode1Fields");
  const mode2Fields = document.getElementById("mode2Fields");

  function setMode(mode) {
    currentMode = mode;

    if (!mode1Fields || !mode2Fields || !mode1Btn || !mode2Btn) return;

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

    const errorBox = document.getElementById("positionError");
    const resultBox = document.getElementById("positionResults");
    if (errorBox) errorBox.style.display = "none";
    if (resultBox) resultBox.style.display = "none";
  }

  if (mode1Btn && mode2Btn) {
    mode1Btn.addEventListener("click", () => setMode("mode1"));
    mode2Btn.addEventListener("click", () => setMode("mode2"));
  }

  // Modo padrão
  setMode("mode1");

  const calcPositionBtn = document.getElementById("calcPosition");

  if (calcPositionBtn) {
    calcPositionBtn.addEventListener("click", () => {
      const riskInput = document.getElementById("posRisk");
      const leverageInput = document.getElementById("posLeverage");
      const stopPercentInput = document.getElementById("posStopPercent");
      const entryInput = document.getElementById("posEntry");
      const stopPriceInput = document.getElementById("posStop");

      const errorBox = document.getElementById("positionError");
      const resultBox = document.getElementById("positionResults");

      errorBox.style.display = "none";
      resultBox.style.display = "none";

      const risk = parseFloat(riskInput.value);
      let leverage = parseFloat(leverageInput.value);

      if (isNaN(risk) || risk <= 0) {
        errorBox.textContent = "Informe um valor de risco válido em US$.";
        errorBox.style.display = "block";
        return;
      }

      if (isNaN(leverage) || leverage <= 0) {
        leverage = 1;
      }

      let stopPercent;

      if (currentMode === "mode1") {
        // Stop em %
        const stopRaw = parseFloat(stopPercentInput.value);
        if (isNaN(stopRaw) || stopRaw <= 0) {
          errorBox.textContent = "Informe um valor de Stop Loss (%) válido.";
          errorBox.style.display = "block";
          return;
        }
        stopPercent = stopRaw;
      } else {
        // Entrada + stop em preço
        const entry = parseFloat(entryInput.value);
        const stopPrice = parseFloat(stopPriceInput.value);

        if (isNaN(entry) || entry <= 0) {
          errorBox.textContent = "Informe um preço de entrada válido.";
          errorBox.style.display = "block";
          return;
        }

        if (isNaN(stopPrice) || stopPrice <= 0) {
          errorBox.textContent = "Informe um preço de stop válido.";
          errorBox.style.display = "block";
          return;
        }

        if (entry === stopPrice) {
          errorBox.textContent = "Entrada e stop não podem ser iguais.";
          errorBox.style.display = "block";
          return;
        }

        const diff = Math.abs(entry - stopPrice);
        stopPercent = (diff / entry) * 100;
      }

      if (stopPercent <= 0) {
        errorBox.textContent = "Stop calculado inválido. Verifique os valores.";
        errorBox.style.display = "block";
        return;
      }

      const positionSize = risk / (stopPercent / 100); // valor nocional
      const marginNeeded = positionSize / leverage;

      document.getElementById("stopCalc").textContent =
        formatPercent(stopPercent);

      document.getElementById("positionCalc").textContent =
        "US$ " + formatMoney(positionSize);

      document.getElementById("marginCalc").textContent =
        "US$ " + formatMoney(marginNeeded);

      resultBox.style.display = "block";
    });
  }
});
