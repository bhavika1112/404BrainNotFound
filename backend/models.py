from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    skills = relationship('Skill', back_populates='user')
    events = relationship('Event', back_populates='organizer')
    achievements = relationship('Achievement', back_populates='user')
    job_referrals = relationship('JobReferral', back_populates='referrer')
    virtual_coffee_chats = relationship('VirtualCoffeeChat', back_populates='participant')
    success_stories = relationship('SuccessStory', back_populates='user')
    batch_id = Column(Integer, ForeignKey('batches.id'))
    batch = relationship('Batch', back_populates='users')

class Skill(Base):
    __tablename__ = 'skills'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='skills')

class Event(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    date_time = Column(DateTime, nullable=False)
    organizer_id = Column(Integer, ForeignKey('users.id'))
    organizer = relationship('User', back_populates='events')

class Job(Base):
    __tablename__ = 'jobs'
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)

class JobReferral(Base):
    __tablename__ = 'job_referrals'
    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey('jobs.id'))
    referrer_id = Column(Integer, ForeignKey('users.id'))
    job = relationship('Job')
    referrer = relationship('User', back_populates='job_referrals')

class Achievement(Base):
    __tablename__ = 'achievements'
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='achievements')

class VirtualCoffeeChat(Base):
    __tablename__ = 'virtual_coffee_chats'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    participant = relationship('User', back_populates='virtual_coffee_chats')

class SuccessStory(Base):
    __tablename__ = 'success_stories'
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='success_stories')

class Batch(Base):
    __tablename__ = 'batches'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    users = relationship('User', back_populates='batch')