---
name: analyze_project_structure
description: Use esta habilidade para mapear e visualizar a árvore de diretórios atual do projeto, ignorando arquivos de configuração pesados e dependências. Útil para auditorias de arquitetura e validação da estrutura de pastas.
tools:
  - type: bash_command
    command: "tree -I 'node_modules|.next|.git|public' -F"
---

# Mapeamento Estrutural do Projeto

Esta habilidade permite ao agente ler a organização física dos arquivos do repositório para garantir que os padrões de arquitetura (como o App Router do Next.js) estão sendo seguidos corretamente.