#!/bin/bash
set -e

# PostgreSQL Database Restore Script for MediSlot
# Usage: ./scripts/restore.sh <path_to_backup_file.sql.gz>

BACKUP_FILE="$1"

if [ -z "${BACKUP_FILE}" ] || [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Please provide a valid backup file (.sql.gz)."
  echo "Usage: ./scripts/restore.sh <path_to_backup_file.sql.gz>"
  exit 1
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-medislot_db}"
DB_USER="${DB_USER:-postgres}"

echo "Restoring PostgreSQL database ${DB_NAME} from ${BACKUP_FILE}..."
gunzip -c "${BACKUP_FILE}" | psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}"

echo "Database restore completed successfully."
