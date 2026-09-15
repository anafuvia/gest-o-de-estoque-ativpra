# ENTREGA 01 — Requisitos Funcionais

## RF01 — Autenticação
O sistema deve permitir que o usuário acesse o sistema por meio de usuário e senha.

## RF02 — Tratamento de falha no login
Quando a autenticação falhar, o sistema deve informar o motivo e redirecionar novamente para a tela de autenticação.

## RF03 — Identificação do usuário logado
A interface principal deve exibir o nome do usuário autenticado.

## RF04 — Logout
O sistema deve permitir logout e redirecionar o usuário para a tela de login.

## RF05 — Acesso ao cadastro de produtos
A interface principal deve oferecer um meio de acessar a interface de cadastro de produtos.

## RF06 — Acesso à gestão de estoque
A interface principal deve oferecer um meio de acessar a interface de gestão de estoque.

## RF07 — Listagem automática de produtos
Ao entrar na tela de cadastro, os produtos existentes no banco devem ser carregados automaticamente em tabela.

## RF08 — Pesquisa de produtos
O usuário deve poder pesquisar produtos por termo, atualizando a tabela apenas com os registros correspondentes.

## RF09 — Cadastro de produto
O usuário deve poder cadastrar novos produtos com nome, categoria, unidade, descrição, estoque atual e estoque mínimo.

## RF10 — Edição de produto
O usuário deve poder alterar os dados de um produto existente.

## RF11 — Exclusão de produto
O usuário deve poder excluir um produto quando não houver movimentações históricas vinculadas a ele.

## RF12 — Validação de dados
O sistema deve validar campos obrigatórios, números negativos e demais valores inválidos, exibindo mensagem ao usuário.

## RF13 — Retorno à interface principal
As telas internas devem fornecer um meio para retornar ao painel principal.

## RF14 — Produtos em ordem alfabética
Na gestão de estoque, os produtos devem ser exibidos em ordem alfabética por meio de um algoritmo de ordenação. O sistema utiliza Insertion Sort.

## RF15 — Movimentação de estoque
O usuário deve selecionar um produto e registrar uma movimentação do tipo entrada ou saída.

## RF16 — Data da movimentação
O sistema deve permitir informar a data em que a movimentação ocorreu.

## RF17 — Atualização automática de saldo
Uma entrada deve aumentar o estoque atual e uma saída deve diminuí-lo.

## RF18 — Impedir saída superior ao saldo
O sistema deve impedir uma movimentação de saída quando a quantidade solicitada for maior que o estoque disponível.

## RF19 — Alerta de estoque mínimo
Após uma saída, o sistema deve verificar automaticamente o saldo e alertar quando ele ficar abaixo do estoque mínimo configurado.

## RF20 — Histórico e rastreabilidade
O sistema deve registrar histórico de movimentações contendo produto, tipo, quantidade, data e usuário responsável.
