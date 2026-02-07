import os

class Config:
    """
    Base configuration
    """
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key_here')
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    ENV = os.getenv('ENV', 'development')

class ProductionConfig(Config):
    """
    Production configuration
    """
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///prod.db')

class DevelopmentConfig(Config):
    """
    Development configuration
    """
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///dev.db')

class TestingConfig(Config):
    """
    Testing configuration
    """
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///test.db')
    TESTING = True
