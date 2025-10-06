#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Barber Shop - Setup Inicial${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    echo "Por favor, instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    echo "Por favor, instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker e Docker Compose encontrados${NC}"
echo ""

# Ask which environment to setup
echo "Qual ambiente você deseja configurar?"
echo "1) Desenvolvimento (dev)"
echo "2) Homologação (hml)"
echo "3) Produção (prod)"
echo "4) Todos"
read -p "Escolha uma opção (1-4): " env_choice

setup_env() {
    local env=$1
    echo ""
    echo -e "${YELLOW}Configurando ambiente: ${env}${NC}"

    # Create .env file if it doesn't exist
    if [ ! -f "infra/${env}/.env" ]; then
        cp "infra/${env}/.env.example" "infra/${env}/.env"
        echo -e "${GREEN}✓ Arquivo .env criado em infra/${env}/.env${NC}"
    else
        echo -e "${YELLOW}⚠ Arquivo .env já existe em infra/${env}/.env${NC}"
    fi
}

case $env_choice in
    1)
        setup_env "dev"
        ;;
    2)
        setup_env "hml"
        ;;
    3)
        setup_env "prod"
        echo -e "${RED}⚠ IMPORTANTE: Configure as variáveis de ambiente em infra/prod/.env com valores seguros!${NC}"
        ;;
    4)
        setup_env "dev"
        setup_env "hml"
        setup_env "prod"
        echo -e "${RED}⚠ IMPORTANTE: Configure as variáveis de ambiente em infra/prod/.env com valores seguros!${NC}"
        ;;
    *)
        echo -e "${RED}Opção inválida!${NC}"
        exit 1
        ;;
esac

# Setup backend .env
if [ ! -f "backend/.env" ]; then
    cp "backend/.env.example" "backend/.env"
    echo -e "${GREEN}✓ Arquivo .env criado em backend/.env${NC}"
else
    echo -e "${YELLOW}⚠ Arquivo .env já existe em backend/.env${NC}"
fi

# Setup frontend .env
if [ ! -f "frontend/.env" ]; then
    cp "frontend/.env.example" "frontend/.env"
    echo -e "${GREEN}✓ Arquivo .env criado em frontend/.env${NC}"
else
    echo -e "${YELLOW}⚠ Arquivo .env já existe em frontend/.env${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Setup concluído com sucesso!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Revise os arquivos .env criados"
echo "2. Execute: ${GREEN}make dev-up${NC} para iniciar o ambiente de desenvolvimento"
echo "3. Acesse: http://localhost:3000 (Frontend) e http://localhost:8000 (Backend)"
echo ""
echo -e "${YELLOW}Comandos úteis:${NC}"
echo "  make help          - Ver todos os comandos disponíveis"
echo "  make dev-logs      - Ver logs do ambiente de desenvolvimento"
echo "  make dev-down      - Parar o ambiente de desenvolvimento"
echo ""
