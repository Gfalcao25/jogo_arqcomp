// script.js — lógica do jogo
// Variáveis e configurações principais
const LINHAS = 18; // tamanho do tabuleiro (pode ajustar para maior/menor)
const COLUNAS = 18;

// Respostas internas (maiúsculas, sem acentos ou espaços)
const PALAVRAS = [
  'CPU','ULA','UC','REGISTRADORES','RAM','ROM','CACHE','DMA','ADDRESSBUS','DATABUS','MICROCONTROLADOR','QUADCORE'
];

// Explicações curtas de cada palavra (resposta -> explicação)
const EXPLICACOES = {
  CPU: 'Componente que executa instruções e coordena o processamento do computador.',
  ULA: 'Unidade Lógica e Aritmética — realiza operações matemáticas e lógicas.',
  UC: 'Unidade de Controle — interpreta instruções e dirige o funcionamento do processador.',
  REGISTRADORES: 'Pequenas memórias dentro da CPU que guardam dados temporários para operações rápidas.',
  RAM: 'Memória volátil que armazena os programas e dados em uso durante a execução.',
  ROM: 'Memória de leitura apenas usada para armazenar firmware ou dados imutáveis.',
  CACHE: 'Memória muito rápida entre CPU e RAM para acelerar o acesso a dados frequentemente usados.',
  DMA: 'Acesso direto à memória que permite transferências sem sobrecarregar a CPU.',
  ADDRESSBUS: 'Barramento que transporta informações indicando os endereços de memória a serem acessados.',
  DATABUS: 'Barramento que transporta os dados entre os componentes do computador.',
  MICROCONTROLADOR: 'Circuito que integra CPU, memória e periféricos em um único chip para controlar sistemas.',
  QUADCORE: 'Processador com quatro núcleos que executam tarefas em paralelo, melhorando desempenho em multi-tarefa.'
};

// Perguntas visíveis ao jogador (texto das perguntas; respostas internas em PALAVRAS)
const PERGUNTAS = [
  {q: 'Qual componente é responsável por executar instruções e coordenar o funcionamento do computador?', a:'CPU'},
  {q: 'Qual parte do processador realiza operações matemáticas e lógicas?', a:'ULA'},
  {q: 'Qual componente controla e organiza a execução das instruções do processador?', a:'UC'},
  {q: 'Quais pequenos espaços de armazenamento ficam dentro do processador e guardam informações utilizadas durante o processamento?', a:'REGISTRADORES'},
  {q: 'Qual memória armazena temporariamente os dados e programas que estão sendo utilizados pelo computador?', a:'RAM'},
  {q: 'Qual memória mantém suas informações mesmo quando o computador está desligado?', a:'ROM'},
  {q: 'Qual memória rápida armazena informações frequentemente utilizadas pelo processador para agilizar o acesso?', a:'CACHE'},
  {q: 'Qual recurso permite que dispositivos transfiram dados diretamente para a memória sem depender continuamente da CPU?', a:'DMA'},
  {q: 'Qual barramento transporta informações que indicam os endereços de memória que serão acessados?', a:'ADDRESSBUS'},
  {q: 'Qual barramento transporta as informações e os dados entre os componentes do computador?', a:'DATABUS'},
  {q: 'Como é chamado um dispositivo que reúne processador, memória e outros componentes em um único circuito integrado?', a:'MICROCONTROLADOR'},
  {q: 'Como é chamado um processador que possui quatro núcleos de processamento?', a:'QUADCORE'}
];

// Representação do tabuleiro: matriz de strings (letras) e mapa de posições das palavras
let matriz = [];
let mapaPalavras = {}; // palavra -> array de {r,c}
let encontrados = new Set();

// Estado de seleção pelo jogador
let inicioSelecionado = null; // {r,c}
// flags para controle do popup de conclusão
let popupShown = false;
let popupClosed = false;
// Drag/selection state
let selecionando = false;
let dragPointerId = null;
let dragStart = null; // {r,c}
let selecaoAtual = []; // array de {r,c}
let lastActionWasDrag = false;

// Elementos DOM
const tabuleiroEl = document.getElementById('tabuleiro');
const listaEl = document.getElementById('lista-palavras');
const explicacaoEl = document.getElementById('explicacao');
const progressoEl = document.getElementById('progresso');
const reiniciarBtn = document.getElementById('reiniciar');
const mensagemFinal = document.getElementById('mensagem-final');
const jogarNovamenteBtn = document.getElementById('jogar-novamente');
const fecharPopupBtn = document.getElementById('fechar-popup');

