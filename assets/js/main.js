document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     FORMATAÇÃO
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

      // Muda visual do botão
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Mostra a ferramenta correta
      Object.keys(tools).forEach(key => {
        tools[key].style.display = (key === tool) ? "block" : "none";
      });

    });
  });


  /* =============================
     FERRAMENTA A - SIMULADOR DE BANCA
  ============================== */
  document.getElementById("simulateBtn").addEventListener("click", () => {

    const bank = parseFloat(document.getElementById("bank").value);
    const riskPct = parseFloat(document.getElementById("riskPct").value);
    const winRate = parseFloat(document.getElementById("winRate").value);
    const rr = parseFloat(document.getElementById("rr").value);
    const N = parseInt(document.getElementById("numTrades").value);

    const errorBox = document.getElementById("simError");
    const resultsBox = document.getElementById("simResults");
    const expBadge = document.getElementById("expBadge");

    errorBox.style.display = "none";
    resultsBox.style.display = "none";
    expBadge.className = "badge";

    if (!bank || !riskPct || !rr || !N) {
      errorBox.innerText = "Preencha todos os campos corretamente.";
      errorBox.style.display = "block";
      return;
    }

    const riskDecimal = riskPct / 100;
    const riskAmount = bank * riskDecimal;
    const winAmount = riskAmount * rr;

    const p = winRate / 100;
    const expectancy = (p * rr) - (1 - p);
    const growth = 1 + (expectancy * riskDecimal);

    const expected = bank * Math.pow(growth, N);
    const allWins = bank * Math.pow(1 + (riskDecimal * rr), N);
    const allLosses = bank * Math.pow(1 - riskDecimal, N);

    document.getElementById("labelExpected").innerText =
      `Banca esperada após ${N} trades`;

    document.getElementById("labelAllWins").innerText =
      `Banca se TODOS os ${N} trades forem vencedores`;

    document.getElementById("labelAllLosses").innerText =
      `Banca se TODOS os ${N} trades forem perdedores`;

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
      expBadge.innerText = "Estratégia com expectativa POSITIVA";
    } else if (expectancy < 0) {
      expBadge.innerText = "Estratégia com expectativa NEGATIVA";
      expBadge.classList.add("badge-neg");
    } else {
      expBadge.innerText = "Expectativa NEUTRA";
    }

    resultsBox.style.display = "block";
  });



  /* =============================
     FERRAMENTA B - POSIÇÃO
  ============================== */

  let currentMode = "mode1";

  const mode1Btn = document.getElementById("mode1Btn");
  const mode2Btn = document.getElementById("mode2Btn");

  const mode1Fields = document.getElementById("mode1Fields");
  const mode2Fields = document.getElementById("mode2Fields");

  const resultBox = document.getElementById("result");
  const errorBox = document.getElementById("error");

  // Botões de modo
  mode1Btn.addEventListener("click", () => {
    currentMode = "mode1";
    mode1Btn.classList.add("active");
    mode2Btn.classList.remove("active");
    mode1Fields.style.display = "flex";
    mode2Fields.style.display = "none";

    resultBox.style.display = "none";
    errorBox.style.display = "none";
  });

  mode2Btn.addEventListener("click", () => {
    currentMode = "mode2";
    mode2Btn.classList.add("active");
    mode1Btn.classList.remove("active");
    mode2Fields.style.display = "flex";
    mode1Fields.style.display = "none";

    resultBox.style.display = "none";
    errorBox.style.display = "none";
  });


  // BOTÃO CALCULAR POSIÇÃO
  document.getElementById("calcBtn").addEventListener("click", () => {

    const risk = parseFloat(document.getElementById("risk").value);
    const leverage = parseFloat(document.getElementById("leverage").value) || 1;

    const stopPercentInput = document.getElementById("stopPercent");
    const entryInput = document.getElementById("entryPrice");
    const stopPriceInput = document.getElementById("stopPrice");

    errorBox.style.display = "none";
    resultBox.style.display = "none";

    if (!risk || risk <= 0) {
      errorBox.innerText = "Informe um risco válido em US$";
      errorBox.style.display = "block";
      return;
    }

    let stopPercent;

    if (currentMode === "mode1") {

      const stopRaw = parseFloat(stopPercentInput.value);

      if (!stopRaw || stopRaw <= 0) {
        errorBox.innerText = "Informe um Stop Loss (%) válido";
        errorBox.style.display = "block";
        return;
      }

      stopPercent = stopRaw;

    } else {

      const entry = parseFloat(entryInput.value);
      const stop = parseFloat(stopPriceInput.value);

      if (!entry || !stop || entry <= 0 || stop <= 0) {
        errorBox.innerText = "Informe preço de entrada e stop corretamente";
        errorBox.style.display = "block";
        return;
      }

      if (entry === stop) {
        errorBox.innerText = "Entrada e stop não podem ser iguais";
        errorBox.style.display = "block";
        return;
      }

      stopPercent = Math.abs(entry - stop) / entry * 100;
    }

    const positionSize = risk / (stopPercent / 100);
    const margin = positionSize / leverage;

    document.getElementById("stopValue").innerText =
      formatPercent(stopPercent);

    document.getElementById("posValue").innerText =
      "US$ " + formatMoney(positionSize);

    document.getElementById("marginValue").innerText =
      "US$ " + formatMoney(margin);

    resultBox.style.display = "block";
  });

});
