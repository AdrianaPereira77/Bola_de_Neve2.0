document.addEventListener('DOMContentLoaded', () => {
  const rendaInput = document.getElementById('input-renda');
  const dizimoToggle = document.getElementById('toggle-dizimo');
  const simInicialInput = document.getElementById('sim-inicial');
  const simAnosInput = document.getElementById('sim-anos');
  const timeBadge = document.getElementById('time-badge');

  const navButtons = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.screen');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreen = btn.getAttribute('data-screen');
      
      navButtons.forEach(b => b.classList.remove('active'));
      screens.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetScreen).classList.add('active');
    });
  });

  async function calcularValores() {
    const renda = parseFloat(rendaInput.value) || 0;
    const abaterDizimo = dizimoToggle.checked;
    const anos = parseInt(simAnosInput.value) || 15;

    timeBadge.innerText = `${anos} ANOS`;

    try {
      const response = await fetch('/api/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renda, abaterDizimo, anos })
      });

      const data = await response.json();
      atualizarInterface(data);
    } catch (err) {
      console.error("Erro ao chamar API:", err);
    }
  }

  function atualizarInterface(data) {
    document.getElementById('dizimo-valor-text').innerText = 
      `R$ ${data.dizimoAbatido.toFixed(2)} descontado`;
    
    document.getElementById('val-despesas').innerText = 
      `R$ ${data.potes.despesasPrincipais.valor.toFixed(2)}`;
    
    document.getElementById('val-lazer').innerText = 
      `R$ ${data.potes.lazer.valor.toFixed(2)}`;
    
    document.getElementById('val-investimento').innerText = 
      `R$ ${data.potes.investimento.valor.toFixed(2)}`;

    document.getElementById('res-final').innerText = 
      `R$ ${data.simulacao.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    document.getElementById('res-suor').innerText = 
      `R$ ${data.simulacao.totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    document.getElementById('res-juros').innerText = 
      `R$ ${data.simulacao.totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  rendaInput.addEventListener('input', calcularValores);
  dizimoToggle.addEventListener('change', calcularValores);
  simAnosInput.addEventListener('input', calcularValores);
  simInicialInput.addEventListener('input', calcularValores);

  calcularValores();
});