// Direções (dx,dy) para posicionar palavras
const DIRECOES = [
  {dr:0, dc:1}, // direita
  {dr:0, dc:-1}, // esquerda
  {dr:1, dc:0}, // baixo
  {dr:-1, dc:0}, // cima
  {dr:1, dc:1}, // diag ↘
  {dr:-1, dc:-1}, // diag ↖
  {dr:-1, dc:1}, // diag ↗
  {dr:1, dc:-1} // diag ↙
];

// Inicializa e gera o tabuleiro completo
function iniciarJogo(){
  matriz = Array.from({length:LINHAS}, ()=>Array.from({length:COLUNAS}, ()=>''));
  mapaPalavras = {};
  encontrados.clear();
  inicioSelecionado = null;
  popupShown = false;
  popupClosed = false;
  gerarDistribuicao();
  preencherAleatorio();
  desenharTabuleiro();
  preencherLista();
  atualizaProgresso();
  explicacaoEl.textContent = 'Encontre uma palavra para ver uma breve explicação.';
  mensagemFinal.hidden = true;
}

// Tenta distribuir todas as palavras; reinicia distribuição se falhar
function gerarDistribuicao(){
  const tentativasReiniciar = 50;
  for(let tentativa=0; tentativa<tentativasReiniciar; tentativa++){
    // limpa
    for(let r=0;r<LINHAS;r++) for(let c=0;c<COLUNAS;c++) matriz[r][c]='';
    mapaPalavras = {};
    // embaralha a ordem das palavras para variar distribuição
    const palavrasEmbaralhadas = shuffle(Array.from(PALAVRAS));
    let falhou = false;
    for(const palavra of palavrasEmbaralhadas){
      const ok = posicionarPalavra(palavra);
      if(!ok){ falhou = true; break }
    }
    if(!falhou) return; // sucesso
  }
  // Se após várias tentativas não conseguir, reduz complexidade (raro)
  console.warn('Não foi possível distribuir sem conflito com as regras após várias tentativas. Tentando com mais folga.');
  // Tentativa final: força posição sem permitir cruzamentos conflitantes — como fallback
  for(let r=0;r<LINHAS;r++) for(let c=0;c<COLUNAS;c++) matriz[r][c]='';
  mapaPalavras = {};
  for(const palavra of PALAVRAS){
    if(!posicionarPalavra(palavra, {forcar:true})) console.error('Falha ao posicionar palavra (fallback):', palavra);
  }
}

// Posiciona uma palavra tentando várias direções/posições
function posicionarPalavra(palavra, opts={forcar:false}){
  const letras = palavra.split('');
  const len = letras.length;
  const maxTentativas = 400;
  for(let t=0;t<maxTentativas;t++){
    const dir = DIRECOES[Math.floor(Math.random()*DIRECOES.length)];
    const dr = dir.dr; const dc = dir.dc;
    // escolher ponto inicial válido para que a palavra caiba
    const r0 = randInt(0, LINHAS-1);
    const c0 = randInt(0, COLUNAS-1);
    const rf = r0 + dr*(len-1);
    const cf = c0 + dc*(len-1);
    if(rf < 0 || rf >= LINHAS || cf < 0 || cf >= COLUNAS) continue;
    // verificar conflito
    let pode = true;
    const coords = [];
    for(let i=0;i<len;i++){
      const r = r0 + dr*i;
      const c = c0 + dc*i;
      const atual = matriz[r][c];
      if(atual === '' || atual === letras[i]){
        coords.push({r,c});
      } else {
        pode = false; break;
      }
    }
    if(pode){
      // escreve a palavra
      for(let i=0;i<len;i++){
        const {r,c} = coords[i];
        matriz[r][c] = letras[i];
      }
      mapaPalavras[palavra] = coords;
      return true;
    }
  }
  // se não encontrou posição e forçar não está ativo, retorna false
  if(opts.forcar){
    // forçar: procurar qualquer posição e sobrepor (substituir)
    for(const dir of DIRECOES){
      const dr = dir.dr; const dc = dir.dc;
      for(let r0=0;r0<LINHAS;r0++){
        for(let c0=0;c0<COLUNAS;c0++){
          const rf = r0 + dr*(len-1);
          const cf = c0 + dc*(len-1);
          if(rf < 0 || rf >= LINHAS || cf < 0 || cf >= COLUNAS) continue;
          const coords = [];
          for(let i=0;i<len;i++) coords.push({r:r0+dr*i, c:c0+dc*i});
          for(let i=0;i<len;i++) matriz[coords[i].r][coords[i].c] = letras[i];
          mapaPalavras[palavra] = coords;
          return true;
        }
      }
    }
  }
  return false;
}

