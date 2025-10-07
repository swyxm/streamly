import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def create_tables():
    db_url = "postgresql://postgres:postgres@localhost:5432/streamly_users"

    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()

    try:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS streams (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                stream_key VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams(user_id)
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_streams_stream_key ON streams(stream_key)
        ''')

        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status)
        ''')

        conn.commit()
        print("✅ Stream service tables created successfully!")

    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    create_tables()
