#!/bin/bash

# Backup script for production database

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables
BACKUP_DIR="infra/prod/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Database Backup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check if production environment is running
if ! docker ps | grep -q barber_postgres_prod; then
    echo -e "${RED}❌ Container PostgreSQL de produção não está rodando!${NC}"
    exit 1
fi

echo -e "${YELLOW}Criando backup do banco de dados...${NC}"

# Execute backup
docker exec barber_postgres_prod pg_dump -U barber_user_prod barber_db_prod > "${BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup criado com sucesso!${NC}"
    echo -e "${GREEN}Arquivo: ${BACKUP_DIR}/${BACKUP_FILE}${NC}"

    # Compress backup
    echo -e "${YELLOW}Comprimindo backup...${NC}"
    gzip "${BACKUP_DIR}/${BACKUP_FILE}"
    echo -e "${GREEN}✓ Backup comprimido: ${BACKUP_DIR}/${BACKUP_FILE}.gz${NC}"

    # Remove old backups (keep last 7 days)
    find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
    echo -e "${GREEN}✓ Backups antigos removidos (mantidos últimos 7 dias)${NC}"
else
    echo -e "${RED}❌ Erro ao criar backup!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Backup concluído!${NC}"
echo -e "${GREEN}========================================${NC}"
