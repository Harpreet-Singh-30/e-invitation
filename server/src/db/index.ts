import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/wedding.db');

// Ensure data directory exists
const dataDir = path.dirname(DATABASE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
export const db = new Database(DATABASE_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
export function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute schema (IF NOT EXISTS handles already created tables)
    db.exec(schema);
    
    console.log('Database initialized successfully');
  } catch (error: any) {
    // If tables already exist, that's fine
    if (error.code === 'SQLITE_ERROR' && error.message.includes('already exists')) {
      console.log('Database already initialized');
    } else {
      throw error;
    }
  }
}

// Seed initial data (templates and admin user)
export function seedDatabase() {
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  
  if (adminExists.count === 0) {
    // Insert default admin user (password: admin123 - CHANGE IN PRODUCTION)
    const bcrypt = require('bcrypt');
    const defaultPasswordHash = bcrypt.hashSync('admin123', 10);
    
    db.prepare(`
      INSERT INTO admin_users (username, password_hash, email)
      VALUES (?, ?, ?)
    `).run('admin', defaultPasswordHash, 'admin@example.com');
    
    console.log('Default admin user created: admin / admin123');
  }
  
  const templatesExist = db.prepare('SELECT COUNT(*) as count FROM templates').get() as { count: number };
  
  if (templatesExist.count === 0) {
    // Insert default templates
    const templates = [
      {
        id: 'royal-maroon-01',
        name: 'Royal Maroon',
        description: 'Elegant maroon and gold theme perfect for traditional weddings',
        category: 'traditional',
        price_paise: 300000, // Rs 3000
        prebook_price_paise: 200000, // Rs 2000
        demo_slug: 'demo-royal-maroon',
        poster_image: '/assets/templates/royal-maroon-poster.jpg',
        sort_order: 1
      },
      {
        id: 'modern-floral-02',
        name: 'Modern Floral',
        description: 'Contemporary design with beautiful floral elements',
        category: 'modern',
        price_paise: 300000,
        prebook_price_paise: 200000,
        demo_slug: 'demo-modern-floral',
        poster_image: '/assets/templates/modern-floral-poster.jpg',
        sort_order: 2
      },
      {
        id: 'classic-gold-03',
        name: 'Classic Gold',
        description: 'Timeless gold and cream design for sophisticated couples',
        category: 'classic',
        price_paise: 300000,
        prebook_price_paise: 200000,
        demo_slug: 'demo-classic-gold',
        poster_image: '/assets/templates/classic-gold-poster.jpg',
        sort_order: 3
      }
    ];
    
    const previewData = {
      couple: { groom: 'Rahul', bride: 'Priya', tagline: 'Two Hearts, One Soul' },
      events: [
        {
          key: 'mehendi',
          title: 'Mehendi Ceremony',
          date: '2026-12-20',
          time: '14:00',
          venue: 'Home Sweet Home',
          address: 'Mumbai, Maharashtra',
          mapUrl: 'https://maps.google.com'
        },
        {
          key: 'wedding',
          title: 'Wedding Ceremony',
          date: '2026-12-21',
          time: '18:00',
          venue: 'Grand Palace Hotel',
          address: 'Andheri, Mumbai',
          mapUrl: 'https://maps.google.com'
        }
      ],
      gallery: [],
      music: { enabled: true, trackId: 'trad-01' },
      message: 'We invite you to share in our joy as we exchange vows and celebrate our love.'
    };
    
    const schema = {
      fields: [
        { key: 'couple.groom', type: 'text', label: 'Groom Name', required: true, maxLength: 50 },
        { key: 'couple.bride', type: 'text', label: 'Bride Name', required: true, maxLength: 50 },
        { key: 'couple.tagline', type: 'text', label: 'Tagline', required: false, maxLength: 100 },
        { key: 'message', type: 'textarea', label: 'Welcome Message', required: false, maxLength: 500 },
        { key: 'music.enabled', type: 'boolean', label: 'Enable Music', required: false }
      ],
      events: {
        allowAdd: true,
        maxCount: 5,
        fields: [
          { key: 'title', type: 'text', label: 'Event Name', required: true },
          { key: 'date', type: 'date', label: 'Date', required: true },
          { key: 'time', type: 'time', label: 'Time', required: false },
          { key: 'venue', type: 'text', label: 'Venue', required: true },
          { key: 'address', type: 'text', label: 'Address', required: false },
          { key: 'mapUrl', type: 'url', label: 'Map Link', required: false }
        ]
      },
      gallery: {
        allowUpload: true,
        maxImages: 10,
        maxSizeMB: 5
      }
    };
    
    const insertTemplate = db.prepare(`
      INSERT INTO templates (id, name, description, category, price_paise, prebook_price_paise, 
                            demo_slug, poster_image, preview_data, schema_json, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    templates.forEach(template => {
      insertTemplate.run(
        template.id,
        template.name,
        template.description,
        template.category,
        template.price_paise,
        template.prebook_price_paise,
        template.demo_slug,
        template.poster_image,
        JSON.stringify(previewData),
        JSON.stringify(schema),
        template.sort_order
      );
    });
    
    console.log(`Seeded ${templates.length} templates`);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

export default db;
