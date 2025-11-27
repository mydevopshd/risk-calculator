alert("JS carregado com sucesso!");


// Utilitário de dinheiro
function formatMoney(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const bankInput = document.getElementById("bank");
  const riskPctInput = document.getElementById("riskPct");
  const winRateInput = document.getElementById("winRate");
  const rrInput = document.getElementById("rr");
  const numTradesInput = document.getElementById("numTrades");

  const errorBox = document.getElementById("simError");
  const resultsBox = document.getElementById("simResults");
  const expBadge = document.getElementById("expBadge");

  const winPerTradeEl = document.getElementById("winPerTrade");
  const lossPerTradeEl = document.getElementById("lossPerTrade");
  const expectedBankEl = document.getElementById("expectedBank");
  const bankAllWinsEl = document.getElementById("bankAllWins");
  const bankAllLossesEl = document.getElementById("bankAllLosses");

  const labelExpectedEl = document.getElementById("labelExpected");
  const labelAllWinsEl = document.getElementById("labelAllWins");
  const labelAllLossesEl = document.getElementById("labelAllLosses");

  const simulateBtn = document.getElementById("simulateBtn");

  simulateBtn.addEventListener("click", () => {
    errorBox.style.display = "none";
    resultsBox.style.display = "none";
    expBadge.textContent = "";
    expBadge.className = "badge";

    const bankValue = parseFloat(bankInput.value);
    const riskPctValue = parseFloat(riskPctInput.value);
    const winRateValue = parseFloat(winRateInput.value);
    const rrValue = parseFloat(rrInput.value);
    const numTradesValue = parseInt(numTradesInput.value, 10);

    // Validações básicas
    if (isNaN(bankValue) || bankValue <= 0) {
      errorBox.textContent = "Informe uma banca inicial válida (maior que zero).";
      errorBox.style.display = "block";
      return;
    }

    if (isNaN(riskPctValue) || riskPctValue <= 0 || riskPctValue > 100) {
      errorBox.textContent = "Informe um risco por trade válido (entre 0 e 100%).";
      errorBox.style.display = "block";
      return;
    }

    if (isNaN(winRateValue) || winRateValue < 0 || winRateValue > 100) {
      errorBox.textContent = "Informe uma taxa de acerto válida (entre 0% e 100%).";
      errorBox.style.display = "block";
      return;
    }

    if (isNaN(rrValue) || rrValue <= 0) {
      errorBox.textContent = "Informe um R:R médio válido (maior que zero).";
      errorBox.style.display = "block";
      return;
    }

    if (isNaN(numTradesValue) || numTradesValue <= 0) {
      errorBox.textContent = "Informe um número de trades válido (maior que zero).";
      errorBox.style.display = "block";
      return;
    }

    // Cálculos
    const p = winRateValue / 100;          // prob de ganho
    const q = 1 - p;                       // prob de perda
    const riskDecimal = riskPctValue / 100;

    const riskAmount = bankValue * riskDecimal;     // $ arriscado por trade
    const winAmountPerTrade = riskAmount * rrValue; // $ ganho no win
    const lossAmountPerTrade = riskAmount;          // $ perdido no loss

    const expectancyR = p * rrValue - q * 1;        // expectativa em R
    const expectancyPct = expectancyR * riskDecimal * 100; // % da banca por trade

    const growthFactor = 1 + (expectancyPct / 100);
    const expectedBank = bankValue * Math.pow(growthFactor, numTradesValue);

    const bankAllWins = bankValue * Math.pow(1 + riskDecimal * rrValue, numTradesValue);
    const bankAllLosses = bankValue * Math.pow(1 - riskDecimal, numTradesValue);

    // Atualiza rótulos com N trades
    labelExpectedEl.textContent =
      `Banca esperada após ${numTradesValue} trades (média)`;
    labelAllWinsEl.textContent =
      `Banca se TODOS os ${numTradesValue} trades forem vencedores`;
    labelAllLossesEl.textContent =
      `Banca se TODOS os ${numTradesValue} trades forem perdedores`;

    // Mostra valores
    winPerTradeEl.textContent = "US$ " + formatMoney(winAmountPerTrade);
    lossPerTradeEl.textContent = "US$ " + formatMoney(lossAmountPerTrade);
    expectedBankEl.textContent = "US$ " + formatMoney(expectedBank);
    bankAllWinsEl.textContent = "US$ " + formatMoney(bankAllWins);
    bankAllLossesEl.textContent = "US$ " + formatMoney(bankAllLosses);

    // Badge de expectativa
    if (expectancyR > 0) {
      expBadge.textContent = "Estratégia com expectativa POSITIVA (matemática a seu favor)";
    } else if (expectancyR < 0) {
      expBadge.textContent = "Estratégia com expectativa NEGATIVA (matemática contra você)";
      expBadge.classList.add("badge-neg");
    } else {
      expBadge.textContent = "Expectativa NEUTRA (banca tende a andar de lado)";
      expBadge.classList.add("badge-neg");
    }

    resultsBox.style.display = "block";
  });
});

