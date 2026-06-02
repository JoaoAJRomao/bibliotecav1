# Contexto do Projeto: Biblioteca V1

Este projeto é um sistema de gerenciamento de biblioteca desenvolvido com Next.js e banco de dados via Drizzle ORM.

## Regras de Negócio e Fluxos Críticos:
1. **Autenticação:** O sistema possui dois níveis de acesso: `admin` e `user`. O login é feito na rota `/login`.
2. **Ambiente de Testes:** Para testes E2E com Playwright, as credenciais de teste válidas estão no arquivo `.env.test`.
3. **Fluxo Principal:** O fluxo mais crítico que precisa de cobertura de testes automatizados é o login de usuário e a reserva de um livro.
4. **Banco de Dados:** Usamos Docker para rodar o banco local. O comando para resetar o banco entre os testes é `npm run db:reset`.