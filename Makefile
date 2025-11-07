.PHONY: help install setup config-db start dev stop build prod test clean seed docker-up docker-down logs migration-generate migration-run migration-revert

# Variáveis
NODE_ENV ?= development
PORT ?= 3001

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
BLUE   := \033[0;34m
NC     := \033[0m # No Color

##@ Ajuda

help: ## Mostrar esta mensagem de ajuda
	@echo '$(BLUE)═══════════════════════════════════════════════$(NC)'
	@echo '$(GREEN)  CS Skin GO - API Backend (Onion Architecture)$(NC)'
	@echo '$(BLUE)═══════════════════════════════════════════════$(NC)'
	@echo ''
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ''

##@ Setup Inicial

install: ## Instalar todas as dependências
	@echo "$(GREEN)📦 Instalando dependências...$(NC)"
	@npm install
	@echo "$(GREEN)✅ Dependências instaladas com sucesso!$(NC)"

setup: install config-env ## Setup completo do projeto (instalar + configurar)
	@echo "$(GREEN)✅ Setup completo realizado!$(NC)"
	@echo "$(YELLOW)⚠️  Configure o arquivo .env antes de continuar$(NC)"
	@echo "$(YELLOW)⚠️  Crie o banco de dados MySQL antes de rodar a aplicação$(NC)"

config-env: ## Criar arquivo .env a partir do .env.example
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)📝 Criando arquivo .env...$(NC)"; \
		cp .env.example .env 2>/dev/null || echo "$(YELLOW)⚠️  .env.example não encontrado, .env já existe$(NC)"; \
		echo "$(GREEN)✅ Arquivo .env criado!$(NC)"; \
		echo "$(YELLOW)⚠️  Configure as variáveis no arquivo .env$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Arquivo .env já existe$(NC)"; \
	fi

##@ Database

config-db: ## Criar banco de dados MySQL
	@echo "$(GREEN)🗄️  Criando banco de dados...$(NC)"
	@mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cs_skin_go CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
	@echo "$(GREEN)✅ Banco de dados criado!$(NC)"

seed: ## Executar seeds (popular banco com dados iniciais)
	@echo "$(GREEN)🌱 Executando seeds...$(NC)"
	@npm run seed
	@echo "$(GREEN)✅ Seeds executados com sucesso!$(NC)"

migration-generate: ## Gerar nova migration (use: make migration-generate NAME=NomeDaMigration)
	@echo "$(GREEN)📝 Gerando migration...$(NC)"
	@if [ -z "$(NAME)" ]; then \
		echo "$(RED)❌ Erro: Nome da migration é obrigatório$(NC)"; \
		echo "$(YELLOW)Uso: make migration-generate NAME=NomeDaMigration$(NC)"; \
		exit 1; \
	fi
	@npm run typeorm -- migration:generate -d src/database/data-source.ts src/database/migrations/$(NAME)
	@echo "$(GREEN)✅ Migration gerada!$(NC)"

migration-run: ## Executar migrations pendentes
	@echo "$(GREEN)🔄 Executando migrations...$(NC)"
	@npm run migration:run
	@echo "$(GREEN)✅ Migrations executadas!$(NC)"

migration-revert: ## Reverter última migration
	@echo "$(YELLOW)⏪ Revertendo última migration...$(NC)"
	@npm run migration:revert
	@echo "$(GREEN)✅ Migration revertida!$(NC)"

db-reset: ## Resetar banco (recriar + migrations + seeds)
	@echo "$(RED)⚠️  Resetando banco de dados...$(NC)"
	@mysql -u root -p -e "DROP DATABASE IF EXISTS cs_skin_go; CREATE DATABASE cs_skin_go CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
	@echo "$(GREEN)✅ Banco recriado!$(NC)"
	@$(MAKE) migration-run
	@$(MAKE) seed

##@ Desenvolvimento

start: ## Iniciar aplicação em modo de desenvolvimento (hot-reload)
	@echo "$(GREEN)🚀 Iniciando aplicação em modo desenvolvimento...$(NC)"
	@npm run start:dev

dev: start ## Alias para 'start'

stop: ## Parar aplicação (mata processo na porta configurada)
	@echo "$(YELLOW)🛑 Parando aplicação...$(NC)"
	@lsof -ti :$(PORT) | xargs kill -9 2>/dev/null && echo "$(GREEN)✅ Aplicação parada!$(NC)" || echo "$(YELLOW)⚠️  Nenhum processo encontrado na porta $(PORT)$(NC)"

build: ## Compilar aplicação para produção
	@echo "$(GREEN)🏗️  Compilando aplicação...$(NC)"
	@npm run build
	@echo "$(GREEN)✅ Build concluído! (dist/)$(NC)"

prod: build ## Iniciar aplicação em modo produção
	@echo "$(GREEN)🚀 Iniciando aplicação em modo produção...$(NC)"
	@NODE_ENV=production npm run start:prod

watch: ## Iniciar com watch mode
	@echo "$(GREEN)👀 Iniciando em watch mode...$(NC)"
	@npm run start:dev

debug: ## Iniciar em modo debug
	@echo "$(GREEN)🐛 Iniciando em modo debug...$(NC)"
	@npm run start:debug

##@ Testes

test: ## Executar todos os testes
	@echo "$(GREEN)🧪 Executando testes...$(NC)"
	@npm run test

test-watch: ## Executar testes em watch mode
	@echo "$(GREEN)👀 Executando testes em watch mode...$(NC)"
	@npm run test:watch

test-cov: ## Executar testes com cobertura
	@echo "$(GREEN)📊 Executando testes com cobertura...$(NC)"
	@npm run test:cov
	@echo "$(GREEN)✅ Relatório de cobertura gerado em: coverage/$(NC)"

test-e2e: ## Executar testes end-to-end
	@echo "$(GREEN)🔗 Executando testes E2E...$(NC)"
	@npm run test:e2e

##@ Docker

docker-up: ## Iniciar containers Docker (MySQL + API)
	@echo "$(GREEN)🐳 Iniciando containers Docker...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Containers iniciados!$(NC)"
	@echo "$(YELLOW)⏳ Aguarde ~30s para o MySQL inicializar$(NC)"
	@echo "$(BLUE)📝 Execute 'make seed' para popular o banco$(NC)"

docker-down: ## Parar containers Docker
	@echo "$(YELLOW)🐳 Parando containers Docker...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Containers parados!$(NC)"

docker-logs: ## Ver logs dos containers
	@docker-compose logs -f

docker-restart: docker-down docker-up ## Reiniciar containers Docker

docker-clean: ## Parar containers e remover volumes
	@echo "$(RED)🗑️  Removendo containers e volumes...$(NC)"
	@docker-compose down -v
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

##@ Qualidade do Código

lint: ## Executar linter
	@echo "$(GREEN)🔍 Executando linter...$(NC)"
	@npm run lint

format: ## Formatar código
	@echo "$(GREEN)✨ Formatando código...$(NC)"
	@npm run format
	@echo "$(GREEN)✅ Código formatado!$(NC)"

lint-fix: ## Executar linter e corrigir problemas automaticamente
	@echo "$(GREEN)🔧 Corrigindo problemas de lint...$(NC)"
	@npm run lint
	@echo "$(GREEN)✅ Problemas corrigidos!$(NC)"

##@ Limpeza

clean: ## Limpar arquivos de build
	@echo "$(YELLOW)🧹 Limpando arquivos de build...$(NC)"
	@rm -rf dist/
	@rm -rf coverage/
	@rm -rf node_modules/.cache/
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

clean-all: clean ## Limpar tudo (build + node_modules)
	@echo "$(RED)🗑️  Removendo node_modules...$(NC)"
	@rm -rf node_modules/
	@echo "$(GREEN)✅ Limpeza completa!$(NC)"
	@echo "$(YELLOW)Execute 'make install' para reinstalar$(NC)"

##@ Logs e Informações

logs: ## Ver logs da aplicação (se rodando em produção com PM2)
	@pm2 logs cs-skin-go-api

status: ## Ver status da aplicação
	@echo "$(BLUE)📊 Status da Aplicação$(NC)"
	@echo "================================"
	@if [ -f .env ]; then \
		echo "$(GREEN)✅ .env configurado$(NC)"; \
	else \
		echo "$(RED)❌ .env não encontrado$(NC)"; \
	fi
	@if [ -d node_modules ]; then \
		echo "$(GREEN)✅ Dependências instaladas$(NC)"; \
	else \
		echo "$(RED)❌ Dependências não instaladas$(NC)"; \
	fi
	@if [ -d dist ]; then \
		echo "$(GREEN)✅ Build realizado$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Build não realizado$(NC)"; \
	fi
	@echo "================================"

info: ## Informações sobre a aplicação
	@echo "$(BLUE)ℹ️  Informações da Aplicação$(NC)"
	@echo "================================"
	@echo "Nome: CS Skin GO API"
	@echo "Arquitetura: Onion Architecture"
	@echo "Framework: NestJS"
	@echo "Banco: MySQL"
	@echo "Porta: $(PORT)"
	@echo "Ambiente: $(NODE_ENV)"
	@echo ""
	@echo "$(BLUE)📍 URLs:$(NC)"
	@echo "API: http://localhost:$(PORT)/api"
	@echo "Swagger: http://localhost:$(PORT)/api/docs"
	@echo "================================"

docs: ## Abrir documentação Swagger no navegador
	@echo "$(GREEN)📖 Abrindo documentação...$(NC)"
	@open http://localhost:$(PORT)/api/docs 2>/dev/null || \
	xdg-open http://localhost:$(PORT)/api/docs 2>/dev/null || \
	echo "$(YELLOW)Abra manualmente: http://localhost:$(PORT)/api/docs$(NC)"

##@ Workflows Comuns

first-run: setup config-db migration-run seed start ## Primeiro uso: setup + criar DB + migrations + seeds + iniciar
	@echo "$(GREEN)🎉 Aplicação configurada e rodando!$(NC)"

restart: ## Reiniciar aplicação
	@echo "$(YELLOW)🔄 Reiniciando aplicação...$(NC)"
	@pkill -f "nest start" || true
	@$(MAKE) start

quick-start: ## Início rápido (apenas instalar e iniciar)
	@$(MAKE) install
	@$(MAKE) start

full-reset: clean-all docker-clean ## Reset completo (limpar tudo)
	@echo "$(RED)⚠️  Reset completo realizado!$(NC)"
	@echo "$(YELLOW)Execute 'make first-run' para reconfigurar$(NC)"

##@ CI/CD

ci: lint test build ## Pipeline de CI (lint + test + build)
	@echo "$(GREEN)✅ Pipeline de CI concluído!$(NC)"

deploy-prep: build ## Preparar para deploy
	@echo "$(GREEN)📦 Preparando para deploy...$(NC)"
	@npm prune --production
	@echo "$(GREEN)✅ Pronto para deploy!$(NC)"

##@ Utilitários

check-port: ## Verificar se a porta está em uso
	@echo "$(BLUE)🔍 Verificando porta $(PORT)...$(NC)"
	@lsof -i :$(PORT) || echo "$(GREEN)✅ Porta $(PORT) está livre$(NC)"

kill-port: ## Matar processo na porta configurada
	@echo "$(RED)🔪 Matando processo na porta $(PORT)...$(NC)"
	@lsof -ti :$(PORT) | xargs kill -9 || echo "$(YELLOW)Nenhum processo encontrado$(NC)"

show-routes: ## Mostrar todas as rotas da API
	@echo "$(BLUE)📍 Rotas da API:$(NC)"
	@cat ROTAS_API.md | grep -E "^(POST|GET|PUT|PATCH|DELETE)" | head -20 || echo "Veja ROTAS_API.md"

# Comando padrão ao executar apenas 'make'
.DEFAULT_GOAL := help

