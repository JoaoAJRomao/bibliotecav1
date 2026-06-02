---
name: check_bundle_size
description: Executa o build de produção do Next.js para analisar o tamanho final do bundle dos componentes e rotas. Use sempre que o impacto de performance ou introdução de novas bibliotecas precisar ser avaliado.
tools:
  - type: bash_command
    command: "npm run build"
---

# Auditoria de Performance e Tamanho de Bundle

Esta habilidade compila a aplicação Next.js e exibe o relatório detalhado de tamanho (em KB/MB) de cada rota, permitindo identificar gargalos de carregamento, importações redundantes ou componentes de servidor criados incorretamente como componentes de cliente.