// Legacy SQLite Database Stub (Migrated to PostgreSQL + Prisma)
export const db: any = {
  prepare: () => ({
    get: () => null,
    all: () => [],
    run: () => ({ lastInsertRowid: 0 }),
  }),
  pragma: () => null,
  exec: () => null,
  transaction: (fn: any) => fn,
  close: () => null,
};

export function initializeDatabase() {}
export function seedDatabase() {}

export default db;