// Preenche as células vazias com letras aleatórias
function preencherAleatorio(){
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let r=0;r<LINHAS;r++){
    for(let c=0;c<COLUNAS;c++){
      if(!matriz[r][c] || matriz[r][c]===''){
        matriz[r][c] = ABC[Math.floor(Math.random()*ABC.length)];
      }
    }
  }
}

// Desenha o tabuleiro no DOM
function desenharTabuleiro(){
  // ajustar variáveis CSS
  tabuleiroEl.style.setProperty('--cols', COLUNAS);
  tabuleiroEl.innerHTML = '';
  for(let r=0;r<LINHAS;r++){
    for(let c=0;c<COLUNAS;c++){
      const cel = document.createElement('div');
      cel.className = 'celula';
      cel.dataset.r = r; cel.dataset.c = c;
      cel.textContent = matriz[r][c];
      cel.addEventListener('click', onCelulaClick);
      cel.addEventListener('touchstart', (e)=>{ e.preventDefault(); onCelulaClick(e); }, {passive:false});
      tabuleiroEl.appendChild(cel);
    }
  }
}

// Funções auxiliares para seleção por arraste (pointer)
function getCellFromPoint(x,y){
  const el = document.elementFromPoint(x,y);
  if(!el) return null;
  return el.closest('.celula');
}

function coordsFromCell(el){
  return {r: Number(el.dataset.r), c: Number(el.dataset.c)};
}

function pontosEntre(a,b){
  const dr = b.r - a.r; const dc = b.c - a.c;
  const passos = Math.max(Math.abs(dr), Math.abs(dc));
  const passoR = dr===0?0:dr/Math.abs(dr);
  const passoC = dc===0?0:dc/Math.abs(dc);
  if(!(dr===0 || dc===0 || Math.abs(dr)===Math.abs(dc))) return null;
  const pts = [];
  for(let i=0;i<=passos;i++) pts.push({r: a.r + passoR*i, c: a.c + passoC*i});
  return pts;
}

function marcarSelecaoVisual(novos){
  const chave = (p)=>`${p.r},${p.c}`;
  const conjunto = new Set(novos.map(chave));
  selecaoAtual.forEach(p=>{
    const s = `${p.r},${p.c}`;
    if(!conjunto.has(s)){
      const cel = tabuleiroEl.querySelector(`.celula[data-r='${p.r}'][data-c='${p.c}']`);
      if(cel) cel.classList.remove('selecionada');
    }
  });
  novos.forEach(p=>{
    const cel = tabuleiroEl.querySelector(`.celula[data-r='${p.r}'][data-c='${p.c}']`);
    if(cel && !cel.classList.contains('encontrada')) cel.classList.add('selecionada');
  });
  selecaoAtual = novos;
}

function limparSelecaoTemporaria(){
  tabuleiroEl.querySelectorAll('.celula.selecionada').forEach(el=>el.classList.remove('selecionada'));
  selecaoAtual = [];
}

function onPointerDown(e){
  const alvo = getCellFromPoint(e.clientX, e.clientY);
  if(!alvo) return;
  e.preventDefault();
  selecionando = true;
  dragPointerId = e.pointerId;
  dragStart = coordsFromCell(alvo);
  marcarSelecaoVisual([dragStart]);
  try{ tabuleiroEl.setPointerCapture(e.pointerId); }catch(err){}
}

function onPointerMove(e){
  if(!selecionando) return;
  if(e.pointerId !== dragPointerId) return;
  const alvo = getCellFromPoint(e.clientX, e.clientY);
  if(!alvo) return;
  const ponto = coordsFromCell(alvo);
  const pts = pontosEntre(dragStart, ponto);
  if(!pts) return; // não alinhado
  marcarSelecaoVisual(pts);
}

