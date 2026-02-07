"""
Run this once to add missing columns to the users table if you already had an existing schema.
Creates all other tables if they don't exist (via schema.sql).
"""
import os
import sys
from pathlib import Path

# Add parent so we can import database
sys.path.insert(0, str(Path(__file__).resolve().parent))

from dotenv import load_dotenv
load_dotenv()

import mysql.connector

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "smart_alumni_db")

def main():
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
    )
    cursor = conn.cursor()

    # Add columns to users if missing (MySQL 8: no IF NOT EXISTS for columns, so we use procedure or try/except)
    columns_to_add = [
        ("graduation_year", "VARCHAR(20) NULL"),
        ("current_organization", "VARCHAR(255) NULL"),
        ("current_role", "VARCHAR(255) NULL"),
        ("department", "VARCHAR(255) NULL"),
        ("batch", "VARCHAR(50) NULL"),
        ("phone", "VARCHAR(50) NULL"),
        ("location", "VARCHAR(255) NULL"),
        ("bio", "TEXT NULL"),
        ("linkedin", "VARCHAR(255) NULL"),
        ("avatar", "VARCHAR(512) NULL"),
        ("created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
    ]
    cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = 'users'", (DB_NAME,))
    existing = {row[0] for row in cursor.fetchall()}
    for col_name, col_def in columns_to_add:
        if col_name not in existing:
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
                conn.commit()
                print(f"Added column users.{col_name}")
            except Exception as e:
                print(f"Skip {col_name}: {e}")

    # Read and run schema.sql for jobs, events, etc. (only CREATE TABLE IF NOT EXISTS)
    schema_path = Path(__file__).parent / "schema.sql"
    if schema_path.exists():
        sql = schema_path.read_text()
        # Run each CREATE TABLE statement
        for stmt in sql.split(";"):
            stmt = stmt.strip()
            if stmt.upper().startswith("CREATE TABLE"):
                try:
                    cursor.execute(stmt)
                    conn.commit()
                    print("Created table from schema.sql")
                except Exception as e:
                    print(f"Schema statement: {e}")

    cursor.close()
    conn.close()
    print("Init done.")

if __name__ == "__main__":
    main()
