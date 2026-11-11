module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { renda = 3000, abaterDizimo = false, anos = 15, taxaAnual = 10 } = req.body || {};

  const valorDizimo = abaterDizimo ? renda * 0.10 : 0;
  const rendaLiquida = renda - valorDizimo;

  const despesasPrincipais = rendaLiquida * 0.50;
  const lazer = rendaLiquida * 0.30;
  const investimentoMensal = rendaLiquida * 0.20;

  const meses = anos * 12;
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  
  let totalInvestido = renda;
  let saldoTotal = renda;

  for (let i = 0; i < meses; i++) {
    saldoTotal = (saldoTotal + investimentoMensal) * (1 + taxaMensal);
    totalInvestido += investimentoMensal;
  }

  const totalJuros = saldoTotal - totalInvestido;

  res.status(200).json({
    rendaBruta: renda,
    dizimoAbatido: valorDizimo,
    rendaLiquida,
    potes: {
      despesasPrincipais: { percentual: 50, valor: despesasPrincipais },
      lazer: { percentual: 30, valor: lazer },
      investimento: { percentual: 20, valor: investimentoMensal }
    },
    simulacao: {
      anos,
      aporteInicial: renda,
      aporteMensal: investimentoMensal,
      totalInvestido: Number(totalInvestido.toFixed(2)),
      totalJuros: Number(totalJuros.toFixed(2)),
      valorFinal: Number(saldoTotal.toFixed(2))
    }
  });
};
