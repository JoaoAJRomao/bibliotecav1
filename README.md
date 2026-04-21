# Desafio Final - Orquestração de Clusters (bibliotecav1)

Este projeto consiste em um sistema de biblioteca containerizado e orquestrado via Kubernetes (Kind), atendendo aos requisitos da pós-graduação em Engenharia de Software - DevOps (UNIFOR).

## 🚀 Estrutura do Projeto

- **Frontend**: Next.js (Porta 3000)
- **Backend**: Node.js/TypeScript (Porta 3001)
- **Banco de Dados**: PostgreSQL 15 (Porta 5432)

## 🛠️ Pré-requisitos (Ambiente Linux Mint)

1. Docker instalado.
2. Kind instalado.
3. kubectl instalado.

## 📦 Como Rodar o Projeto

### 1. Preparar o Cluster
```bash
kind create cluster --name desafio-unifor --config k8s/kind-config.yaml
```

### 2. Configurar Segredos
Crie o arquivo k8s/secret.yaml baseado no k8s/secret-example.yaml.
Para gerar os valores em base64 no terminal:
```bash
echo -n 'sua_senha' | base64
```

### 3. Aplicar Manifestos
```bash
kubectl apply -f k8s/
```

### 4. Verificar Status
```bash
kubectl get pods -o wide
```

### 5. Acessar Aplicação
Abra o navegador em: http://localhost:8080

```bash
# Frontend
kubectl port-forward svc/frontend-service 3000:80

# Backend
kubectl port-forward svc/backend-service 3001:80
```

### 6. Acessar Banco de Dados
```bash
kubectl port-forward svc/postgres-service 5432:5432
```

### 7. Acessar Aplicação Mobile
```bash
# Substitua <IP_ADDRESS> pelo IP do seu host Linux
http://<IP_ADDRESS>:3000
```

## 🛠️ Comandos Úteis

### Limpar Cluster
```bash
kind delete cluster --name desafio-unifor
```

### Verificar Logs
```bash
kubectl logs -f deployment/frontend
kubectl logs -f deployment/backend
```

### Remover Aplicação
```bash
kubectl delete -f k8s/
```

### Validação de Persistência (Critério Obrigatório)

Para comprovar que o **StatefulSet** e o **PVC** estão funcionando:

1. Acesse o sistema e cadastre um novo livro.

2. No terminal, identifique o pod do banco e delete-o:

```bash
kubectl delete pod <nome-do-pod-do-banco>
```

3. Aguarde o pod ser recriado (o StatefulSet fará isso automaticamente - ```kubectl get pods -w```).

4. Atualize a página do navegador. O livro cadastrado deve continuar visível, provando que os dados não foram perdidos com o reinício do container.

### Recursos Kubernetes Utilizados

- StatefulSet: Garantia de identidade e persistência do banco de dados.

- Probes: Liveness e Readiness configurados nos Deployments.

- ConfigMap/Secret: Separação de configurações e dados sensíveis.

- NodePort: Mapeamento para acesso via host (Linux Mint).

## 📝 Observações

- O Kind cria um cluster Kubernetes localmente.
- Os segredos são injetados via Secret.
- As variáveis de ambiente são injetadas via ConfigMap.
- Os serviços são expostos via Service.
- Os deployments são gerenciados via Deployment.

## 📚 Referências

- [Kind](https://kind.sigs.k8s.io/)
- [Kubernetes](https://kubernetes.io/)
- [Next.js](https://nextjs.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## 👥 Autores

- [Seu Nome] - [Seu Email]

## 📄 Licença

Este projeto é de uso exclusivo para fins acadêmicos no âmbito da disciplina de Engenharia de Software - DevOps (UNIFOR).
