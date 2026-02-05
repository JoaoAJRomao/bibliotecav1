pipeline {
    agent any

    environment {
        // Configurações para o Next.js e Drizzle reconhecerem o banco durante o build/test
        DATABASE_URL = "postgresql://postgres:password@db:5432/librarie"
        NODE_ENV = "production"
    }

    stages {
        stage('Checkout') {
            steps {
                // Garante que estamos na branch correta
                script {
                    echo "Baixando código da branch DEV..."
                }
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Instalando dependências do projeto..."
                sh 'npm install'
            }
        }

        stage('Database Migration') {
            steps {
                echo "Sincronizando banco de dados com Drizzle..."
                // Usa o drizzle-kit para garantir que as tabelas existam no banco do Docker
                sh 'npx drizzle-kit push'
            }
        }

        stage('Build') {
            steps {
                echo "Gerando o build otimizado do Next.js..."
                sh 'npm run build'
            }
        }
        
    }

    post {
        success {
            echo "Pipeline finalizada com sucesso!"
        }
        failure {
            echo "A Pipeline falhou. Verifique os logs e os testes do Playwright."
        }
    }
}