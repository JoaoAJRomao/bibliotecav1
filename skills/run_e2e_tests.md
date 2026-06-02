---
name: run_e2e_tests
description: Executa a suíte de testes ponta a ponta (E2E) utilizando o framework Playwright no ambiente local. Use para validar cenários de interface críticos, fluxos de autenticação ou interações de formulário reais.
tools:
  - type: bash_command
    command: "npx playwright test"
---

# Execução de Testes E2E com Playwright

Esta habilidade dispara os testes simulados no navegador. O agente analisa a saída do terminal para verificar se todas as asserções de interface e fluxos funcionais passaram com sucesso ou se há falhas de seletores e timeouts.