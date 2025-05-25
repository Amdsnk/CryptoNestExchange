-- Check if the admin user exists
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE email = 'admin@example.com' AND is_admin = true
  ) INTO admin_exists;
  
  IF NOT admin_exists THEN
    -- Insert admin user with password 'admin123'
    INSERT INTO users (
      id, 
      email, 
      first_name, 
      last_name, 
      password_hash, 
      is_admin, 
      created_at, 
      updated_at
    ) 
    VALUES (
      'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
      'admin@example.com', 
      'Admin', 
      'User', 
      '$2b$10$Hn7QoPqJU8KZ1McUsLKnZeV9WOJiMmKquxOwAg5DY9ZY3ERV1K0Au', -- bcrypt hash of 'admin123'
      true, 
      NOW(), 
      NOW()
    );
    
    RAISE NOTICE 'Admin user created successfully';
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;