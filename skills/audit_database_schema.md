---
name: audit_database_schema
description: Compara os arquivos de esquema locais do Drizzle ORM com o estado atual do banco de dados ou das migrações geradas. Use para garantir que a estrutura de tabelas do banco está síncrona.
tools:
  - type: bash_command
    command: "npx drizzle-kit check"
---

# Auditoria de Esquema de Banco de Dados

Esta habilidade invoca o utilitário do Drizzle Kit para verificar se existem tabelas, colunas ou relacionamentos declarados no código TypeScript que ainda não foram convertidos em migrações SQL ou aplicados no banco local.