function onPointerUp(e){
  if(!selecionando) return;
  if(e.pointerId !== dragPointerId) return;
  selecionando = false;
  dragPointerId = null;
  if(selecaoAtual.length === 0){ limparSelecoes(); return; }
  lastActionWasDrag = true;
  setTimeout(()=>{ lastActionWasDrag = false; }, 50);
  let seq = '';
  for(const p of selecaoAtual){ seq += matriz[p.r][p.c]; }
  let palavraEncontrada = null; let direcaoInvertida = false;
  for(const palavra of PALAVRAS){
    if(encontrados.has(palavra)) continue;
    if(seq === palavra){ palavraEncontrada = palavra; direcaoInvertida = false; break }
    const rev = seq.split('').reverse().join('');
    if(rev === palavra){ palavraEncontrada = palavra; direcaoInvertida = true; break }
  }
  if(palavraEncontrada){
    let posicoes = selecaoAtual;
    if(direcaoInvertida) posicoes = selecaoAtual.slice().reverse();
    encontrados.add(palavraEncontrada);
    const li = document.getElementById('pal_'+palavraEncontrada);
    if(li) li.classList.add('encontrada');
    atualizaProgresso();
    explicacaoEl.textContent = EXPLICACOES[palavraEncontrada] || 'Explicação não disponível.';
    for(const p of posicoes){
      const cel = tabuleiroEl.querySelector(`.celula[data-r='${p.r}'][data-c='${p.c}']`);
      if(cel){ cel.classList.remove('selecionada'); cel.classList.add('animacao'); }
    }
    setTimeout(()=>{
      for(const p of posicoes){
        const cel = tabuleiroEl.querySelector(`.celula[data-r='${p.r}'][data-c='${p.c}']`);
        if(cel){ cel.classList.remove('animacao'); cel.classList.add('encontrada'); }
      }
      if(encontrados.size === PALAVRAS.length) mostrarMensagemFinal();
    }, 720);
  } else {
    limparSelecaoTemporaria();
  }
}

// Preenche a lista lateral de palavras
function preencherLista(){
  listaEl.innerHTML = '';
  // mostramos as perguntas (texto) e mantemos a resposta interna no id
  for(const item of PERGUNTAS){
    const li = document.createElement('li');
    li.id = 'pal_'+item.a; // id usa a resposta interna
    li.textContent = item.q; // exibimos apenas a pergunta
    listaEl.appendChild(li);
  }
}

// Handler de clique em célula — seleção por primeiro e segundo clique
function onCelulaClick(ev){
  // se a ação anterior foi um arraste, ignoramos o clique gerado no final do drag
  if(lastActionWasDrag){ lastActionWasDrag = false; return; }
  const el = ev.currentTarget;
  const r = Number(el.dataset.r); const c = Number(el.dataset.c);
  // se já é célula de palavra encontrada, ignorar seleção (evita duplo contado)
  if(el.classList.contains('encontrada')) return;

  if(!inicioSelecionado){
    inicioSelecionado = {r,c};
    marcaSelecao(inicioSelecionado, inicioSelecionado); // marca 1 célula como selecionada
  } else {
    const fim = {r,c};
    // se clicou na mesma célula, limpar seleção
    if(inicioSelecionado.r===fim.r && inicioSelecionado.c===fim.c){
      limparSelecoes();
      inicioSelecionado = null;
      return;
    }
    // validar se os pontos formam uma linha reta nas 8 direções
    const dr = fim.r - inicioSelecionado.r;
    const dc = fim.c - inicioSelecionado.c;
    const passos = Math.max(Math.abs(dr), Math.abs(dc));
    const passoR = dr===0?0:dr/Math.abs(dr);
    const passoC = dc===0?0:dc/Math.abs(dc);
    // verificar se estão alinhados (horizontal, vertical ou diagonal)
    if(!(dr===0 || dc===0 || Math.abs(dr)===Math.abs(dc))){
      // não alinhado
      limparSelecoes(); inicioSelecionado = null; return;
    }
    // coletar letras entre os pontos
    let seq = '';
    const coords = [];
    for(let i=0;i<=passos;i++){
      const rr = inicioSelecionado.r + passoR*i;
      const cc = inicioSelecionado.c + passoC*i;
      seq += matriz[rr][cc];
      coords.push({r:rr,c:cc});
    }
    // checar se seq corresponde a alguma palavra (direção direta ou invertida)
    let palavraEncontrada = null; let direcaoInvertida = false;
    for(const palavra of PALAVRAS){
      if(encontrados.has(palavra)) continue;
      if(seq === palavra){ palavraEncontrada = palavra; direcaoInvertida = false; break }
      const rev = seq.split('').reverse().join('');
      if(rev === palavra){ palavraEncontrada = palavra; direcaoInvertida = true; break }
    }
    if(palavraEncontrada){
      // marcar células como encontradas
      marcarPalavraEncontrada(palavraEncontrada, coords, direcaoInvertida);
      inicioSelecionado = null;
      limparSelecoes();
      // verificar vitória
      if(encontrados.size === PALAVRAS.length){
        mostrarMensagemFinal();
      }
    } else {
      // seleção incorreta — apenas limpar
      limparSelecoes(); inicioSelecionado = null;
    }
  }
}

