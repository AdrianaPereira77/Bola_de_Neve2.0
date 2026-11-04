BOLA DE NEVE 2.0 — FRONTEND ESTÁTICO

Este pacote foi preparado para publicar a interface existente na Vercel.

COMO PUBLICAR:
1. Extraia este ZIP no computador.
2. Entre na Vercel e escolha Add New > Project.
3. Importe o repositório GitHub que contém estes arquivos OU envie o projeto para um novo repositório GitHub.
4. Em Build and Output Settings, selecione Framework Preset: Other.
5. Deixe Build Command vazio e Output Directory como "." (ponto).
6. Clique em Deploy.

IMPORTANTE:
- O arquivo principal agora é index.html, na raiz do projeto. Isso permite que a Vercel abra a página inicial.
- vercel.json direciona as rotas para index.html para evitar 404 em acessos diretos.
- A tela original e seu cálculo interativo foram preservados.
- Este pacote é somente o frontend estático. Não inclui login, banco de dados, API ou páginas completas para as demais opções do menu.
- O Tailwind e as fontes usados pela tela são carregados por CDN; a conexão com a internet é necessária para esses recursos visuais.
