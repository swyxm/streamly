import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def init_db():
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='postgres',
        host='postgres'
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'streamly_users'")
    exists = cursor.fetchone()
    
    if not exists:
        cursor.execute('CREATE DATABASE streamly_users')
        print("Created database 'streamly_users'")
    
    cursor.close()
    conn.close()
    
    conn = psycopg2.connect(
        dbname='streamly_users',
        user='postgres',
        password='postgres',
        host='postgres'
    )
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    print("Created 'users' table")
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == '__main__':
    init_db()