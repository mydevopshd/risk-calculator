document.addEventListener("DOMContentLoaded", () => {

  const formatMoney = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  /* =============================
     MENU - troca de ferramentas
  ============================== */
  const navButtons = document.querySelectorAll(".nav-btn[data-tool]");

  const tools = {
    "tool-banca": document.getElementById("tool-banca"),
    "tool-posicao": document.getElementById("tool-posicao")
  };

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      const tool = btn.getAttribute("data-tool");

      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      Object.keys(tools).forEach(key => {
        tools[key].style.display = (key === tool) ? "block" : "none";
      });

    });
  });


  /* =============================
     FERRAMENTA A - BANCA
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

    const p = winRate / 100;
    const riskDecimal = riskPct / 100;

    const riskAmount = bank * riskDecimal;
    const winAmount = riskAmount * rr;

    const expectancy = (p * rr) - (1 - p);
    const growth = 1 + (expectancy * riskDecimal);

    const expected = bank * Math.pow(growth, N);
    const allWins = bank * Math.pow(1 + (riskDecimal * rr), N);
    const allLosses = bank * Math.pow(1 - riskDecimal, N);

    document.getElementById("labelExpected").innerText =
      `Banca esperada após ${N} trades (média)`;

    document.getElementById("labelAllWins").innerText =
      `Banca se TODOS os ${N} trades forem vencedores`;

    document.getElementById("labelAllLosses").innerText =
      `Banca se TODOS os ${N} trades forem perdedores`;

    document.getElementById("winPerTrade").innerText = "US$ " + formatMoney(winAmount);
    document.getElementById("lossPerTrade").innerText = "US$ " + formatMoney(riskAmount);
    document.getElementById("expectedBank").innerText = "US$ " + formatMoney(expected);
    document.getElementById("bankAllWins").innerText = "US$ " + formatMoney(allWins);
    document.getElementById("bankAllLosses").innerText = "US$ " + formatMoney(allLosses);

    if (expectancy > 0) {
      expBadge.innerText = "Estratégia com expectativa POSITIVA";
    } else {
      expBadge.innerText = "Estratégia com expectativa NEGATIVA / NEUTRA";
      expBadge.classList.add("badge-neg");
    }

    resultsBox.style.display = "block";

  });


  // =============================
// FERRAMENTA B - POSIÇÃO (COM MODOS)
// =============================

let currentMode = "mode1";

function setMode(mode) {
  currentMode = mode;

  const mode1Fields = document.getElementById("mode1Fields");
  const mode2Fields = document.getElementById("mode2Fields");

  const mode1Btn = document.getElementById("mode1Btn");
  const mode2Btn = document.getElementById("mode2Btn");

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

  document.getElementById("result").style.display = "none";
  document.getElementById("error").style.display = "none";
}

// eventos dos modos
document.getElementById("mode1Btn").addEventListener("click", () => setMode("mode1"));
document.getElementById("mode2Btn").addEventListener("click", () => setMode("mode2"));

// cálculo principal
document.getElementById("calcBtn").addEventListener("click", () => {

  const risk = parseFloat(document.getElementById("risk").value);
  const leverage = parseFloat(document.getElementById("leverage").value) || 1;

  const stopPercentInput = document.getElementById("stopPercent");
  const entryInput = document.getElementById("entryPrice");
  const stopPriceInput = document.getElementById("stopPrice");

  const errorBox = document.getElementById("error");
  const resultBox = document.getElementById("result");

  errorBox.style.display = "none";
  resultBox.style.display = "none";

  if (!risk || risk <= 0) {
    errorBox.textContent = "Informe um risco válido em US$";
    errorBox.style.display = "block";
    return;
  }

  let stopPercent;

  if (currentMode === "mode1") {

    const stopRaw = parseFloat(stopPercentInput.value);

    if (!stopRaw || stopRaw <= 0) {
      errorBox.textContent = "Informe o Stop Loss (%)";
      errorBox.style.display = "block";
      return;
    }

    stopPercent = stopRaw;

  } else {

    const entry = parseFloat(entryInput.value);
    const stop = parseFloat(stopPriceInput.value);

    if (!entry || !stop || entry <= 0 || stop <= 0) {
      errorBox.textContent = "Informe entrada e stop corretamente";
      errorBox.style.display = "block";
      return;
    }

    if (entry === stop) {
      errorBox.textContent = "Entrada e stop não podem ser iguais";
      errorBox.style.display = "block";
      return;
    }

    const diff = Math.abs(entry - stop);
    stopPercent = (diff / entry) * 100;
  }

  const positionSize = risk / (stopPercent / 100);
  const margin = positionSize / leverage;

  document.getElementById("stopValue").innerText = stopPercent.toFixed(2) + "%";
  document.getElementById("posValue").innerText = "US$ " + positionSize.toFixed(2);
  document.getElementById("marginValue").innerText = "US$ " + margin.toFixed(2);

  resultBox.style.display = "block";
});


});
