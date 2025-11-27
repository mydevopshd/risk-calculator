document.addEventListener("DOMContentLoaded", () => {

  function formatMoney(value) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const simulateBtn = document.getElementById("simulateBtn");

  simulateBtn.addEventListener("click", () => {

    const bankValue = parseFloat(document.getElementById("bank").value);
    const riskPctValue = parseFloat(document.getElementById("riskPct").value);
    const winRateValue = parseFloat(document.getElementById("winRate").value);
    const rrValue = parseFloat(document.getElementById("rr").value);
    const numTradesValue = parseInt(document.getElementById("numTrades").value);

    const errorBox = document.getElementById("simError");
    const resultsBox = document.getElementById("simResults");
    const expBadge = document.getElementById("expBadge");

    errorBox.style.display = "none";
    resultsBox.style.display = "none";
    expBadge.className = "badge";

    // Validações
    if (!bankValue || bankValue <= 0) {
      errorBox.innerText = "Informe uma banca inicial válida";
      errorBox.style.display = "block";
      return;
    }

    if (!riskPctValue || riskPctValue <= 0) {
      errorBox.innerText = "Informe um risco válido";
      errorBox.style.display = "block";
      return;
    }

    if (winRateValue < 0 || winRateValue > 100) {
      errorBox.innerText = "Informe uma taxa de acerto válida (0 a 100)";
      errorBox.style.display = "block";
      return;
    }

    if (!rrValue || rrValue <= 0) {
      errorBox.innerText = "Informe um R:R válido";
      errorBox.style.display = "block";
      return;
    }

    if (!numTradesValue || numTradesValue <= 0) {
      errorBox.innerText = "Informe o número de trades";
      errorBox.style.display = "block";
      return;
    }

    const p = winRateValue / 100;
    const riskDecimal = riskPctValue / 100;

    const riskAmount = bankValue * riskDecimal;
    const winAmount = riskAmount * rrValue;

    const expectancy = (p * rrValue) - (1 - p);
    const growth = (1 + (expectancy * riskDecimal));

    const expected = bankValue * Math.pow(growth, numTradesValue);
    const allWins = bankValue * Math.pow(1 + (riskDecimal * rrValue), numTradesValue);
    const allLosses = bankValue * Math.pow(1 - riskDecimal, numTradesValue);

    document.getElementById("labelExpected").innerText =
      `Banca esperada após ${numTradesValue} trades (média)`;
    document.getElementById("labelAllWins").innerText =
      `Banca se TODOS os ${numTradesValue} trades forem vencedores`;
    document.getElementById("labelAllLosses").innerText =
      `Banca se TODOS os ${numTradesValue} trades forem perdedores`;

    document.getElementById("winPerTrade").innerText = "US$ " + formatMoney(winAmount);
    document.getElementById("lossPerTrade").innerText = "US$ " + formatMoney(riskAmount);

    document.getElementById("expectedBank").innerText = "US$ " + formatMoney(expected);
    document.getElementById("bankAllWins").innerText = "US$ " + formatMoney(allWins);
    document.getElementById("bankAllLosses").innerText = "US$ " + formatMoney(allLosses);

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
});
