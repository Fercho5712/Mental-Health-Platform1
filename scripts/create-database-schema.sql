-- Neon PostgreSQL Database Schema for Eunoia Mental Health Platform

-- Users table for authentication and basic profile
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'psychologist', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Patient-specific information
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_conditions TEXT,
    medications TEXT,
    therapy_goals TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Psychologist-specific information
CREATE TABLE IF NOT EXISTS psychologists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    specializations TEXT[],
    education TEXT,
    years_experience INTEGER,
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapy sessions
CREATE TABLE IF NOT EXISTS therapy_sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
    session_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    session_type VARCHAR(20) DEFAULT 'individual' CHECK (session_type IN ('individual', 'group', 'family')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient mood tracking
CREATE TABLE IF NOT EXISTS mood_entries (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    sleep_hours DECIMAL(3,1),
    exercise_minutes INTEGER,
    notes TEXT,
    entry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
    appointment_type VARCHAR(30) DEFAULT 'therapy' CHECK (appointment_type IN ('therapy', 'consultation', 'follow_up')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo data
INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES
-- Patients
('maria.gonzalez@email.com', '$2a$10$dummy_hash_1', 'patient', 'María', 'González', '+34 600 123 456'),
('carlos.ruiz@email.com', '$2a$10$dummy_hash_2', 'patient', 'Carlos', 'Ruiz', '+34 600 234 567'),
('ana.lopez@email.com', '$2a$10$dummy_hash_3', 'patient', 'Ana', 'López', '+34 600 345 678'),

-- Psychologists
('ana.garcia@eunoia.com', '$2a$10$dummy_hash_4', 'psychologist', 'Ana', 'García', '+34 600 456 789'),
('luis.martinez@eunoia.com', '$2a$10$dummy_hash_5', 'psychologist', 'Luis', 'Martínez', '+34 600 567 890'),
('carmen.rodriguez@eunoia.com', '$2a$10$dummy_hash_6', 'psychologist', 'Carmen', 'Rodríguez', '+34 600 678 901'),

-- Administrators
('admin@eunoia.com', '$2a$10$dummy_hash_7', 'admin', 'Administrador', 'Sistema', '+34 600 789 012'),
('supervisor@eunoia.com', '$2a$10$dummy_hash_8', 'admin', 'Supervisor', 'General', '+34 600 890 123');

-- Insert patient data
INSERT INTO patients (user_id, date_of_birth, gender, emergency_contact_name, emergency_contact_phone, medical_conditions, therapy_goals) VALUES
(1, '1990-05-15', 'Femenino', 'Pedro González', '+34 600 111 222', 'Ansiedad generalizada', 'Mejorar manejo del estrés y autoestima'),
(2, '1985-08-22', 'Masculino', 'Laura Ruiz', '+34 600 333 444', 'Depresión leve', 'Desarrollar estrategias de afrontamiento'),
(3, '1992-12-03', 'Femenino', 'Miguel López', '+34 600 555 666', 'Ninguna', 'Mejorar habilidades sociales y comunicación');

-- Insert psychologist data
INSERT INTO psychologists (user_id, license_number, specializations, education, years_experience, bio, hourly_rate) VALUES
(4, 'PSI-2018-001', ARRAY['Ansiedad', 'Depresión', 'Terapia Cognitivo-Conductual'], 'Doctorado en Psicología Clínica - Universidad Complutense Madrid', 8, 'Especialista en trastornos de ansiedad y depresión con enfoque cognitivo-conductual', 80.00),
(5, 'PSI-2015-002', ARRAY['Terapia Familiar', 'Adicciones', 'Trauma'], 'Máster en Psicología Familiar - Universidad de Barcelona', 12, 'Experto en terapia familiar sistémica y tratamiento de adicciones', 90.00),
(6, 'PSI-2020-003', ARRAY['Psicología Infantil', 'TDAH', 'Terapia de Juego'], 'Licenciatura en Psicología + Especialización Infantil', 5, 'Especialista en psicología infantil y adolescente con certificación en terapia de juego', 75.00);