// Marca as células entre inicio e fim como selecionadas temporariamente
function marcaSelecao(inicio, fim){
  limparSelecoes();
  const dr = fim.r - inicio.r; const dc = fim.c - inicio.c;
  const passos = Math.max(Math.abs(dr), Math.abs(dc));
  const passoR = dr===0?0:dr/Math.abs(dr);
  const passoC = dc===0?0:dc/Math.abs(dc);
  for(let i=0;i<=passos;i++){
    const rr = inicio.r + passoR*i;
    const cc = inicio.c + passoC*i;
    const selector = `.celula[data-r='${rr}'][data-c='${cc}']`;
    const cel = tabuleiroEl.querySelector(selector);
    if(cel && !cel.classList.contains('encontrada')) cel.classList.add('selecionada');
  }
}

// Limpa realces temporários
function limparSelecoes(){
  tabuleiroEl.querySelectorAll('.celula.selecionada').forEach(el=>el.classList.remove('selecionada'));
}

// Marca palavra como encontrada: destaca no tabuleiro e na lista, mostra explicação
function marcarPalavraEncontrada(palavra, coords, invertida){
  // Se a palavra foi detectada em direção invertida, ajusta coords para corresponder à palavra original
  let posicoes = coords;
  if(invertida) posicoes = coords.slice().reverse();
  // marca encontrada logicamente e atualiza lista/progresso
  const li = document.getElementById('pal_'+palavra);
  if(li) li.classList.add('encontrada');
  encontrados.add(palavra);
  atualizaProgresso();
  // mostrar explicação
  explicacaoEl.textContent = EXPLICACOES[palavra] || 'Explicação não disponível.';
  // animação nas células encontradas
  for(const p of posicoes){
    const cel = tabuleiroEl.querySelector(`.celula[data-r='${p.r}'][data-c='${p.c}']`);
    if(cel){ cel.classList.remove('selecionada'); cel.classList.add('animacao'); }
  }
  setTimeout(()=>{
    for(const p of posicoes){
      const cel = tabuleiroEl.querySelector(`.celula[data-r='${p.r}'][data-c='${p.c}']`);
      if(cel){ cel.classList.remove('animacao'); cel.classList.add('encontrada'); }
    }
    if(encontrados.size === PALAVRAS.length) mostrarMensagemFinal();
  }, 720);
}

function atualizaProgresso(){
  progressoEl.textContent = `${encontrados.size} de ${PALAVRAS.length} palavras encontradas`;
}

function mostrarMensagemFinal(){
  // exibe o popup apenas uma vez por partida, e não reabre se o usuário fechou
  if (popupClosed) return; // usuário fechou manualmente — não reabrir
  if (popupShown) return;
  mensagemFinal.hidden = false;
  popupShown = true;
}

// Reiniciar jogo (gera novo tabuleiro)
reiniciarBtn.addEventListener('click', ()=>{ iniciarJogo(); window.scrollTo({top:0,behavior:'smooth'}); });
// botão do popup: fechar — fecha e previne reabertura até reiniciar
if (fecharPopupBtn) {
  fecharPopupBtn.addEventListener('click', (e) => { e.stopPropagation(); closePopup(); });
}
// botão do popup: jogar novamente — fecha o popup e inicia nova partida
if (jogarNovamenteBtn) {
  jogarNovamenteBtn.addEventListener('click', (e) => { e.stopPropagation(); closePopup(); iniciarJogo(); });
}

// evita que cliques no overlay sejam encaminhados para elementos por baixo
if(mensagemFinal){
  mensagemFinal.addEventListener('click', (e)=>{ e.stopPropagation(); });
}

function closePopup(){
  // atualiza estado lógico e esconde o popup
  popupClosed = true;
  popupShown = false;
  if(mensagemFinal) mensagemFinal.hidden = true;
}

// Utilitários
function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a }
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

// inicia ao carregar a página
document.addEventListener('DOMContentLoaded', ()=>{
  // adicionar listeners de pointer para seleção por arraste (mouse e touch)
  tabuleiroEl.addEventListener('pointerdown', onPointerDown);
  tabuleiroEl.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  iniciarJogo();
});
