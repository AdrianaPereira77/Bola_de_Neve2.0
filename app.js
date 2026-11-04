/* Bola de Neve - camada funcional local (sem integração bancária real) */
(() => {
  'use strict';
  const KEY = 'bolaDeNeve.app.v2';
  const defaults = { income: 0, reserve: 0, reserveGoal: 30000, xp: 0, debts: [], strategy: 'snowball', tithe: false, openFinance: false, allocation: { mission: 50, lifestyle: 30, future: 20 }, transactions: [] };
  const clone = x => JSON.parse(JSON.stringify(x));
  function load() {
    try { const saved = JSON.parse(localStorage.getItem(KEY) || '{}'); return { ...clone(defaults), ...saved, allocation: { ...defaults.allocation, ...(saved.allocation || {}) }, debts: Array.isArray(saved.debts) ? saved.debts : [], transactions: Array.isArray(saved.transactions) ? saved.transactions : [] }; }
    catch { return clone(defaults); }
  }
  let state = load();
  const money = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const num = v => Number(String(v).replace(/\./g, '').replace(',', '.')) || 0;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const persist = () => { localStorage.setItem(KEY, JSON.stringify(state)); render(); };
  const toast = msg => { let el = document.getElementById('bn-global-toast'); if (!el) { el = document.createElement('div'); el.id = 'bn-global-toast'; document.body.append(el); } el.textContent = msg; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2600); };
  const totalDebt = () => state.debts.reduce((a,d) => a + d.balance, 0);
  const sortedDebts = () => [...state.debts].filter(d => d.balance > 0).sort((a,b) => state.strategy === 'avalanche' ? b.rate-a.rate : a.balance-b.balance);
  function panel() {
    const page = location.pathname.split('/').pop();
    const isDebt = page === 'guerra.html';
    const isShield = page === 'escudo.html';
    const title = isDebt ? 'Central de dívidas' : isShield ? 'Base segura e evolução' : 'Central de distribuição';
    const el = document.createElement('section'); el.id = 'bn-functional-panel'; el.className = 'bn-panel';
    el.innerHTML = `<div class="bn-panel-head"><div><span class="bn-kicker">PAINEL FUNCIONAL</span><h2>${title}</h2><p>Edite os valores abaixo. As alterações ficam salvas neste navegador e aparecem nas outras telas.</p></div><span class="bn-local-tag">SALVO LOCALMENTE</span></div>
      <div class="bn-metrics"><div><small>Renda mensal</small><strong id="bn-income-view">—</strong></div><div><small>Dívidas em aberto</small><strong id="bn-debt-view">—</strong></div><div><small>Reserva atual</small><strong id="bn-reserve-view">—</strong></div><div><small>XP acumulado</small><strong id="bn-xp-view">—</strong></div></div>
      <div class="bn-grid">
        <form id="bn-income-form" class="bn-card"><h3>Minha renda e distribuição</h3><label>Renda mensal líquida (R$)<input name="income" type="number" min="0" step="0.01" value="${state.income || ''}" placeholder="Ex.: 3500" required></label><div class="bn-three"><label>Missão (%)<input name="mission" type="number" min="0" max="100" value="${state.allocation.mission}"></label><label>Estilo de vida (%)<input name="lifestyle" type="number" min="0" max="100" value="${state.allocation.lifestyle}"></label><label>Futuro (%)<input name="future" type="number" min="0" max="100" value="${state.allocation.future}"></label></div><p class="bn-help" id="bn-allocation-check">A soma das categorias deve ser 100%.</p><button class="bn-btn" type="submit">Salvar renda e percentuais</button><div class="bn-allocation-result" id="bn-allocation-result"></div></form>
        <form id="bn-debt-form" class="bn-card"><h3>Cadastrar dívida</h3><label>Nome da dívida<input name="name" maxlength="60" placeholder="Ex.: Cartão de crédito" required></label><div class="bn-two"><label>Saldo atual (R$)<input name="balance" type="number" min="0.01" step="0.01" required></label><label>Juros ao mês (%)<input name="rate" type="number" min="0" step="0.01" placeholder="Se souber"></label></div><div class="bn-two"><label>Parcela mensal (R$)<input name="payment" type="number" min="0" step="0.01" placeholder="Opcional"></label><label>Vencimento<input name="due" type="date"></label></div><button class="bn-btn" type="submit">Adicionar dívida</button></form>
        <div class="bn-card bn-wide"><div class="bn-card-title"><h3>Suas dívidas cadastradas</h3><span id="bn-debt-total"></span></div><div id="bn-debt-list" class="bn-debt-list"></div></div>
        <form id="bn-reserve-form" class="bn-card"><h3>Minha base segura</h3><div class="bn-two"><label>Meta da reserva (R$)<input name="goal" type="number" min="1" step="0.01" value="${state.reserveGoal}"></label><label>Saldo atual (R$)<input name="current" type="number" min="0" step="0.01" value="${state.reserve}"></label></div><button class="bn-btn" type="submit">Atualizar reserva</button><div class="bn-progress"><span id="bn-reserve-progress"></span></div><p id="bn-reserve-caption" class="bn-help"></p></form>
        <form id="bn-deposit-form" class="bn-card"><h3>Registrar aporte real</h3><label>Valor depositado (R$)<input name="amount" type="number" min="0.01" step="0.01" placeholder="Informe o valor" required></label><label>Observação<input name="note" maxlength="80" placeholder="Ex.: transferência para reserva"></label><button class="bn-btn" type="submit">Registrar aporte</button><p class="bn-help">O saldo só muda quando você informa um aporte. Nenhum valor é acrescentado automaticamente.</p></form>
      </div><p class="bn-disclaimer">Privacidade: dados salvos apenas no armazenamento deste navegador. Não há conexão bancária/Open Finance real, conta de usuário ou sincronização entre dispositivos nesta versão.</p>`;
    const main = document.querySelector('main'); if (main) main.insertBefore(el, main.children[0] || null);
  }
  function render() {
    const set = (id, value) => { const e=document.getElementById(id); if(e)e.textContent=value; };
    set('bn-income-view', money(state.income)); set('bn-debt-view', money(totalDebt())); set('bn-reserve-view', money(state.reserve)); set('bn-xp-view', `${state.xp} XP`); set('bn-debt-total', money(totalDebt()));
    const pct = state.reserveGoal > 0 ? Math.min(100, state.reserve / state.reserveGoal * 100) : 0;
    const bar=document.getElementById('bn-reserve-progress'); if(bar)bar.style.width=pct+'%';
    set('bn-reserve-caption', `${money(state.reserve)} de ${money(state.reserveGoal)} (${pct.toFixed(1).replace('.',',')}%)`);
    const list=document.getElementById('bn-debt-list'); if(list) list.innerHTML = state.debts.length ? sortedDebts().map((d,i)=>`<article class="bn-debt-item"><div><b>${esc(d.name)}</b><small>Juros: ${d.rate === null ? 'não informado' : d.rate.toLocaleString('pt-BR')+'% a.m.'} · Parcela: ${money(d.payment)}</small><strong>${money(d.balance)}</strong></div><div class="bn-debt-actions"><button type="button" data-edit="${d.id}">Editar</button><button type="button" data-pay="${d.id}">Registrar pagamento</button><button type="button" data-delete="${d.id}" class="bn-danger">Excluir</button></div></article>`).join('') : '<p class="bn-empty">Nenhuma dívida cadastrada. Use o formulário acima para adicionar.</p>';
    const a=state.allocation, base=state.income*(state.tithe?0.9:1); set('bn-allocation-result', `Distribuição calculada sobre ${money(base)}${state.tithe?' após separar 10% de dízimo':''}: Missão ${money(base*a.mission/100)} · Estilo de vida ${money(base*a.lifestyle/100)} · Futuro ${money(base*a.future/100)}.`);
    const strat=state.strategy; document.querySelectorAll('#tab-snowball,#tab-avalanche').forEach(b=>{if(b)b.setAttribute('aria-pressed',String((strat==='snowball'&&b.id==='tab-snowball')||(strat==='avalanche'&&b.id==='tab-avalanche')))});
  }
  panel();
  document.addEventListener('submit', e => {
    const f=e.target; if(!f.id.startsWith('bn-'))return; e.preventDefault(); const d=Object.fromEntries(new FormData(f));
    if(f.id==='bn-income-form') { const vals=[num(d.mission),num(d.lifestyle),num(d.future)]; if(vals.some(x=>x<0||x>100)||vals.reduce((x,y)=>x+y,0)!==100){toast('Os percentuais precisam somar exatamente 100%.');return;} state.income=num(d.income); state.allocation={mission:vals[0],lifestyle:vals[1],future:vals[2]}; toast('Renda e distribuição atualizadas.'); }
    if(f.id==='bn-debt-form') {state.debts.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:d.name.trim(),balance:num(d.balance),rate:d.rate===''?null:num(d.rate),payment:num(d.payment),due:d.due||''});state.xp+=10;f.reset();toast('Dívida cadastrada. +10 XP.');}
    if(f.id==='bn-reserve-form') {state.reserveGoal=num(d.goal);state.reserve=num(d.current);toast('Dados da reserva atualizados.');}
    if(f.id==='bn-deposit-form') {const amount=num(d.amount);if(amount<=0){toast('Informe um valor maior que zero.');return;}state.reserve+=amount;state.xp+=Math.max(5,Math.floor(amount/10));state.transactions.unshift({date:new Date().toISOString(),amount,note:d.note||'Aporte na reserva'});f.reset();toast('Aporte registrado e saldo atualizado.');}
    persist();
  });
  document.addEventListener('click', e => {
    const pay=e.target.closest('[data-pay]'); if(pay){const debt=state.debts.find(x=>x.id===pay.dataset.pay);if(!debt)return;const raw=prompt(`Quanto foi pago em ${debt.name}? (R$)`);if(raw===null)return;const amount=num(raw);if(amount<=0||amount>debt.balance){toast('Valor inválido. O pagamento deve ser maior que zero e não pode superar o saldo.');return;}debt.balance=Math.max(0,Math.round((debt.balance-amount)*100)/100);state.xp+=Math.max(5,Math.floor(amount/10));state.transactions.unshift({date:new Date().toISOString(),amount:-amount,note:`Pagamento: ${debt.name}`});persist();toast('Pagamento registrado. Saldo da dívida atualizado.');}
    const edit=e.target.closest('[data-edit]');if(edit){const debt=state.debts.find(x=>x.id===edit.dataset.edit);if(!debt)return;const name=prompt('Nome da dívida:',debt.name);if(name===null)return;const balance=prompt('Saldo atual (R$):',String(debt.balance).replace('.',','));if(balance===null)return;const rate=prompt('Juros ao mês (%), deixe em branco se desconhecido:',debt.rate===null?'':String(debt.rate).replace('.',','));if(num(balance)<0||!name.trim()){toast('Dados inválidos.');return;}debt.name=name.trim();debt.balance=num(balance);debt.rate=rate.trim()===''?null:num(rate);persist();toast('Dados da dívida atualizados.');}
    const expurgar=e.target.closest('button'); if(expurgar && expurgar.textContent.toUpperCase().includes('EXPURGAR')){const target=sortedDebts()[0];if(!target){toast('Cadastre uma dívida no painel antes de registrar pagamentos.');return;}const raw=prompt(`Valor do pagamento extra para ${target.name} (R$):`);if(raw===null)return;const amount=num(raw);if(amount<=0||amount>target.balance){toast('Informe um valor válido, até o saldo da dívida.');return;}target.balance=Math.round((target.balance-amount)*100)/100;state.xp+=Math.max(5,Math.floor(amount/10));persist();toast('Pagamento extra registrado na dívida prioritária.');}
    const del=e.target.closest('[data-delete]');if(del){const debt=state.debts.find(x=>x.id===del.dataset.delete);if(debt&&confirm(`Excluir a dívida “${debt.name}”?`)){state.debts=state.debts.filter(x=>x.id!==debt.id);persist();toast('Dívida excluída.');}}
  });
  const toggle=(id,key)=>{const b=document.getElementById(id);if(!b)return;b.addEventListener('click',()=>{state[key]=!state[key];persist();b.setAttribute('aria-pressed',String(state[key]));toast(key==='tithe'?(state.tithe?'Dízimo ativado: base de cálculo reduzida em 10%.':'Dízimo desativado.'):(state.openFinance?'Open Finance marcado como conectado (simulação).':'Open Finance desativado.'));});};
  toggle('btnToggleDizimo','tithe'); toggle('btnToggleOpenFinance','openFinance');
  const manual=document.getElementById('btnInsertManual');if(manual)manual.addEventListener('click',()=>{document.getElementById('bn-income-form')?.scrollIntoView({behavior:'smooth',block:'center'});document.querySelector('#bn-income-form input[name="income"]')?.focus();});
  const sync=document.getElementById('btnSyncSnowballPotes');if(sync)sync.addEventListener('click',()=>{const sum=state.allocation.mission+state.allocation.lifestyle+state.allocation.future;if(sum!==100){toast('Ajuste os percentuais para totalizar 100% antes de confirmar.');return;}state.xp+=5;persist();toast('Distribuição validada e salva neste navegador.');});
  const accelerate=document.getElementById('btn-acelerar');if(accelerate)accelerate.addEventListener('click',()=>{document.getElementById('bn-deposit-form')?.scrollIntoView({behavior:'smooth',block:'center'});document.querySelector('#bn-deposit-form input[name="amount"]')?.focus();toast('Informe o valor real do aporte para atualizar sua reserva.');});
  const originalSwitch=window.switchStrategy; window.switchStrategy=(s)=>{if(originalSwitch)originalSwitch(s);state.strategy=s==='avalanche'?'avalanche':'snowball';persist();toast('Estratégia atualizada. A fila é recalculada com os dados cadastrados.');};
  const oldSync=localStorage.getItem('bolaDeNeve.shared.v1'); if(oldSync&&!localStorage.getItem(KEY)){try{const old=JSON.parse(oldSync);state.reserve=Number(old.reserva)||0;state.xp=Number(old.xp)||0;state.strategy=old.estrategia||state.strategy;}catch{}}
  render();
})();
