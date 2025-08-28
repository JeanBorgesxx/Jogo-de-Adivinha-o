let numeroSecreto, tentativasRestantes, palpitesFeitos = [];
let limiteNumero, nomeJogador, avatarJogador, dificuldadeSelecionada;
let tempoRestante, cronometroInterval;
let rankingModo = "normal";

// Configurações de dificuldade
const dificuldades = {
  facil: { max: 50, tentativas: 5, multiplicador: 1 },
  medio: { max: 100, tentativas: 10, multiplicador: 2 },
  dificil: { max: 200, tentativas: 15, multiplicador: 3 },
  cronometro: { max: 100, tentativas: Infinity, multiplicador: 5 }
};

// Iniciar jogo
function iniciarJogo(dificuldade) {
  nomeJogador = document.getElementById("nomeJogador").value.trim();
  avatarJogador = document.querySelector("input[name='avatar']:checked").value;

  if (!nomeJogador) {
    alert("Digite seu nome para jogar!");
    return;
  }

  dificuldadeSelecionada = dificuldade;
  let config = dificuldades[dificuldadeSelecionada];

  limiteNumero = config.max;
  tentativasRestantes = config.tentativas;
  numeroSecreto = Math.floor(Math.random() * limiteNumero) + 1;
  palpitesFeitos = [];

  document.getElementById("telaInicial").style.display = "none";
  document.getElementById("telaJogo").style.display = "block";

  document.getElementById("mensagem").textContent = "";
  document.getElementById("historico").textContent = "Palpites: (nenhum ainda)";
  document.getElementById("dicas").textContent = "";
  document.getElementById("palpite").value = "";
  document.getElementById("btnReiniciar").style.display = "none";

   // ✅ Reativa o botão chutar quando reiniciar
  document.getElementById("btnChutar").disabled = false;
  
  if (dificuldade === "cronometro") {
    tempoRestante = 60;
    document.getElementById("cronometro").textContent = `⏱️ Tempo: ${tempoRestante}s`;
    cronometroInterval = setInterval(() => {
      tempoRestante--;
      document.getElementById("cronometro").textContent = `⏱️ Tempo: ${tempoRestante}s`;
      if (tempoRestante <= 0) {
        clearInterval(cronometroInterval);
        perderJogo();
      }
    }, 1000);
  } else {
    document.getElementById("tentativas").textContent = `Tentativas restantes: ${tentativasRestantes}`;
    document.getElementById("cronometro").textContent = "";
  }
}

// Chutar
function chutar() {
  let palpite = parseInt(document.getElementById("palpite").value);
  if (isNaN(palpite) || palpite < 1 || palpite > limiteNumero) {
    document.getElementById("mensagem").textContent = `Digite um número válido entre 1 e ${limiteNumero}!`;
    return;
  }

  palpitesFeitos.push(palpite);
  atualizarHistorico();

  if (dificuldadeSelecionada !== "cronometro") tentativasRestantes--;

  if (palpite === numeroSecreto) {
    vitoria();
  } else if (tentativasRestantes > 0 || dificuldadeSelecionada === "cronometro") {
    document.getElementById("mensagem").textContent = palpite < numeroSecreto ? "📉 O número é MAIOR!" : "📈 O número é MENOR!";
    if (palpitesFeitos.length % 3 === 0) mostrarDica();
    if (dificuldadeSelecionada !== "cronometro") {
      document.getElementById("tentativas").textContent = `Tentativas restantes: ${tentativasRestantes}`;
    }
  } else {
    perderJogo();
  }

  document.getElementById("palpite").value = "";
}

// Histórico
function atualizarHistorico() {
  document.getElementById("historico").textContent = "Palpites: " + palpitesFeitos.join(", ");
}

// Mostrar dica
function mostrarDica() {
  if (numeroSecreto % 2 === 0) {
    document.getElementById("dicas").textContent = "💡 O número é PAR!";
  } else if (numeroSecreto % 2 !== 0) {
    document.getElementById("dicas").textContent = "💡 O número é ÍMPAR!";
  }
  if (numeroSecreto % 5 === 0) {
    document.getElementById("dicas").textContent += " Também é múltiplo de 5!";
  }
}

// Vitória
function vitoria() {
  if (dificuldadeSelecionada === "cronometro") clearInterval(cronometroInterval);

  let pontosBase = tentativasRestantes * dificuldades[dificuldadeSelecionada].multiplicador;
  let bonus = palpitesFeitos.length <= 3 ? 20 : 0;
  let pontos = pontosBase + bonus;

  document.getElementById("mensagem").innerHTML = `🎉 Parabéns ${avatarJogador} ${nomeJogador}! Você acertou e fez <b>${pontos}</b> pontos!`;

  confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });

  salvarRanking(nomeJogador, avatarJogador, pontos, dificuldadeSelecionada);
  encerrarJogo();
}

// Derrota
function perderJogo() {
  if (dificuldadeSelecionada === "cronometro") clearInterval(cronometroInterval);

  document.getElementById("mensagem").textContent = `❌ Você perdeu! O número era ${numeroSecreto}`;
  document.body.classList.add("derrota");
  setTimeout(() => document.body.classList.remove("derrota"), 500);
  encerrarJogo();
}

// Encerrar jogo
function encerrarJogo() {
  document.getElementById("btnChutar").disabled = true;
  document.getElementById("btnReiniciar").style.display = "inline-block";
}

// Reiniciar
function reiniciar() {
  iniciarJogo(dificuldadeSelecionada);
}

// Mudar dificuldade
function mudarDificuldade() {
  if (dificuldadeSelecionada === "cronometro") clearInterval(cronometroInterval);
  document.getElementById("telaJogo").style.display = "none";
  document.getElementById("telaInicial").style.display = "block";
}

// Ranking
function salvarRanking(nome, avatar, pontos, modo) {
  let chave = modo === "cronometro" ? "rankingCronometro" : "rankingNormal";
  let ranking = JSON.parse(localStorage.getItem(chave)) || [];
  ranking.push({ nome, avatar, pontos });
  ranking.sort((a, b) => b.pontos - a.pontos);
  ranking = ranking.slice(0, 10);
  localStorage.setItem(chave, JSON.stringify(ranking));
  exibirRanking();
}

function exibirRanking() {
  let chave = rankingModo === "cronometro" ? "rankingCronometro" : "rankingNormal";
  let ranking = JSON.parse(localStorage.getItem(chave)) || [];
  let tbody = document.querySelector("#ranking tbody");
  tbody.innerHTML = "";
  ranking.forEach((jogador, index) => {
    let medalha = "";
    if (index === 0) medalha = "🥇";
    else if (index === 1) medalha = "🥈";
    else if (index === 2) medalha = "🥉";
    let row = `<tr>
      <td>${medalha || (index + 1) + "º"}</td>
      <td>${jogador.avatar}</td>
      <td>${jogador.nome}</td>
      <td>${jogador.pontos}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function trocarRanking(modo) {
  rankingModo = modo;
  exibirRanking();
}

// Tema
function mudarTema(tema) {
  document.body.className = tema;
  localStorage.setItem("tema", tema);
}

window.onload = () => {
  let temaSalvo = localStorage.getItem("tema");
  if (temaSalvo) mudarTema(temaSalvo);
  exibirRanking();
};
