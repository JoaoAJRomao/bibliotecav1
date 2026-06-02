---
name: run_unit_tests
description: Executa todos os testes unitários e de integração de funções isoladas no ecossistema utilizando o Vitest. Use para garantir que refatorações ou novos códigos de lógica de negócios não geraram regressões.
tools:
  - type: bash_command
    command: "npx vitest run"
---

# Execução de Testes Unitários com Vitest

Esta habilidade roda o executor de testes rápidos (Vitest) em modo de execução única (*run mode*). É ideal para o agente validar a integridade de funções utilitárias, hooks e lógica pura do servidor de forma rápida.