let onibus;             // O ônibus escolar
let alunos = [];        // Lista de alunos nas paradas
let obstaculos = [];    // Lista de obstáculos
let arvores = [];       // Lista de árvores no cenário
let animais = [];       // Lista de animais no cenário
let pontuacao = 0;      // Pontuação do jogador
let fimDeJogo = false;  // Flag de fim de jogo
let velocidadeOnibus = 5; // Velocidade do ônibus

let proximoAlunoMenina = false; // Variável para controlar qual emoji de aluno será usado

let larguraEstrada = 200; // A estrada terá 200 pixels de largura

// **Novo**: Variável para controlar o estado do jogo
let estadoDoJogo = "instrucoes"; // Pode ser "instrucoes", "jogando", "gameover"

// **Novo**: Botões
let botaoJogar;
let botaoTentarNovamente;

function setup() {
  createCanvas(600, 400); // Tamanho original da tela
  
  // Cria o ônibus, mas só o exibe quando o jogo começar
  onibus = new Onibus(width / 2, height - 60); 

  // **Novo**: Configura o botão "Jogar" para a tela de instruções
  botaoJogar = createButton('Jogar');
  botaoJogar.position(width / 2 - 50, height / 2 + 80); // Centraliza
  botaoJogar.mousePressed(iniciarJogo); // Chama a função para iniciar o jogo
  botaoJogar.hide(); // Começa escondido, será mostrado na tela de instruções

  // **Novo**: Configura o botão "Tentar Novamente" para a tela de Game Over
  botaoTentarNovamente = createButton('Tentar Novamente');
  botaoTentarNovamente.position(width / 2 - 70, height / 2 + 80); // Centraliza
  botaoTentarNovamente.mousePressed(reiniciarJogo); // Chama a função para reiniciar
  botaoTentarNovamente.hide(); // Começa escondido
}

function draw() {
  // O que é desenhado depende do estado do jogo
  if (estadoDoJogo === "instrucoes") {
    desenharTelaInstrucoes();
  } else if (estadoDoJogo === "jogando") {
    jogar();
  } else if (estadoDoJogo === "gameover") {
    desenharTelaGameOver();
  }
}

// **Novo**: Função para exibir a tela de instruções
function desenharTelaInstrucoes() {
  background(220); // Fundo cinza claro para a tela de instruções
  fill(0, 100, 0); // Verde escuro
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Pegue os Alunos!", width / 2, height / 2 - 80);

  textSize(18);
  fill(50); // Cinza mais escuro
  text("Use as SETAS LATERAIS (← →) para mover o ônibus.", width / 2, height / 2 - 20);
  text("Pegue os alunos (👦👧) para ganhar pontos.", width / 2, height / 2 + 10);
  text("Cuidado com os obstáculos (⚫🚧)! Se bater, é FIM DE JOGO.", width / 2, height / 2 + 40);

  botaoJogar.show(); // Mostra o botão "Jogar"
  botaoTentarNovamente.hide(); // Garante que o outro botão esteja escondido
  noLoop(); // Para o loop principal para economizar recursos
}

// **Novo**: Função para iniciar o jogo
function iniciarJogo() {
  estadoDoJogo = "jogando";
  botaoJogar.hide(); // Esconde o botão "Jogar"
  loop(); // Reinicia o loop principal do draw
}

// **Novo**: Função para exibir a tela de Game Over
function desenharTelaGameOver() {
  // Certifique-se de que o fundo e a estrada foram desenhados uma última vez
  definirGradiente(0, 0, width, height, color(144, 238, 144), color(34, 139, 34), "vertical");
  desenharEstrada();

  fill(255, 69, 0); // Vermelho-alaranjado para o texto de fim de jogo
  textSize(40);
  textAlign(CENTER, CENTER);
  text("FIM DE JOGO!", width / 2, height / 2 - 20);
  textSize(30);
  text("Pontuação Final: " + pontuacao, width / 2, height / 2 + 40);

  botaoTentarNovamente.show(); // Mostra o botão "Tentar Novamente"
  botaoJogar.hide(); // Garante que o outro botão esteja escondido
  noLoop(); // Para o loop para o Game Over
}

