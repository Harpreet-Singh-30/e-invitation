#!/bin/bash

# Wedding Platform Restore Script
# Usage: ./restore.sh wedding_20261106_020000.db uploads_20261106_020000.tar.gz

set -e

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <database_backup> [uploads_backup]"
    echo "Example: $0 wedding_20261106_020000.db uploads_20261106_020000.tar.gz"
    exit 1
fi

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups}"
DATA_DIR="${DATA_DIR:-/data}"
DB_BACKUP="$1"
UPLOADS_BACKUP="${2:-}"

echo "=== Wedding Platform Restore ==="
echo "Data directory: $DATA_DIR"
echo "Database backup: $DB_BACKUP"
if [ -n "$UPLOADS_BACKUP" ]; then
    echo "Uploads backup: $UPLOADS_BACKUP"
fi
echo ""

read -p "This will overwrite existing data. Continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Stop the application (if running with Docker Compose)
echo "Stopping application..."
docker-compose down 2>/dev/null || true

# Backup current data before restore (just in case)
if [ -f "$DATA_DIR/wedding.db" ]; then
    SAFETY_BACKUP="$BACKUP_DIR/pre_restore_$(date +%Y%m%d_%H%M%S).db"
    echo "Creating safety backup at $SAFETY_BACKUP"
    cp "$DATA_DIR/wedding.db" "$SAFETY_BACKUP"
fi

# Restore database
echo "Restoring database..."
if [ -f "$BACKUP_DIR/$DB_BACKUP" ]; then
    cp "$BACKUP_DIR/$DB_BACKUP" "$DATA_DIR/wedding.db"
    echo "✓ Database restored"
else
    echo "✗ Database backup not found: $BACKUP_DIR/$DB_BACKUP"
    exit 1
fi

# Restore uploads
if [ -n "$UPLOADS_BACKUP" ]; then
    echo "Restoring uploads..."
    if [ -f "$BACKUP_DIR/$UPLOADS_BACKUP" ]; then
        # Backup current uploads
        if [ -d "$DATA_DIR/uploads" ]; then
            mv "$DATA_DIR/uploads" "$DATA_DIR/uploads.old.$(date +%Y%m%d_%H%M%S)"
        fi
        
        # Extract uploads
        tar -xzf "$BACKUP_DIR/$UPLOADS_BACKUP" -C "$DATA_DIR"
        echo "✓ Uploads restored"
    else
        echo "⚠ Uploads backup not found: $BACKUP_DIR/$UPLOADS_BACKUP"
    fi
fi

# Fix permissions
echo "Fixing permissions..."
chown -R 1000:1000 "$DATA_DIR" 2>/dev/null || true
chmod -R 755 "$DATA_DIR" 2>/dev/null || true

echo ""
echo "✓ Restore completed!"
echo ""
echo "To start the application:"
echo "  docker-compose up -d"
echo ""
echo "To verify the restore:"
echo "  sqlite3 $DATA_DIR/wedding.db 'SELECT COUNT(*) FROM orders;'"

exit 0
