// Script to set up admin user in the database
import { db } from '../server/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Hash a password with bcrypt
 * @param password The plain text password to hash
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Creates an admin user if one doesn't exist already
 */
async function setupAdminUser() {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.isAdmin, true)
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return { success: true, message: 'Admin user already exists', user: existingAdmin };
    }
    
    // Admin doesn't exist, create a new one
    const adminId = uuid();
    const adminPasswordHash = await hashPassword('admin123');
    
    const newAdmin = await db.insert(users).values({
      id: adminId,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: adminPasswordHash,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log('Admin user created successfully');
    console.log('----------------------------------');
    console.log('Admin login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('----------------------------------');
    
    return { success: true, message: 'Admin user created successfully', id: adminId };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, message: 'Error creating admin user', error: error.message };
  }
}

// Execute the setup function
setupAdminUser()
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Execution error:', error);
    process.exit(1);
  });