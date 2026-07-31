# MediSlot Database Backup & Restore Guide

## Backup Procedure
To create a compressed backup of the PostgreSQL database:
```bash
DB_HOST=localhost DB_PORT=5432 DB_NAME=medislot_db DB_USER=postgres ./scripts/backup.sh ./backups
```

## Restore Procedure
To restore the database from a `.sql.gz` backup file:
```bash
DB_HOST=localhost DB_PORT=5432 DB_NAME=medislot_db DB_USER=postgres ./scripts/restore.sh ./backups/medislot_backup_20260731_120000.sql.gz
```
