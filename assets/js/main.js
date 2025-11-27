document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // NAVEGAÇÃO DO MENU
  // =========================
  const navButtons = document.querySelectorAll(".nav-btn");
  const tools = {
    "tool-banca": document.getElementById("tool-banca"),
    "tool-posicao": document.getElementById("tool-posicao")
  };

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tool = btn.dataset.tool;
      if (!tool) return;

      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      for (let key in tools) {
        tools[key].style.display = (key === tool) ? "block" : "none";
      }
    });
  });

  function formatMoney(value) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // =========================
  // FERRAMENTA A - Banca
  // =========================
  const simulateBtn = document.getElementById("simulateBtn");

  simulateBtn.addEventListener("click", () => {

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

    expBadge.innerText = expectancy > 0
      ? "Estratégia com expectativa POSITIVA"
      : expectancy < 0
      ? "Estratégia com expectativa NEGATIVA"
      : "Expectativa NEUTRA";

    resultsBox.style.display = "block";
  });

  // =========================
  // FERRAMENTA B - Posição
  // =========================
  const calcBtn = document.getElementById("calcPositionBtn");

  calcBtn.addEventListener("click", () => {

    const riskUSD = parseFloat(document.getElementById("riskUSD").value);
    const stopPct = parseFloat(document.getElementById("stopPct").value);
    const leverage = parseFloat(document.getElementById("leverage").value) || 1;
    const entryPrice = parseFloat(document.getElementById("entryPrice").value);

    const errorBox = document.getElementById("posError");
    const resultsBox = document.getElementById("posResults");

    errorBox.style.display = "none";
    resultsBox.style.display = "none";

    if (!riskUSD || !stopPct || stopPct <= 0) {
      errorBox.innerText = "Informe risco e stop corretamente.";
      errorBox.style.display = "block";
      return;
    }

    const positionSize = riskUSD / (stopPct / 100);
    const margin = positionSize / leverage;

    let qty = "—";
    if (entryPrice) {
      qty = positionSize / entryPrice;
    }

    document.getElementById("positionSize").innerText =
      "US$ " + formatMoney(positionSize);

    document.getElementById("marginNeeded").innerText =
      "US$ " + formatMoney(margin);

    document.getElementById("positionQty").innerText =
      entryPrice ? qty.toFixed(6) : "Informe o preço";

    resultsBox.style.display = "block";

  });
});
