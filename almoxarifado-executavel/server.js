const express = require("express");
const session = require("express-session");
const path = require("path");
const { initDatabase, run, all, get } = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "estoque-embalagens-chave-escolar",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4 }
}));

app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: "Usuário não autenticado." });
  }
  next();
}

app.post("/api/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ erro: "Informe usuário e senha." });
  }

  const encontrado = get(
    "SELECT id, nome, usuario FROM usuarios WHERE usuario = ? AND senha = ?",
    [usuario.trim(), senha]
  );

  if (!encontrado) {
    return res.status(401).json({ erro: "Usuário ou senha incorretos." });
  }

  req.session.usuario = encontrado;
  res.json({ mensagem: "Login realizado com sucesso.", usuario: encontrado });
});

app.get("/api/me", auth, (req, res) => {
  res.json(req.session.usuario);
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ mensagem: "Logout realizado." }));
});

app.get("/api/produtos", auth, (req, res) => {
  const busca = String(req.query.busca || "").trim();
  let produtos;

  if (busca) {
    const termo = `%${busca}%`;
    produtos = all(
      `SELECT * FROM produtos
       WHERE nome LIKE ? OR categoria LIKE ? OR descricao LIKE ?
       ORDER BY id DESC`,
      [termo, termo, termo]
    );
  } else {
    produtos = all("SELECT * FROM produtos ORDER BY id DESC");
  }

  res.json(produtos);
});

app.post("/api/produtos", auth, (req, res) => {
  const { nome, categoria, descricao, unidade, estoque_atual, estoque_minimo } = req.body;
  const atual = Number(estoque_atual);
  const minimo = Number(estoque_minimo);

  if (!nome || !categoria || !unidade || Number.isNaN(atual) || Number.isNaN(minimo)) {
    return res.status(400).json({ erro: "Preencha corretamente todos os campos obrigatórios." });
  }
  if (atual < 0 || minimo < 0) {
    return res.status(400).json({ erro: "Estoque atual e mínimo não podem ser negativos." });
  }

  run(
    `INSERT INTO produtos (nome, categoria, descricao, unidade, estoque_atual, estoque_minimo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome.trim(), categoria.trim(), (descricao || "").trim(), unidade.trim(), atual, minimo]
  );

  res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
});

app.put("/api/produtos/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const produto = get("SELECT * FROM produtos WHERE id = ?", [id]);
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado." });

  const { nome, categoria, descricao, unidade, estoque_atual, estoque_minimo } = req.body;
  const atual = Number(estoque_atual);
  const minimo = Number(estoque_minimo);

  if (!nome || !categoria || !unidade || Number.isNaN(atual) || Number.isNaN(minimo)) {
    return res.status(400).json({ erro: "Preencha corretamente todos os campos obrigatórios." });
  }
  if (atual < 0 || minimo < 0) {
    return res.status(400).json({ erro: "Valores de estoque não podem ser negativos." });
  }

  run(
    `UPDATE produtos
     SET nome = ?, categoria = ?, descricao = ?, unidade = ?, estoque_atual = ?, estoque_minimo = ?
     WHERE id = ?`,
    [nome.trim(), categoria.trim(), (descricao || "").trim(), unidade.trim(), atual, minimo, id]
  );

  res.json({ mensagem: "Produto atualizado com sucesso." });
});

app.delete("/api/produtos/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const produto = get("SELECT * FROM produtos WHERE id = ?", [id]);
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado." });

  const mov = get("SELECT COUNT(*) AS total FROM movimentacoes WHERE produto_id = ?", [id]);
  if (mov.total > 0) {
    return res.status(400).json({
      erro: "Este produto possui histórico de movimentações e não pode ser excluído."
    });
  }

  run("DELETE FROM produtos WHERE id = ?", [id]);
  res.json({ mensagem: "Produto excluído com sucesso." });
});

// Algoritmo de ordenação pedido na atividade: Insertion Sort
function insertionSortPorNome(lista) {
  const arr = [...lista];

  for (let i = 1; i < arr.length; i++) {
    const atual = arr[i];
    let j = i - 1;

    while (
      j >= 0 &&
      arr[j].nome.localeCompare(atual.nome, "pt-BR", { sensitivity: "base" }) > 0
    ) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = atual;
  }

  return arr;
}

app.get("/api/estoque/produtos", auth, (req, res) => {
  const produtos = all("SELECT * FROM produtos");
  res.json(insertionSortPorNome(produtos));
});

app.post("/api/movimentacoes", auth, (req, res) => {
  const produtoId = Number(req.body.produto_id);
  const quantidade = Number(req.body.quantidade);
  const tipo = req.body.tipo;
  const data = req.body.data_movimentacao;

  if (!produtoId || !quantidade || quantidade <= 0 || !["entrada", "saida"].includes(tipo) || !data) {
    return res.status(400).json({ erro: "Preencha corretamente os dados da movimentação." });
  }

  const produto = get("SELECT * FROM produtos WHERE id = ?", [produtoId]);
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado." });

  let novoEstoque = Number(produto.estoque_atual);

  if (tipo === "entrada") {
    novoEstoque += quantidade;
  } else {
    if (quantidade > novoEstoque) {
      return res.status(400).json({ erro: "Saída maior que o estoque disponível." });
    }
    novoEstoque -= quantidade;
  }

  run(
    "UPDATE produtos SET estoque_atual = ? WHERE id = ?",
    [novoEstoque, produtoId]
  );

  run(
    `INSERT INTO movimentacoes
      (produto_id, usuario_id, tipo, quantidade, data_movimentacao)
     VALUES (?, ?, ?, ?, ?)`,
    [produtoId, req.session.usuario.id, tipo, quantidade, data]
  );

  const abaixoMinimo = tipo === "saida" && novoEstoque < Number(produto.estoque_minimo);

  res.status(201).json({
    mensagem: "Movimentação registrada com sucesso.",
    estoque_atual: novoEstoque,
    abaixo_minimo: abaixoMinimo,
    alerta: abaixoMinimo
      ? `ALERTA: ${produto.nome} está abaixo do estoque mínimo (${novoEstoque}/${produto.estoque_minimo}).`
      : null
  });
});

app.get("/api/movimentacoes", auth, (req, res) => {
  const registros = all(`
    SELECT
      m.id,
      p.nome AS produto,
      m.tipo,
      m.quantidade,
      m.data_movimentacao,
      u.nome AS responsavel
    FROM movimentacoes m
    INNER JOIN produtos p ON p.id = m.produto_id
    INNER JOIN usuarios u ON u.id = m.usuario_id
    ORDER BY m.id DESC
  `);

  res.json(registros);
});

async function iniciarServidor() {
  try {
    await initDatabase();

    const server = app.listen(PORT, "127.0.0.1", () => {
      console.log("");
      console.log("==============================================");
      console.log(" SISTEMA DE ALMOXARIFADO RODANDO");
      console.log(` http://127.0.0.1:${PORT}/login.html`);
      console.log("==============================================");
      console.log("Nao feche este terminal enquanto estiver usando.");
    });

    server.on("error", (erro) => {
      console.error("Erro no servidor:", erro);
    });

    global.httpServer = server;
  } catch (erro) {
    console.error("Erro ao iniciar o sistema:", erro);
    process.exitCode = 1;
  }
}

iniciarServidor();
