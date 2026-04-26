-- ============================================
-- UCARiq Production Database Schema
-- ============================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- TABLE 1: institutions
CREATE TABLE institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  type text,
  city text,
  student_count int DEFAULT 0,
  staff_count int DEFAULT 0,
  budget_allocated numeric DEFAULT 0,
  budget_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- TABLE 2: users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('rectorate', 'dean', 'staff')),
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- TABLE 3: domains
CREATE TABLE domains (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_fr text,
  icon text,
  description text
);

-- TABLE 4: kpi_definitions
CREATE TABLE kpi_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  name_en text,
  domain_id text REFERENCES domains(id),
  unit text,
  description text,
  direction text DEFAULT 'higher_better' CHECK (direction IN ('higher_better', 'lower_better'))
);

-- TABLE 5: kpi_values
CREATE TABLE kpi_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  kpi_definition_id uuid NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
  value numeric NOT NULL,
  period text NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  source text DEFAULT 'manual'
);

-- TABLE 6: kpi_thresholds
CREATE TABLE kpi_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_definition_id uuid NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
  warning_value numeric,
  critical_value numeric,
  comparison text DEFAULT 'greater_than' CHECK (comparison IN ('greater_than', 'less_than'))
);

-- TABLE 7: alerts
CREATE TABLE alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  kpi_definition_id uuid REFERENCES kpi_definitions(id),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  domain_id text REFERENCES domains(id),
  title text NOT NULL,
  message text NOT NULL,
  reasoning text,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- TABLE 8: documents
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_type text,
  raw_text text,
  extracted_data jsonb,
  summary text,
  status text DEFAULT 'processed',
  uploaded_at timestamptz DEFAULT now()
);

-- TABLE 9: reports
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  period text,
  content text,
  key_findings jsonb,
  generated_at timestamptz DEFAULT now(),
  generated_by text DEFAULT 'ai'
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_kpi_values_institution ON kpi_values(institution_id);
CREATE INDEX idx_kpi_values_definition ON kpi_values(kpi_definition_id);
CREATE INDEX idx_kpi_values_period ON kpi_values(period);

CREATE INDEX idx_alerts_institution ON alerts(institution_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_resolved ON alerts(resolved);

CREATE INDEX idx_documents_institution ON documents(institution_id);

CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- RLS POLICIES (Allow all for demo)
-- ============================================
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for demo" ON institutions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON domains FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON kpi_definitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON kpi_values FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON kpi_thresholds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON reports FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- VIEWS
-- ============================================
CREATE VIEW v_network_kpis AS
SELECT 
  kd.code, kd.name, kd.name_en, kd.unit, kd.domain_id, kd.direction,
  AVG(kv.value) as network_avg,
  MIN(kv.value) as network_min,
  MAX(kv.value) as network_max,
  COUNT(DISTINCT kv.institution_id) as institutions_count,
  kv.period
FROM kpi_definitions kd
LEFT JOIN kpi_values kv ON kv.kpi_definition_id = kd.id
GROUP BY kd.code, kd.name, kd.name_en, kd.unit, kd.domain_id, kd.direction, kv.period;

CREATE VIEW v_institution_health AS
SELECT 
  i.id, i.name, i.short_name, i.type, i.city, i.student_count,
  i.budget_allocated, i.budget_spent,
  ROUND((i.budget_spent / NULLIF(i.budget_allocated, 0) * 100)::numeric, 2) as budget_execution_pct,
  COUNT(DISTINCT a.id) FILTER (WHERE a.severity = 'critical' AND a.resolved = false) as critical_alerts,
  COUNT(DISTINCT a.id) FILTER (WHERE a.severity = 'high' AND a.resolved = false) as high_alerts
FROM institutions i
LEFT JOIN alerts a ON a.institution_id = i.id
GROUP BY i.id, i.name, i.short_name, i.type, i.city, i.student_count, i.budget_allocated, i.budget_spent;
