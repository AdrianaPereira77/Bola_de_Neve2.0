# Bola de Neve — projeto integrado

As três telas do Stitch foram reunidas em um único projeto navegável:

- `potes.html` — Potes & Open Finance
- `guerra.html` — Guerra das Dívidas
- `escudo.html` — Escudo & XP
- `index.html` — página inicial

## Como testar
Abra `index.html` no navegador. Para uma experiência mais próxima de hospedagem, use a extensão **Live Server** do VS Code e clique em **Go Live**.

## Como publicar no GitHub
1. Crie um repositório vazio no GitHub.
2. Extraia esta pasta no computador.
3. Abra a pasta no VS Code.
4. No terminal, execute:

```bash
git init
git add .
git commit -m "Integra as três telas do Bola de Neve"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Substitua a URL do `git remote add origin` pela URL do seu repositório.

## Observação sobre os dados
Foi incluída uma camada inicial de estado compartilhado via `localStorage`, para que as telas conversem no mesmo navegador. Os dados ficam salvos apenas no navegador/dispositivo; ainda não há banco de dados, login ou sincronização entre dispositivos. Os conectores Open Finance também são apenas parte visual, não uma conexão bancária real.
