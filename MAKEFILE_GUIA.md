# 📘 Guia do Makefile - CS Skin GO API

## 🚀 Como Usar

Execute `make` ou `make help` para ver todos os comandos disponíveis.

```bash
make help
```

---

## 🎯 Comandos Mais Usados

### Primeiro Uso (Setup Completo)
```bash
# Configurar tudo de uma vez
make first-run
```
Este comando faz:
1. Instala dependências
2. Cria arquivo .env
3. Cria banco de dados
4. Executa seeds
5. Inicia a aplicação

### Uso Diário
```bash
# Iniciar aplicação em desenvolvimento
make start
# ou
make dev

# Ver documentação
make docs
```

---

## 📋 Todos os Comandos

### 🔧 Setup Inicial

| Comando | Descrição |
|---------|-----------|
| `make install` | Instalar dependências |
| `make setup` | Setup completo (instalar + configurar) |
| `make config-env` | Criar arquivo .env |
| `make first-run` | Primeiro uso completo (recomendado) |

### 🗄️ Database

| Comando | Descrição |
|---------|-----------|
| `make config-db` | Criar banco de dados MySQL |
| `make seed` | Popular banco com dados iniciais |
| `make db-reset` | Resetar banco (recriar + seeds) |
| `make migration-run` | Executar migrations |
| `make migration-revert` | Reverter última migration |

### 🚀 Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `make start` | Iniciar em modo desenvolvimento |
| `make dev` | Alias para start |
| `make build` | Compilar para produção |
| `make prod` | Iniciar em modo produção |
| `make debug` | Iniciar em modo debug |
| `make restart` | Reiniciar aplicação |

### 🧪 Testes

| Comando | Descrição |
|---------|-----------|
| `make test` | Executar todos os testes |
| `make test-watch` | Testes em watch mode |
| `make test-cov` | Testes com cobertura |
| `make test-e2e` | Testes end-to-end |

### 🐳 Docker

| Comando | Descrição |
|---------|-----------|
| `make docker-up` | Iniciar containers (MySQL + API) |
| `make docker-down` | Parar containers |
| `make docker-logs` | Ver logs dos containers |
| `make docker-restart` | Reiniciar containers |
| `make docker-clean` | Parar e remover volumes |

### ✨ Qualidade do Código

| Comando | Descrição |
|---------|-----------|
| `make lint` | Executar linter |
| `make format` | Formatar código |
| `make lint-fix` | Corrigir problemas automaticamente |

### 🧹 Limpeza

| Comando | Descrição |
|---------|-----------|
| `make clean` | Limpar arquivos de build |
| `make clean-all` | Limpar tudo (build + node_modules) |
| `make full-reset` | Reset completo |

### 📊 Informações

| Comando | Descrição |
|---------|-----------|
| `make status` | Ver status da aplicação |
| `make info` | Informações sobre a aplicação |
| `make docs` | Abrir Swagger no navegador |
| `make show-routes` | Mostrar rotas da API |

### 🔧 Utilitários

| Comando | Descrição |
|---------|-----------|
| `make check-port` | Verificar se porta está em uso |
| `make kill-port` | Matar processo na porta |
| `make ci` | Pipeline de CI (lint + test + build) |

---

## 🎯 Workflows Comuns

### Primeira Vez Usando o Projeto

```bash
# 1. Clone o repositório
git clone <repo>
cd back-end-api

# 2. Setup completo
make first-run
```

### Desenvolvimento Diário

```bash
# Iniciar aplicação
make start

# Em outro terminal, se precisar popular novamente
make seed
```

### Antes de Fazer Commit

```bash
# Formatar código e fazer lint
make format
make lint

# Executar testes
make test
```

### Resetar Banco de Dados

```bash
# Resetar e popular novamente
make db-reset
```

### Usar com Docker

```bash
# Iniciar tudo com Docker
make docker-up

# Aguardar 30s e popular banco
sleep 30
make seed

# Ver logs
make docker-logs

# Parar
make docker-down
```

### Preparar para Deploy

```bash
# Pipeline completa
make ci

# ou apenas build
make build
make deploy-prep
```

### Resolver Problemas de Porta

```bash
# Ver o que está usando a porta
make check-port

# Matar processo na porta
make kill-port

# Iniciar novamente
make start
```

---

## 🔍 Exemplos de Uso

### Exemplo 1: Primeiro Uso Completo

```bash
# Terminal 1
make first-run

# Aguarde a aplicação iniciar
# API: http://localhost:3001/api
# Docs: http://localhost:3001/api/docs
```

### Exemplo 2: Desenvolvimento com Hot-Reload

```bash
make dev
# Edite os arquivos e veja as mudanças automaticamente
```

### Exemplo 3: Testar Antes de Commit

```bash
make format    # Formata o código
make lint      # Verifica problemas
make test      # Executa testes
make build     # Testa o build

# Se tudo OK, faça commit
git add .
git commit -m "feat: nova funcionalidade"
```

### Exemplo 4: Reset Completo

```bash
# Se algo deu errado e quer começar do zero
make full-reset
make first-run
```

### Exemplo 5: Deploy em Produção

```bash
# Preparar build de produção
make build

# Testar localmente em modo produção
make prod

# Se OK, fazer deploy
# (comando depende da plataforma: Railway, Heroku, etc)
```

---

## ⚙️ Configurações

### Variáveis de Ambiente

Você pode sobrescrever variáveis:

```bash
# Usar porta diferente
PORT=3002 make start

# Ambiente de produção
NODE_ENV=production make start
```

### MySQL

O Makefile assume que você tem MySQL instalado e rodando.

Se usar Docker:
```bash
make docker-up
```

Se usar MySQL local:
```bash
make config-db
```

---

## 🆘 Troubleshooting

### Erro: "make: comando não encontrado"

**No Mac:**
```bash
xcode-select --install
```

**No Linux:**
```bash
sudo apt-get install build-essential
```

### Erro: "Porta 3001 já em uso"

```bash
make kill-port
make start
```

### Erro: "Cannot connect to MySQL"

```bash
# Verificar se MySQL está rodando
mysql -u root -p

# Ou usar Docker
make docker-up
```

### Erro ao executar seeds

```bash
# Resetar banco e tentar novamente
make db-reset
```

---

## 💡 Dicas

1. **Use `make help`** para ver sempre os comandos disponíveis
2. **`make first-run`** é seu melhor amigo no primeiro uso
3. **`make dev`** para desenvolvimento diário
4. **`make ci`** antes de fazer commit
5. **`make docs`** abre o Swagger automaticamente
6. **`make status`** para verificar se está tudo OK

---

## 📚 Mais Informações

- Documentação da API: `ROTAS_API.md`
- Arquitetura: `ONION_ARCHITECTURE.md`
- Início rápido: `QUICK_START.md`
- Deploy: `DEPLOY.md`

---

**Desenvolvido com ❤️ usando Makefile + NestJS + Onion Architecture**

