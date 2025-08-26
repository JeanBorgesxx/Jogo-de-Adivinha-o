// Variáveis utilizadas
let numeroSecreto;
let maxTentativas = 10;
let tentativasRestantes;
let palpitesFeitos = [];


// Inicia o jogo
function iniciarJogo() {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  tentativasRestantes = maxTentativas;
  palpitesFeitos = [];


  document.getElementById("tentativas").textContent =
    "Tentativas restantes: " + tentativasRestantes;
  document.getElementById("mensagem").textContent = "";
  document.getElementById("historico").textContent = " Palpites: (nenhum ainda)";

  document.getElementById("palpite").disabled = false;
  document.getElementById("btnChutar").disabled = false;
  document.getElementById("btnReiniciar").style.display = "none";
  document.getElementById("palpite").value = "";
}


// Função para processar o chute
function chutar() {
  let palpite = parseInt(document.getElementById("palpite").value);

  if (isNaN(palpite) || palpite < 1 || palpite > 100) {
    document.getElementById("mensagem").textContent =
      " Digite um número válido entre 1 e 100!";
    return;
  }


  // Mostra os palpites no histórico
  palpitesFeitos.push(palpite);
  atualizarHistorico();

  tentativasRestantes--;

  if (palpite === numeroSecreto) {
    document.getElementById("mensagem").textContent =
      " Parabéns! Você acertou o número secreto!";
    encerrarJogo();
  } else if (tentativasRestantes > 0) {
    if (palpite < numeroSecreto) {
      document.getElementById("mensagem").textContent =
        " O número secreto é MAIOR!";
    } else {
      document.getElementById("mensagem").textContent =
        " O número secreto é MENOR!";
    }
    document.getElementById("tentativas").textContent =
      "Tentativas restantes: " + tentativasRestantes;
  } else {
    document.getElementById("mensagem").textContent =
      " Você perdeu! O número secreto era " + numeroSecreto;
    encerrarJogo();
  }

  document.getElementById("palpite").value = "";
}

// Função para atualizar histórico
function atualizarHistorico() {
  document.getElementById("historico").textContent =
    " Palpites: " + palpitesFeitos.join(", ");
}


// Função para encerrar o jogo
function encerrarJogo() {
  document.getElementById("palpite").disabled = true;
  document.getElementById("btnChutar").disabled = true;
  document.getElementById("btnReiniciar").style.display = "inline-block";
  document.getElementById("tentativas").textContent = "";
}


// Função para reiniciar
function reiniciar() {
  iniciarJogo();
}


// Inicia automaticamente quando a página carrega
window.onload = iniciarJogo;
