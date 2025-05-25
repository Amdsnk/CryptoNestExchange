import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import pg from 'pg';
const { Pool } = pg;

// Initialize the database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

// Password hashing function
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Create admin user function
async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Check if admin user already exists
    const adminCheck = await pool.query(`
      SELECT * FROM users WHERE email = 'admin@example.com' AND is_admin = true LIMIT 1
    `);
    
    if (adminCheck.rows.length > 0) {
      console.log('Admin user already exists');
      return { success: true, message: 'Admin user already exists', user: adminCheck.rows[0] };
    }
    
    // Admin doesn't exist, create a new one
    const adminId = uuid();
    const adminPasswordHash = await hashPassword('admin123');
    
    await pool.query(`
      INSERT INTO users (id, email, first_name, last_name, wallet_address, password_hash, is_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      adminId,
      'admin@example.com',
      'Admin',
      'User',
      null,
      adminPasswordHash,
      true,
      new Date(),
      new Date()
    ]);
    
    console.log('Admin user created successfully');
    console.log('----------------------------------');
    console.log('Admin login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('----------------------------------');
    
    return { success: true, message: 'Admin user created successfully', id: adminId };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, message: 'Error creating admin user', error: error.message };
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Execute the admin user creation
createAdminUser()
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Execution error:', error);
    process.exit(1);
  });