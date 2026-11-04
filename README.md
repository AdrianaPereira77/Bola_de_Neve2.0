# Bola de Neve 2.0 — versão funcional local

## Publicar na Vercel
Este projeto é estático (HTML, CSS e JavaScript). Coloque todos os arquivos na raiz do repositório e importe o repositório na Vercel.

- Framework Preset: **Other**
- Build Command: deixar em branco
- Output Directory: `.`
- Install Command: deixar em branco

## Arquivos
- `index.html`: página inicial
- `potes.html`: renda, percentuais dos potes, dízimo e validação da divisão
- `guerra.html`: cadastro, ordenação, pagamento e exclusão de dívidas; estratégias Bola de Neve e Avalanche
- `escudo.html`: meta da reserva, saldo, registro de aportes e XP
- `app.js`: regras, cálculos e persistência compartilhada
- `app.css`: estilos do painel funcional

## O que funciona
- Dados compartilhados entre as páginas no mesmo navegador e domínio via `localStorage`.
- Edição da renda, distribuição percentual e meta/saldo da reserva.
- Cadastro e exclusão de dívidas, registro de pagamentos e ordenação por menor saldo ou maior juros.
- Registro de aportes com valor informado pelo usuário; o saldo não aumenta sozinho.
- XP gerado por ações registradas.

## Limitações importantes
- Open Finance é apenas um indicador visual/simulação. Não existe conexão com bancos, APIs ou compartilhamento de credenciais.
- Os dados ficam somente no navegador/dispositivo atual. Não há login, banco de dados, backup automático ou sincronização entre dispositivos.
- Algumas ilustrações e textos originais das telas ainda são conteúdo demonstrativo; use o **Painel Funcional** como fonte dos valores editáveis e cálculos reais.
- A versão não substitui orientação financeira profissional.

## Teste local
Abra `index.html` em um navegador ou use um servidor estático local. Para validar a persistência, cadastre uma dívida em `guerra.html`, navegue para outra página e confira os indicadores do painel.
