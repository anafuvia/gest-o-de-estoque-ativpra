# Sistema de Gestão de Estoque — Indústria de Embalagens

Projeto desenvolvido para a atividade prática de desenvolvimento de um sistema de gestão de estoque.

## Funcionalidades

- Login e logout.
- Identificação do usuário logado.
- Cadastro, busca, edição e exclusão de produtos.
- Validação de campos.
- Gestão de entradas e saídas.
- Bloqueio de saída superior ao saldo.
- Alerta automático de estoque abaixo do mínimo.
- Produtos em ordem alfabética usando **Insertion Sort**.
- Histórico completo de movimentações com responsável e data.

## Como executar

1. Instale o Node.js 22 LTS.
2. Abra o terminal dentro da pasta `sistema`.
3. Execute:

```bash
npm install
npm start
```

4. Abra no navegador:

```text
http://localhost:3000/login.html
```

## Usuários de teste

| Usuário | Senha |
|---|---|
| ana | 1234 |
| carlos | 1234 |
| marina | 1234 |

## Estrutura

```text
almoxarifado/
├── requisitos-funcionais.md
├── DER.png
├── almoxarifado_db.sql
├── casos-de-teste.md
├── infraestrutura.md
├── README.md
└── sistema/
    ├── server.js
    ├── database.js
    ├── package.json
    └── public/
        ├── login.html
        ├── index.html
        ├── produtos.html
        ├── estoque.html
        ├── app.js
        └── style.css
```

## Observação sobre segurança

As senhas estão em texto simples apenas para simplificar a atividade escolar. Em um sistema real, devem ser armazenadas com hash seguro, por exemplo usando bcrypt.
