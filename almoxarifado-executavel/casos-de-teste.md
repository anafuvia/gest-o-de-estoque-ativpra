# ENTREGA 08 — Descritivo de Casos de Teste de Software

## 8.1 Casos de teste

| ID | Requisito | Caso de teste | Resultado esperado |
|---|---|---|---|
| CT01 | RF01 | Login com `ana` e senha `1234` | Usuário entra no sistema e visualiza o painel. |
| CT02 | RF02 | Login com senha incorreta | Sistema informa “Usuário ou senha incorretos” e retorna à tela de login. |
| CT03 | RF03 | Abrir painel após login | Nome do usuário autenticado é exibido. |
| CT04 | RF04 | Clicar em “Sair” | Sessão é finalizada e usuário volta ao login. |
| CT05 | RF05 | Clicar em “Cadastro de Produtos” | Tela de produtos é aberta. |
| CT06 | RF06 | Clicar em “Gestão de Estoque” | Tela de estoque é aberta. |
| CT07 | RF07 | Abrir cadastro de produtos | Tabela é carregada automaticamente com os registros do banco. |
| CT08 | RF08 | Pesquisar por “PET” | A tabela mostra apenas registros correspondentes ao termo. |
| CT09 | RF09 | Preencher dados válidos e salvar novo produto | Produto é inserido no banco e aparece na tabela. |
| CT10 | RF10 | Editar nome/categoria de um produto | Dados alterados são persistidos e exibidos. |
| CT11 | RF11 | Excluir produto sem histórico | Produto é removido. |
| CT12 | RF11 | Excluir produto com histórico | Sistema impede a exclusão e exibe mensagem explicativa. |
| CT13 | RF12 | Tentar cadastrar com campo obrigatório vazio | Sistema impede o cadastro. |
| CT14 | RF12 | Informar estoque negativo | Sistema informa que o valor não pode ser negativo. |
| CT15 | RF13 | Clicar em “Voltar” em uma tela interna | Usuário retorna ao painel principal. |
| CT16 | RF14 | Abrir gestão de estoque | Produtos aparecem em ordem alfabética. |
| CT17 | RF15/RF17 | Entrada de 10 unidades | Saldo do produto aumenta em 10. |
| CT18 | RF15/RF17 | Saída de 5 unidades | Saldo do produto diminui em 5. |
| CT19 | RF16 | Informar uma data e registrar movimentação | Data informada aparece no histórico. |
| CT20 | RF18 | Tentar saída maior que o saldo | Sistema bloqueia a operação. |
| CT21 | RF19 | Fazer saída que deixe saldo abaixo do mínimo | Sistema exibe alerta automático de estoque mínimo. |
| CT22 | RF20 | Registrar movimentação | Histórico registra produto, tipo, quantidade, data e responsável. |

## 8.2 Ferramentas e ambientes de teste

- Sistema operacional: Windows 10 ou Windows 11.
- Navegador: Google Chrome 120 ou superior.
- Runtime: Node.js 22 LTS.
- Banco de dados: SQLite 3, executado no projeto por meio da biblioteca `sql.js`.
- Testes funcionais: execução manual no navegador.
- Inspeção de requisições: DevTools do Google Chrome, aba Network.
- Verificação do banco: DB Browser for SQLite, opcional.
- Editor recomendado: Visual Studio Code.
