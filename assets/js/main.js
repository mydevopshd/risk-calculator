document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     FUNÇÕES DE FORMATAÇÃO
  ============================== */
  const formatMoney = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatPercent = (value) => {
    return value.toFixed(2) + "%";
  };


  /* =============================
     MENU LATERAL (NAVEGAÇÃO)
  ============================== */
  const navButtons = document.querySelectorAll(".nav-btn[data-tool]");

  const tools = {
    "tool-banca": document.getElementById("tool-banca"),
    "tool-posicao": document.getElementById("tool-posicao")
  };

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      const tool = btn.dataset.tool;

      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      Object.keys(tools).forEach(key => {
        tools[key].style.display = (key === tool) ? "block" : "none";
      });

    });
  });


  /* =============================
     FERRAMENTA A – SIMULADOR
  ============================== */
  const simulateBtn = document.getElementById("simulateBtn");

  if (simulateBtn) {
    simulateBtn.addEventListener("click", () => {

      const bankValue     = parseFloat(document.getElementById("bank").value);
      const riskPctValue  = parseFloat(document.getElementById("riskPct").value);
      const winRateValue  = parseFloat(document.getElementById("winRate").value);
      const rrValue        = parseFloat(document.getElementById("rr").value);
      const tradesValue   = parseInt(document.getElementById("numTrades").value);

      const errorBox   = document.getElementById("simError");
      const resultsBox = document.getElementById("simResults");
      const expBadge   = document.getElementById("expBadge");

      errorBox.style.display = "none";
      resultsBox.style.display = "none";
      expBadge.className = "badge";

      if (!bankValue || !riskPctValue || !rrValue || !tradesValue) {
        errorBox.textContent = "Preencha todos os campos corretamente.";
        errorBox.style.display = "block";
        return;
      }

      const riskDecimal = riskPctValue / 100;
      const riskAmount  = bankValue * riskDecimal;
      const winAmount   = riskAmount * rrValue;

      const p = winRateValue / 100;
      const expectancy = (p * rrValue) - (1 - p);
      const growth     = 1 + (expectancy * riskDecimal);

      const expected   = bankValue * Math.pow(growth, tradesValue);
      const allWins    = bankValue * Math.pow(1 + (riskDecimal * rrValue), tradesValue);
      const allLosses  = bankValue * Math.pow(1 - riskDecimal, tradesValue);

      document.getElementById("labelExpected").innerText =
        `Banca esperada após ${tradesValue} trades`;

      document.getElementById("labelAllWins").innerText =
        `Banca se TODOS os ${tradesValue} trades forem vencedores`;

      document.getElementById("labelAllLosses").innerText =
        `Banca se TODOS os ${tradesValue} trades forem perdedores`;

      document.getElementById("winPerTrade").innerText   =
        "US$ " + formatMoney(winAmount);

      document.getElementById("lossPerTrade").innerText  =
        "US$ " + formatMoney(riskAmount);

      document.getElementById("expectedBank").innerText  =
        "US$ " + formatMoney(expected);

      document.getElementById("bankAllWins").innerText   =
        "US$ " + formatMoney(allWins);

      document.getElementById("bankAllLosses").innerText =
        "US$ " + formatMoney(allLosses);

      if (expectancy > 0) {
        expBadge.innerText = "Estratégia com expectativa POSITIVA";
      } else if (expectancy < 0) {
        expBadge.innerText = "Estratégia com expectativa NEGATIVA";
        expBadge.classList.add("badge-neg");
      } else {
        expBadge.innerText = "Expectativa NEUTRA";
      }

      resultsBox.style.display = "block";

    });
  }


  /* =============================
     FERRAMENTA B – POSIÇÃO
  ============================== */

  let currentMode = "mode1";

  const mode1Btn = document.getElementById("mode1Btn");
  const mode2Btn = document.getElementById("mode2Btn");

  const mode1Fields = document.getElementById("mode1Fields");
  const mode2Fields = document.getElementById("mode2Fields");

  const resultPos = document.getElementById("result");
  const errorPos  = document.getElementById("error");

  if (mode1Btn && mode2Btn) {

    mode1Btn.addEventListener("click", () => {
      currentMode = "mode1";

      mode1Btn.classList.add("active");
      mode2Btn.classList.remove("active");

      mode1Fields.style.display = "flex";
      mode2Fields.style.display = "none";

      resultPos.style.display = "none";
      errorPos.style.display = "none";
    });

    mode2Btn.addEventListener("click", () => {
      currentMode = "mode2";

      mode2Btn.classList.add("active");
      mode1Btn.classList.remove("active");

      mode2Fields.style.display = "flex";
      mode1Fields.style.display = "none";

      resultPos.style.display = "none";
      errorPos.style.display = "none";
    });

  }


  /* =============================
     CÁLCULO DA POSIÇÃO
  ============================== */
  const calcBtn = document.getElementById("calcBtn");

  if (calcBtn) {

    calcBtn.addEventListener("click", () => {

      const riskInput       = document.getElementById("risk");
      const leverageInput   = document.getElementById("leverage");
      const stopPctInput     = document.getElementById("stopPercent");
      const entryInput       = document.getElementById("entryPrice");
      const stopPriceInput   = document.getElementById("stopPrice");

      const riskValue     = parseFloat(riskInput.value);
      const leverageValue = parseFloat(leverageInput.value) || 1;

      errorPos.style.display  = "none";
      resultPos.style.display = "none";

      if (!riskValue || riskValue <= 0) {
        errorPos.textContent = "Informe um risco válido em US$";
        errorPos.style.display = "block";
        return;
      }

      let stopPercentValue;

      if (currentMode === "mode1") {

        const stopRaw = parseFloat(stopPctInput.value);

        if (!stopRaw || stopRaw <= 0) {
          errorPos.textContent = "Informe um Stop Loss (%) válido";
          errorPos.style.display = "block";
          return;
        }

        stopPercentValue = stopRaw;

      } else {

        const entry = parseFloat(entryInput.value);
        const stop  = parseFloat(stopPriceInput.value);

        if (!entry || !stop || entry <= 0 || stop <= 0) {
          errorPos.textContent = "Informe entrada e stop corretamente";
          errorPos.style.display = "block";
          return;
        }

        if (entry === stop) {
          errorPos.textContent = "Entrada e stop não podem ser iguais";
          errorPos.style.display = "block";
          return;
        }

        stopPercentValue = Math.abs(entry - stop) / entry * 100;
      }

      const positionSize = riskValue / (stopPercentValue / 100);
      const margin       = positionSize / leverageValue;

      document.getElementById("stopValue").innerText   =
        formatPercent(stopPercentValue);

      document.getElementById("posValue").innerText    =
        "US$ " + formatMoney(positionSize);

      document.getElementById("marginValue").innerText =
        "US$ " + formatMoney(margin);

      resultPos.style.display = "block";

    });

  }

});
