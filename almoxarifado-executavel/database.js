const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const DB_PATH = path.join(__dirname, "almoxarifado_db.sqlite");
let SQL;
let db;

function saveDatabase() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function get(sql, params = []) {
  return all(sql, params)[0] || null;
}

async function initDatabase() {
  SQL = await initSqlJs({
    locateFile: file => path.join(__dirname, "node_modules", "sql.js", "dist", file)
  });

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run("PRAGMA foreign_keys = ON;");

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      usuario TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      descricao TEXT,
      unidade TEXT NOT NULL,
      estoque_atual INTEGER NOT NULL DEFAULT 0 CHECK (estoque_atual >= 0),
      estoque_minimo INTEGER NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0)
    );

    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      tipo TEXT NOT NULL CHECK (tipo IN ('entrada','saida')),
      quantidade INTEGER NOT NULL CHECK (quantidade > 0),
      data_movimentacao TEXT NOT NULL,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
    );
  `);

  const totalUsuarios = get("SELECT COUNT(*) AS total FROM usuarios").total;
  if (totalUsuarios === 0) {
    db.run(`
      INSERT INTO usuarios (nome, usuario, senha) VALUES
      ('Ana Souza', 'ana', '1234'),
      ('Carlos Lima', 'carlos', '1234'),
      ('Marina Alves', 'marina', '1234');
    `);
  }

  const totalProdutos = get("SELECT COUNT(*) AS total FROM produtos").total;
  if (totalProdutos === 0) {
    db.run(`
      INSERT INTO produtos (nome, categoria, descricao, unidade, estoque_atual, estoque_minimo) VALUES
      ('Caixa de Papelão 30x20x15', 'Caixas', 'Caixa onda simples, gramatura 400 g/m²', 'unidade', 120, 40),
      ('Frasco PET 500 ml', 'Frascos', 'Frasco plástico transparente com tampa rosqueável', 'unidade', 80, 30),
      ('Filme Stretch 50 cm', 'Filmes', 'Bobina para paletização e proteção de cargas', 'rolo', 25, 15);
    `);
  }

  const totalMov = get("SELECT COUNT(*) AS total FROM movimentacoes").total;
  if (totalMov === 0) {
    db.run(`
      INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data_movimentacao) VALUES
      (1, 1, 'entrada', 50, '2026-09-10'),
      (2, 2, 'saida', 10, '2026-09-11'),
      (3, 3, 'entrada', 5, '2026-09-12');
    `);
  }

  saveDatabase();
}

module.exports = { initDatabase, run, all, get };
