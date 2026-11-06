#!/bin/bash

# Wedding Platform Backup Script
# Run this daily via cron: 0 2 * * * /path/to/backup.sh

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups}"
DATA_DIR="${DATA_DIR:-/data}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup at $(date)"

# Backup SQLite database (using .backup for consistency)
echo "Backing up database..."
if [ -f "$DATA_DIR/wedding.db" ]; then
    sqlite3 "$DATA_DIR/wedding.db" ".backup $BACKUP_DIR/wedding_$DATE.db"
    echo "✓ Database backed up to wedding_$DATE.db"
else
    echo "⚠ Database not found at $DATA_DIR/wedding.db"
fi

# Backup uploads directory
echo "Backing up uploads..."
if [ -d "$DATA_DIR/uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C "$DATA_DIR" uploads
    echo "✓ Uploads backed up to uploads_$DATE.tar.gz"
else
    echo "⚠ Uploads directory not found at $DATA_DIR/uploads"
fi

# Calculate sizes
DB_SIZE=$(du -h "$BACKUP_DIR/wedding_$DATE.db" 2>/dev/null | cut -f1)
UPLOADS_SIZE=$(du -h "$BACKUP_DIR/uploads_$DATE.tar.gz" 2>/dev/null | cut -f1)

echo "Backup sizes: DB=$DB_SIZE, Uploads=$UPLOADS_SIZE"

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "wedding_*.db" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Count remaining backups
DB_COUNT=$(ls -1 "$BACKUP_DIR"/wedding_*.db 2>/dev/null | wc -l)
UPLOADS_COUNT=$(ls -1 "$BACKUP_DIR"/uploads_*.tar.gz 2>/dev/null | wc -l)

echo "✓ Backup completed at $(date)"
echo "Total backups: $DB_COUNT database, $UPLOADS_COUNT uploads"

# Optional: Upload to remote storage (uncomment and configure)
# echo "Uploading to remote storage..."
# aws s3 cp "$BACKUP_DIR/wedding_$DATE.db" "s3://your-bucket/backups/"
# aws s3 cp "$BACKUP_DIR/uploads_$DATE.tar.gz" "s3://your-bucket/backups/"

exit 0
