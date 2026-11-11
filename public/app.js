document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const rendaInput = document.getElementById('input-renda');
  const dizimoToggle = document.getElementById('toggle-dizimo');
  const simInicialInput = document.getElementById('sim-inicial');
  const simAnosInput = document.getElementById('sim-anos');
  const timeBadge = document.getElementById('time-badge');

  // Alternar entre as telas
  const navButtons = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.screen');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreen = btn.getAttribute('data-screen');
      
      navButtons.forEach(b => b.classList.remove('active'));
      screens.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const screenEl = document.getElementById(targetScreen);
      if (screenEl) screenEl.classList.add('active');
    });
  });

  // Função de cálculo local instantâneo
  function calcularValores() {
    // 1. Ler valores de entrada da Tela 1
    const renda = parseFloat(rendaInput.value) || 0;
    const abaterDizimo = dizimoToggle ? dizimoToggle.checked : false;

    // 2. Cálculo do Dízimo e Potes (Regra 50/30/20)
    const valorDizimo = abaterDizimo ? renda * 0.10 : 0;
    const rendaLiquida = renda - valorDizimo;

    const despesasPrincipais = rendaLiquida * 0.50;
    const lazer = rendaLiquida * 0.30;
    const investimentoMensal = rendaLiquida * 0.20;

    // Atualizar UI da Tela 1
    const dizimoText = document.getElementById('dizimo-valor-text');
    if (dizimoText) {
      dizimoText.innerText = `R$ ${valorDizimo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} descontado`;
    }

    const elDespesas = document.getElementById('val-despesas');
    if (elDespesas) {
      elDespesas.innerText = `R$ ${despesasPrincipais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const elLazer = document.getElementById('val-lazer');
    if (elLazer) {
      elLazer.innerText = `R$ ${lazer.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const elInvest = document.getElementById('val-investimento');
    if (elInvest) {
      elInvest.innerText = `R$ ${investimentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // 3. Ler valores de entrada da Tela 2
    const aporteInicial = parseFloat(simInicialInput.value) || 0;
    const anos = parseInt(simAnosInput.value) || 15;
    const taxaAnual = 10; // 10% a.a.

    if (timeBadge) {
      timeBadge.innerText = `${anos} ANOS`;
    }

    // Cálculo de Juros Compostos
    const meses = anos * 12;
    const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;

    let totalInvestido = aporteInicial;
    let saldoTotal = aporteInicial;

    for (let i = 0; i < meses; i++) {
      saldoTotal = (saldoTotal + investimentoMensal) * (1 + taxaMensal);
      totalInvestido += investimentoMensal;
    }

    const totalJuros = Math.max(0, saldoTotal - totalInvestido);

    // Atualizar UI da Tela 2
    const resFinal = document.getElementById('res-final');
    if (resFinal) {
      resFinal.innerText = `R$ ${saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const resSuor = document.getElementById('res-suor');
    if (resSuor) {
      resSuor.innerText = `R$ ${totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const resJuros = document.getElementById('res-juros');
    if (resJuros) {
      resJuros.innerText = `R$ ${totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  // Ouvintes de evento instantâneos
  if (rendaInput) rendaInput.addEventListener('input', calcularValores);
  if (dizimoToggle) dizimoToggle.addEventListener('change', calcularValores);
  if (simAnosInput) simAnosInput.addEventListener('input', calcularValores);
  if (simInicialInput) simInicialInput.addEventListener('input', calcularValores);

  // Executa o primeiro cálculo imediatamente
  calcularValores();
});