// **Novo**: Função para reiniciar o jogo
function reiniciarJogo() {
  // Reseta todas as variáveis do jogo
  pontuacao = 0;
  fimDeJogo = false;
  alunos = [];
  obstaculos = [];
  arvores = [];
  animais = [];
  onibus = new Onibus(width / 2, height - 60); // Reinicia a posição do ônibus

  estadoDoJogo = "jogando"; // Volta para o estado de jogo
  botaoTentarNovamente.hide(); // Esconde o botão "Tentar Novamente"
  loop(); // Reinicia o loop do jogo
}


// Função principal do jogo (renomeada de 'draw' para 'jogar')
function jogar() {
  // Fundo gradiente de verde para simular uma paisagem florestal
  definirGradiente(0, 0, width, height, color(144, 238, 144), color(34, 139, 34), "vertical");

  // Desenha a estrada ANTES da pontuação para que a pontuação fique visível
  desenharEstrada();

  // Exibe a pontuação
  fill(0, 100, 0); // Verde escuro para a pontuação
  textSize(28);
  textAlign(LEFT, CENTER);
  text("Pontuação: " + pontuacao, 20, 30);

  // Cria alunos, obstáculos, árvores e animais aleatoriamente
  if (frameCount % 100 === 0) { // a cada 1.6 segundos (aprox.)
    // Cria um novo aluno, alternando entre menino e menina. Posição ajustada à nova largura da estrada.
    alunos.push(new Aluno(random(width / 2 - (larguraEstrada / 2) + 20, width / 2 + (larguraEstrada / 2) - 20), -50, proximoAlunoMenina ? "menina" : "menino"));
    proximoAlunoMenina = !proximoAlunoMenina; // Inverte para o próximo aluno

    if (random() < 0.7) { // 70% de chance para um obstáculo regular. Posição ajustada.
      obstaculos.push(new Obstaculo(random(width / 2 - (larguraEstrada / 2) + 20, width / 2 + (larguraEstrada / 2) - 20), -50, "rocha")); // Obstáculo de rocha
    } else { // 30% de chance para um novo obstáculo. Posição ajustada.
      obstaculos.push(new Obstaculo(random(width / 2 - (larguraEstrada / 2) + 20, width / 2 + (larguraEstrada / 2) - 20), -50, "cone")); // Obstáculo de cone
    }

    // Cria árvores nos dois lados da paisagem verde
    if (random() < 0.7) { // 70% de chance de gerar uma árvore
      let lado = random() < 0.5 ? "esquerda" : "direita"; // Escolhe um lado aleatoriamente
      arvores.push(new Arvore(lado, -50));
    }

    // Cria animais aleatoriamente nas laterais verdes
    if (random() < 0.4) { // 40% de chance de gerar um animal
        let lado = random() < 0.5 ? "esquerda" : "direita";
        animais.push(new Animal(lado, -50));
    }
  }

  // Atualiza e desenha as árvores
  for (let i = arvores.length - 1; i >= 0; i--) {
    arvores[i].atualizar();
    arvores[i].exibir();
    if (arvores[i].y > height) {
      arvores.splice(i, 1); // Remove a árvore depois de ela passar da tela
    }
  }

  // Atualiza e desenha os animais
  for (let i = animais.length - 1; i >= 0; i--) {
    animais[i].atualizar();
    animais[i].exibir();
    if (animais[i].y > height) {
      animais.splice(i, 1); // Remove o animal depois de ele passar da tela
    }
  }

  // Atualiza e desenha os alunos
  for (let i = alunos.length - 1; i >= 0; i--) {
    alunos[i].atualizar();
    alunos[i].exibir();

    if (alunos[i].y > height) {
      alunos.splice(i, 1); // Remove o aluno depois de ele passar da tela
    } else if (alunos[i].colideComOnibus(onibus)) {
      pontuacao += 10; // Ganha pontos por pegar o aluno
      alunos.splice(i, 1); // Remove o aluno depois de pegar
    }
  }

  // Atualiza e desenha os obstáculos
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].atualizar();
    obstaculos[i].exibir();

    if (obstaculos[i].y > height) {
      obstaculos.splice(i, 1); // Remove o obstáculo depois de ele passar da tela
    } else if (obstaculos[i].colideComOnibus(onibus)) {
      fimDeJogo = true; // Perde o jogo se colidir com um obstáculo
      // **Novo**: Quando o jogo termina, muda o estado e mostra o botão
      estadoDoJogo = "gameover";
      noLoop(); // Para o loop para mostrar a tela de game over
    }
  }

  // Atualiza e exibe o ônibus
  onibus.atualizar();
  onibus.exibir();
}


