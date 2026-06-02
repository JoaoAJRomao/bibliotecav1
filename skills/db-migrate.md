---
name: executar_migracao_banco
description: Use esta habilidade sempre que o esquema do Drizzle ORM for alterado e o banco local precisar ser atualizado.
tools:
  - type: bash_command
    command: "npm run db:generate && npm run db:migrate"
---