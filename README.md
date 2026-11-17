# arqcomp-cruzadinha

DESAFIO DA ARQUITETURA — Caça-palavras educativo

Objetivo
- Criar um jogo de caça-palavras simples e didático para ajudar estudantes a revisar conceitos de Arquitetura Computacional.

Como jogar
- Abra o arquivo `index.html` no navegador (ou publique pelo GitHub Pages).
- Encontre as palavras listadas ao lado do tabuleiro.
- Selecione uma palavra clicando na primeira letra e depois na última letra (a seleção pode ser horizontal, vertical ou diagonal, em qualquer direção).
- Quando uma palavra for encontrada, ela será destacada no tabuleiro, marcada na lista e uma explicação breve será exibida.
- O contador mostra quantas palavras foram encontradas. Ao encontrar todas, uma mensagem de parabéns aparece.
- Use o botão "Reiniciar jogo" para gerar um novo tabuleiro com posições diferentes.

Perguntas (visíveis no jogo)

1. Qual componente é responsável por executar instruções e coordenar o funcionamento do computador? (CPU)
2. Qual parte do processador realiza operações matemáticas e lógicas? (ULA)
3. Qual componente controla e organiza a execução das instruções do processador? (UC)
4. Quais pequenos espaços de armazenamento ficam dentro do processador e guardam informações utilizadas durante o processamento? (REGISTRADORES)
5. Qual memória armazena temporariamente os dados e programas que estão sendo utilizados pelo computador? (RAM)
6. Qual memória mantém suas informações mesmo quando o computador está desligado? (ROM)
7. Qual memória rápida armazena informações frequentemente utilizadas pelo processador para agilizar o acesso? (CACHE)
8. Qual recurso permite que dispositivos transfiram dados diretamente para a memória sem depender continuamente da CPU? (DMA)
9. Qual barramento transporta informações que indicam os endereços de memória que serão acessados? (ADDRESSBUS)
10. Qual barramento transporta as informações e os dados entre os componentes do computador? (DATABUS)
11. Como é chamado um dispositivo que reúne processador, memória e outros componentes em um único circuito integrado? (MICROCONTROLADOR)
12. Como é chamado um processador que possui quatro núcleos de processamento? (QUADCORE)

Explicações (curtas e didáticas)
- CPU: Componente que executa instruções e coordena o processamento do computador.
- ULA: Unidade Lógica e Aritmética — realiza operações matemáticas e lógicas.
- UC: Unidade de Controle — interpreta instruções e dirige o funcionamento do processador.
- REGISTRADORES: Pequenas memórias dentro da CPU que guardam dados temporários para operações rápidas.
- RAM: Memória volátil que armazena os programas e dados em uso durante a execução.
- ROM: Memória de leitura apenas usada para armazenar firmware ou dados imutáveis.
- CACHE: Memória muito rápida entre CPU e RAM para acelerar o acesso a dados frequentemente usados.
- DMA: Acesso direto à memória que permite transferências sem sobrecarregar a CPU.
- ADDRESSBUS: Barramento que transporta informações indicando os endereços de memória a serem acessados.
- DATABUS: Barramento que transporta os dados entre os componentes do computador.
- MICROCONTROLADOR: Circuito que integra CPU, memória e periféricos em um único chip para controlar sistemas.
- QUADCORE: Processador com quatro núcleos que executam tarefas em paralelo, melhorando desempenho em multi-tarefa.

Detalhes de implementação (resumido)
- Arquivos: `index.html`, `style.css`, `script.js` (separados e simples).
- O tabuleiro é gerado em uma matriz 18x18 para garantir espaço para todas as palavras.
- Palavras são posicionadas em 8 direções (horizontal, vertical e diagonais). São permitidos cruzamentos quando as letras coincidem.
- Células vazias são preenchidas com letras aleatórias.
- Seleção: clique na primeira e na última letra; o jogo valida sequências diretas ou invertidas.
- Reiniciar: recria todo o tabuleiro com nova distribuição das palavras.

Publicação no GitHub Pages
1. Crie um repositório público chamado `arqcomp-cruzadinha` no GitHub.
2. Faça push dos arquivos (`index.html`, `style.css`, `script.js`, `README.md`).
3. Nas configurações do repositório (Settings → Pages) defina a branch principal (main/master) como origem do GitHub Pages e salve.
4. Após alguns minutos, o jogo estará disponível no endereço indicado pelo GitHub Pages.

Notas sobre commits
- Para atender ao requisito acadêmico, faça pelo menos 6 commits em pelo menos 2 dias diferentes com mensagens como:
  - feat: cria estrutura do caça-palavras
  - feat: adiciona posicionamento das palavras
  - feat: implementa seleção de palavras
  - feat: adiciona botão de reiniciar
  - style: ajusta identidade visual roxa
  - docs: cria README do projeto

Considerações finais
- O jogo foi desenvolvido para ser simples e didático, com foco em Arquitetura Computacional. O código está comentado em português e mantém separação clara entre HTML, CSS e JavaScript para facilitar a compreensão.
