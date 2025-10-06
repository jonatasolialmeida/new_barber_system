.PHONY: help dev-up dev-down dev-logs dev-build hml-up hml-down hml-logs hml-build prod-up prod-down prod-logs prod-build clean

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Barber Shop - Sistema de Agendamento$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# ==================== DESENVOLVIMENTO ====================

dev-up: ## Iniciar ambiente de desenvolvimento
	@echo "$(GREEN)Iniciando ambiente de desenvolvimento...$(NC)"
	cd infra/dev && docker-compose up -d
	@echo "$(GREEN)✓ Ambiente iniciado!$(NC)"
	@echo "$(YELLOW)Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)Backend:$(NC) http://localhost:8000"
	@echo "$(YELLOW)pgAdmin:$(NC) http://localhost:5050"
	@echo "$(YELLOW)Portainer:$(NC) http://localhost:9000"

dev-down: ## Parar ambiente de desenvolvimento
	@echo "$(YELLOW)Parando ambiente de desenvolvimento...$(NC)"
	cd infra/dev && docker-compose down

dev-restart: dev-down dev-up ## Reiniciar ambiente de desenvolvimento

dev-logs: ## Ver logs do ambiente de desenvolvimento
	cd infra/dev && docker-compose logs -f

dev-build: ## Rebuild containers de desenvolvimento
	@echo "$(GREEN)Reconstruindo containers de desenvolvimento...$(NC)"
	cd infra/dev && docker-compose build --no-cache

dev-shell-backend: ## Acessar shell do backend (dev)
	cd infra/dev && docker-compose exec backend bash

dev-shell-frontend: ## Acessar shell do frontend (dev)
	cd infra/dev && docker-compose exec frontend sh

dev-migrate: ## Executar migrations (dev)
	cd infra/dev && docker-compose exec backend python manage.py migrate

dev-makemigrations: ## Criar migrations (dev)
	cd infra/dev && docker-compose exec backend python manage.py makemigrations

dev-createsuperuser: ## Criar superuser (dev)
	cd infra/dev && docker-compose exec backend python manage.py createsuperuser

dev-collectstatic: ## Coletar arquivos estáticos (dev)
	cd infra/dev && docker-compose exec backend python manage.py collectstatic --noinput

# ==================== HOMOLOGAÇÃO ====================

hml-up: ## Iniciar ambiente de homologação
	@echo "$(GREEN)Iniciando ambiente de homologação...$(NC)"
	cd infra/hml && docker-compose up -d
	@echo "$(GREEN)✓ Ambiente iniciado!$(NC)"
	@echo "$(YELLOW)Frontend:$(NC) http://localhost:3001"
	@echo "$(YELLOW)Backend:$(NC) http://localhost:8001"
	@echo "$(YELLOW)pgAdmin:$(NC) http://localhost:5051"
	@echo "$(YELLOW)Portainer:$(NC) http://localhost:9001"

hml-down: ## Parar ambiente de homologação
	@echo "$(YELLOW)Parando ambiente de homologação...$(NC)"
	cd infra/hml && docker-compose down

hml-restart: hml-down hml-up ## Reiniciar ambiente de homologação

hml-logs: ## Ver logs do ambiente de homologação
	cd infra/hml && docker-compose logs -f

hml-build: ## Rebuild containers de homologação
	@echo "$(GREEN)Reconstruindo containers de homologação...$(NC)"
	cd infra/hml && docker-compose build --no-cache

hml-migrate: ## Executar migrations (hml)
	cd infra/hml && docker-compose exec backend python manage.py migrate

# ==================== PRODUÇÃO ====================

prod-up: ## Iniciar ambiente de produção
	@echo "$(RED)ATENÇÃO: Iniciando ambiente de PRODUÇÃO!$(NC)"
	@read -p "Tem certeza? (y/N): " confirm && [ $$confirm = y ] || exit 1
	cd infra/prod && docker-compose up -d
	@echo "$(GREEN)✓ Ambiente iniciado!$(NC)"

prod-down: ## Parar ambiente de produção
	@echo "$(RED)Parando ambiente de produção...$(NC)"
	cd infra/prod && docker-compose down

prod-restart: prod-down prod-up ## Reiniciar ambiente de produção

prod-logs: ## Ver logs do ambiente de produção
	cd infra/prod && docker-compose logs -f

prod-build: ## Rebuild containers de produção
	@echo "$(RED)Reconstruindo containers de produção...$(NC)"
	cd infra/prod && docker-compose build --no-cache

prod-migrate: ## Executar migrations (prod)
	cd infra/prod && docker-compose exec backend python manage.py migrate

prod-backup-db: ## Backup do banco de dados (prod)
	@echo "$(GREEN)Criando backup do banco de dados...$(NC)"
	cd infra/prod && docker-compose exec postgres pg_dump -U barber_user_prod barber_db_prod > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup criado com sucesso!$(NC)"

# ==================== UTILITÁRIOS ====================

clean: ## Limpar containers, volumes e imagens não utilizados
	@echo "$(YELLOW)Limpando recursos Docker não utilizados...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)✓ Limpeza concluída!$(NC)"

install-backend: ## Instalar dependências do backend
	cd backend && pip install -r requirements.txt

install-frontend: ## Instalar dependências do frontend
	cd frontend && npm install

setup-dev: ## Setup completo do ambiente de desenvolvimento
	@echo "$(GREEN)Configurando ambiente de desenvolvimento...$(NC)"
	cp infra/dev/.env.example infra/dev/.env
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env
	@echo "$(GREEN)✓ Arquivos .env criados!$(NC)"
	@echo "$(YELLOW)Por favor, revise os arquivos .env antes de continuar$(NC)"

test-backend: ## Executar testes do backend
	cd infra/dev && docker-compose exec backend python manage.py test

format-backend: ## Formatar código do backend (black)
	cd backend && black .

format-frontend: ## Formatar código do frontend (prettier)
	cd frontend && npm run format