// Funções e Classes auxiliares (mantidas as mesmas, exceto pelos pequenos ajustes nas margens e limites)
function definirGradiente(x, y, w, h, c1, c2, eixo) {
  noFill();
  if (eixo === "vertical") {
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (eixo === "horizontal") {
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function desenharEstrada() {
  fill(80, 80, 80); 
  rect(width / 2 - (larguraEstrada / 2), 0, larguraEstrada, height);
  stroke(255, 255, 0); 
  strokeWeight(5);
  for (let i = 0; i < height; i += 60) {
    line(width / 2, i, width / 2, i + 30);
  }
}

class Onibus {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.largura = 60;
    this.altura = 40;
    this.velocidade = velocidadeOnibus;
    this.emoji = "🚌";
  }

  atualizar() {
    let limiteEsquerdo = width / 2 - (larguraEstrada / 2) + this.largura / 2;
    let limiteDireito = width / 2 + (larguraEstrada / 2) - this.largura / 2;

    if (keyIsDown(LEFT_ARROW) && this.x > limiteEsquerdo) {
      this.x -= this.velocidade;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < limiteDireito) {
      this.x += this.velocidade;
    }
  }

  exibir() {
    textSize(45);
    text(this.emoji, this.x - 20, this.y + 15);
  }
}

class Aluno {
  constructor(x, y, genero) {
    this.x = x;
    this.y = y;
    this.tamanho = 30;
    this.velocidade = 3.5;
    this.emoji = (genero === "menina") ? "👧" : "👦"; 
  }

  atualizar() {
    this.y += this.velocidade;
  }

  colideComOnibus(onibus) {
    return (
      this.x > onibus.x - 20 &&
      this.x < onibus.x + 20 &&
      this.y + this.tamanho / 2 > onibus.y
    );
  }

  exibir() {
    textSize(35);
    text(this.emoji, this.x - 15, this.y);
  }
}

class Obstaculo {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.tamanho = 40;
    this.velocidade = 5;
    this.tipo = tipo;
  }

  atualizar() {
    this.y += this.velocidade;
  }

  colideComOnibus(onibus) {
    return (
      this.x > onibus.x - 20 &&
      this.x < onibus.x + 20 &&
      this.y + this.tamanho / 2 > onibus.y
    );
  }

  exibir() {
    if (this.tipo === "rocha") {
      fill(120, 120, 120);
      ellipse(this.x, this.y, this.tamanho, this.tamanho);
    } else if (this.tipo === "cone") {
      textSize(40);
      text("🚧", this.x - 20, this.y + 10);
    }
  }
}

class Arvore {
  constructor(lado, y) {
    this.y = y;
    this.velocidade = 2;
    this.emoji = "🌳";

    let margemBorda = 20;
    let margemEstrada = 45; // Aumentada ligeiramente para garantir distância

    if (lado === "esquerda") {
      this.x = random(margemBorda, (width / 2 - (larguraEstrada / 2)) - margemEstrada);
    } else {
      this.x = random((width / 2 + (larguraEstrada / 2)) + margemEstrada, width - margemBorda);
    }
  }

  atualizar() {
    this.y += this.velocidade;
  }

  exibir() {
    textSize(50);
    text(this.emoji, this.x, this.y);
  }
}

class Animal {
  constructor(lado, y) {
    this.y = y;
    this.velocidade = 3;
    
    const emojisAnimais = ["🦊", "🐰", "🐻", "🦌", "🐿️"];
    this.emoji = random(emojisAnimais);

    let margemBorda = 10;
    let margemEstrada = 25; // Aumentada ligeiramente

    if (lado === "esquerda") {
      this.x = random(margemBorda, (width / 2 - (larguraEstrada / 2)) - margemEstrada);
    } else {
      this.x = random((width / 2 + (larguraEstrada / 2)) + margemEstrada, width - margemBorda);
    }
  }

  atualizar() {
    this.y += this.velocidade;
  }

  exibir() {
    textSize(35);
    text(this.emoji, this.x, this.y);
  }
}