-- ============================================
-- UCARiq Seed Data (Full Production Version)
-- ============================================

-- 1. DOMAINS
INSERT INTO domains (id, name, name_fr, icon, description) VALUES
('enrollment', 'Enrollment', 'Inscriptions', 'UserPlus', 'Student admissions and registrations'),
('exams', 'Exams', 'Examens', 'FileCheck', 'Exam organization and results'),
('pedagogy', 'Pedagogy', 'Pédagogie', 'BookOpen', 'Teaching quality and progression'),
('strategy', 'Strategy', 'Stratégie', 'Target', 'Strategic objectives and execution'),
('partnerships', 'Partnerships', 'Partenariats', 'Handshake', 'National and international agreements'),
('student_life', 'Student Life', 'Vie étudiante', 'Users', 'Activities, clubs, well-being'),
('finance', 'Finance', 'Finance', 'Wallet', 'Budget allocation and execution'),
('hr', 'Human Resources', 'Ressources humaines', 'UsersRound', 'Staff and faculty management'),
('training', 'Training', 'Formation', 'GraduationCap', 'Continuous professional development'),
('research', 'Research', 'Recherche', 'Microscope', 'Publications, projects, patents'),
('infrastructure', 'Infrastructure', 'Infrastructure', 'Building2', 'Buildings, classrooms, occupancy'),
('equipment', 'Equipment', 'Équipement', 'Wrench', 'IT, lab, and didactic equipment'),
('inventory', 'Inventory', 'Inventaire', 'Package', 'Supplies, assets tracking'),
('esg', 'ESG / CSR', 'ESG / RSE', 'Leaf', 'Energy, carbon, recycling, accessibility'),
('logistics', 'Logistics', 'Logistique', 'Truck', 'Transport, mobility, services'),
('employment', 'Employability', 'Employabilité', 'Briefcase', 'Graduate employment outcomes');

-- 2. KPI_DEFINITIONS
INSERT INTO kpi_definitions (code, name, name_en, domain_id, unit, direction) VALUES
('success_rate', 'Taux de réussite', 'Success rate', 'pedagogy', '%', 'higher_better'),
('attendance_rate', 'Taux de présence', 'Attendance rate', 'pedagogy', '%', 'higher_better'),
('dropout_rate', 'Taux d''abandon', 'Dropout rate', 'pedagogy', '%', 'lower_better'),
('repetition_rate', 'Taux de redoublement', 'Grade repetition rate', 'pedagogy', '%', 'lower_better'),
('employability_rate', 'Taux d''employabilité', 'Employability rate', 'employment', '%', 'higher_better'),
('time_to_employment', 'Délai d''insertion', 'Time to employment', 'employment', 'months', 'lower_better'),
('budget_execution', 'Taux d''exécution budgétaire', 'Budget execution rate', 'finance', '%', 'higher_better'),
('cost_per_student', 'Coût par étudiant', 'Cost per student', 'finance', 'TND', 'lower_better'),
('absenteeism_rate', 'Taux d''absentéisme', 'Absenteeism rate', 'hr', '%', 'lower_better'),
('staff_count', 'Effectif enseignant', 'Teaching staff count', 'hr', 'count', 'higher_better'),
('training_hours', 'Heures de formation', 'Training hours', 'hr', 'hours', 'higher_better'),
('publications_count', 'Publications scientifiques', 'Scientific publications', 'research', 'papers', 'higher_better'),
('active_projects', 'Projets actifs', 'Active research projects', 'research', 'count', 'higher_better'),
('patents_filed', 'Brevets déposés', 'Patents filed', 'research', 'count', 'higher_better'),
('classroom_occupancy', 'Taux d''occupation des salles', 'Classroom occupancy', 'infrastructure', '%', 'higher_better'),
('equipment_availability', 'Disponibilité équipement', 'Equipment availability', 'equipment', '%', 'higher_better'),
('energy_consumption', 'Consommation énergétique', 'Energy consumption', 'esg', 'kWh', 'lower_better'),
('recycling_rate', 'Taux de recyclage', 'Recycling rate', 'esg', '%', 'higher_better'),
('carbon_footprint', 'Empreinte carbone', 'Carbon footprint', 'esg', 'tCO2', 'lower_better'),
('intl_partnerships', 'Partenariats internationaux', 'International partnerships', 'partnerships', 'agreements', 'higher_better'),
('national_partnerships', 'Partenariats nationaux', 'National partnerships', 'partnerships', 'agreements', 'higher_better'),
('student_mobility', 'Mobilité étudiante', 'Student mobility', 'partnerships', 'students', 'higher_better'),
('student_satisfaction', 'Satisfaction étudiante', 'Student satisfaction', 'student_life', '%', 'higher_better'),
('active_clubs', 'Clubs actifs', 'Active clubs', 'student_life', 'count', 'higher_better'),
('new_enrollments', 'Nouvelles inscriptions', 'New enrollments', 'enrollment', 'count', 'higher_better');

-- 3. KPI_THRESHOLDS
INSERT INTO kpi_thresholds (kpi_definition_id, warning_value, critical_value, comparison)
SELECT id, 75, 65, 'less_than' FROM kpi_definitions WHERE code = 'success_rate' UNION ALL
SELECT id, 12, 18, 'greater_than' FROM kpi_definitions WHERE code = 'dropout_rate' UNION ALL
SELECT id, 90, 98, 'greater_than' FROM kpi_definitions WHERE code = 'budget_execution' UNION ALL
SELECT id, 8, 12, 'greater_than' FROM kpi_definitions WHERE code = 'absenteeism_rate' UNION ALL
SELECT id, 85, 95, 'greater_than' FROM kpi_definitions WHERE code = 'classroom_occupancy' UNION ALL
SELECT id, 150000, 180000, 'greater_than' FROM kpi_definitions WHERE code = 'energy_consumption';

-- 4. INSTITUTIONS
INSERT INTO institutions (id, name, short_name, type, city, student_count, staff_count, budget_allocated, budget_spent) VALUES
('11111111-1111-1111-1111-111111111111', 'École Nationale d''Ingénieurs de Tunis', 'ENIT', 'Engineering', 'Tunis', 2800, 312, 12000000, 9200000),
('22222222-2222-2222-2222-222222222222', 'Institut des Hautes Études Commerciales Carthage', 'IHEC Carthage', 'Business', 'Carthage', 3200, 245, 8500000, 7100000),
('33333333-3333-3333-3333-333333333333', 'Institut National des Sciences Appliquées et de Technologie', 'INSAT', 'Applied Sciences', 'Tunis', 4100, 388, 15000000, 14800000),
('44444444-4444-4444-4444-444444444444', 'Institut Supérieur de Gestion de Tunis', 'ISG Tunis', 'Management', 'Bardo', 2500, 198, 7000000, 5400000),
('55555555-5555-5555-5555-555555555555', 'École Nationale des Sciences et Technologies Avancées de Borj Cédria', 'ENSTAB', 'Engineering', 'Borj Cédria', 1900, 167, 9000000, 6200000);

-- 5. USERS
INSERT INTO users (email, full_name, role, institution_id) VALUES
('president@ucar.tn', 'Pr. Sami Ben Naceur', 'rectorate', NULL),
('dean.enit@ucar.tn', 'Pr. Amira Trabelsi', 'dean', '11111111-1111-1111-1111-111111111111'),
('dean.ihec@ucar.tn', 'Pr. Karim Hammami', 'dean', '22222222-2222-2222-2222-222222222222'),
('dean.insat@ucar.tn', 'Pr. Mariem Saidi', 'dean', '33333333-3333-3333-3333-333333333333'),
('dean.isg@ucar.tn', 'Pr. Wassim Khelifi', 'dean', '44444444-4444-4444-4444-444444444444');

-- 6. KPI_VALUES (Bulk Insert for efficiency)
-- Helper to generate data: 
-- success_rate, attendance_rate, dropout_rate, employability_rate, budget_execution, classroom_occupancy, publications_count, energy_consumption
DO $$ 
DECLARE 
  inst_id uuid;
  kpi_id uuid;
  periods text[] := ARRAY['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4'];
  p text;
  base_val numeric;
BEGIN
  FOR inst_id IN SELECT id FROM institutions LOOP
    -- success_rate
    base_val := 78 + random() * 10;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val + random() * 2, p FROM kpi_definitions WHERE code = 'success_rate';
    END LOOP;

    -- attendance_rate
    base_val := 85 + random() * 5;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val + random() * 3, p FROM kpi_definitions WHERE code = 'attendance_rate';
    END LOOP;

    -- dropout_rate
    base_val := 5 + random() * 8;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val - random() * 2, p FROM kpi_definitions WHERE code = 'dropout_rate';
    END LOOP;

    -- employability_rate
    base_val := 75 + random() * 10;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val + random() * 5, p FROM kpi_definitions WHERE code = 'employability_rate';
    END LOOP;

    -- budget_execution
    base_val := 60 + random() * 10;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val + (CASE WHEN p = '2024-Q4' THEN 30 ELSE 10 END), p FROM kpi_definitions WHERE code = 'budget_execution';
    END LOOP;

    -- classroom_occupancy
    base_val := 70 + random() * 20;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val + random() * 5, p FROM kpi_definitions WHERE code = 'classroom_occupancy';
    END LOOP;

    -- publications_count
    base_val := 40 + random() * 30;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val + random() * 10, p FROM kpi_definitions WHERE code = 'publications_count';
    END LOOP;

    -- energy_consumption
    base_val := 120000 + random() * 40000;
    FOR p IN SELECT unnest(periods) LOOP
      INSERT INTO kpi_values (institution_id, kpi_definition_id, value, period) 
      SELECT inst_id, id, base_val + random() * 10000, p FROM kpi_definitions WHERE code = 'energy_consumption';
    END LOOP;
  END LOOP;
END $$;

-- 7. ALERTS
INSERT INTO alerts (institution_id, kpi_definition_id, severity, domain_id, title, message, reasoning) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM kpi_definitions WHERE code = 'dropout_rate'), 'medium', 'pedagogy', 'Dropout approaching threshold', 'Taux d''abandon à 12% — approche du seuil critique de 18%', 'Cohorte 2022-2023 montre un décrochage concentré en 2ème année du cycle ingénieur. Corrélation détectée avec les modules de mathématiques avancées.'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM kpi_definitions WHERE code = 'absenteeism_rate'), 'low', 'hr', 'Stable absenteeism', 'Absentéisme stable à 5.2% — surveillance recommandée', 'Taux conforme à la moyenne nationale, aucune action requise.'),
('11111111-1111-1111-1111-111111111111', NULL, 'medium', 'infrastructure', 'Renovation delays', '3 chantiers en cours, retard prévu de 2 semaines', 'Délai imputable aux livraisons d''équipement laboratoire. Impact estimé sur la rentrée 2025.'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM kpi_definitions WHERE code = 'energy_consumption'), 'high', 'esg', 'Energy spike', 'Consommation énergétique en hausse de 23% vs Q3', 'Pic de consommation HVAC détecté en novembre. Recommandation: réviser plages climatisation week-end.'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM kpi_definitions WHERE code = 'budget_execution'), 'low', 'finance', 'Budget on track', 'Budget en cours d''exécution normale', '83% consommé à 75% de la période — alignement parfait.'),
('22222222-2222-2222-2222-222222222222', NULL, 'medium', 'partnerships', 'Renewal pending', '5 partenariats internationaux en attente de renouvellement', 'Échéances Erasmus+ et accords bilatéraux à traiter avant fin Q1 2025.'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM kpi_definitions WHERE code = 'budget_execution'), 'critical', 'finance', 'Budget at 98.7%', 'Consommation budgétaire à 98.7% avec 6 semaines restantes', 'Risque de dépassement de 850K TND si maintien du rythme. Action requise: gel des engagements non-essentiels.'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM kpi_definitions WHERE code = 'classroom_occupancy'), 'high', 'infrastructure', 'Capacity saturated', 'Occupation salles à 88% — capacité saturée', 'Croissance effectifs 2024 (+12%) sans extension correspondante. Recommandation: location modulaire ou étalement horaires.'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM kpi_definitions WHERE code = 'publications_count'), 'medium', 'research', 'Publication delay', 'Délai moyen de publication en hausse', 'Charge enseignante accrue corrélée avec baisse productivité scientifique.'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM kpi_definitions WHERE code = 'success_rate'), 'low', 'pedagogy', 'Stable performance', 'Performance académique stable et conforme aux objectifs', 'Tous les KPI dans les seuils cibles depuis 3 trimestres.'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM kpi_definitions WHERE code = 'employability_rate'), 'medium', 'employment', 'Insertion slowing', 'Délai d''insertion professionnelle légèrement allongé', 'Marché de l''emploi tendu, particulièrement en finance d''entreprise.'),
('44444444-4444-4444-4444-444444444444', NULL, 'low', 'esg', 'ESG ahead of plan', 'Initiatives ESG en avance sur le calendrier', 'Programme éco-campus déployé 6 mois avant prévision.'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM kpi_definitions WHERE code = 'attendance_rate'), 'medium', 'pedagogy', 'Attendance drop', 'Taux de présence en baisse à 78%', 'Baisse concentrée sur cours du vendredi après-midi. Investigation horaires en cours.'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM kpi_definitions WHERE code = 'absenteeism_rate'), 'high', 'hr', 'Faculty absenteeism', 'Absentéisme enseignant à 11.8%', 'Trois départs non remplacés cumulés sur le semestre. Plan de recrutement urgent.'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM kpi_definitions WHERE code = 'active_projects'), 'low', 'research', 'Patent pipeline', '3 brevets en cours de dépôt', 'Activité INPI active, validation Q1 2025 attendue.');

-- 8. REPORTS
INSERT INTO reports (institution_id, title, period, content, key_findings) VALUES
('11111111-1111-1111-1111-111111111111', 'Note de Synthèse - ENIT Q4 2024', 'monthly', 'Ce rapport présente une analyse approfondie des indicateurs de performance de l''ENIT pour le quatrième trimestre 2024. L''établissement affiche une progression constante dans sa production scientifique, se positionnant comme un leader au sein du réseau UCAR. Cependant, l''analyse prédictive identifie une fragilité dans la rétention des étudiants de deuxième année du cycle ingénieur, particulièrement dans les filières fondamentales. Sur le plan financier, l''exécution budgétaire est alignée sur les prévisions annuelles, permettant d''engager les investissements prévus pour la modernisation des laboratoires de recherche.', '{"findings": ["Excellence scientifique confirmée", "Alerte rétention L2 ingénieur", "Gestion budgétaire optimale"]}'),
('22222222-2222-2222-2222-222222222222', 'Executive Brief - IHEC Carthage 2024', 'monthly', 'L''IHEC Carthage maintient son leadership en termes d''employabilité, avec un taux d''insertion dépassant les 85% dans les six mois suivant l''obtention du diplôme. Le trimestre a été marqué par une intensification des partenariats avec le secteur privé, renforçant l''ancrage professionnel des formations. Un point de vigilance a été soulevé concernant l''efficacité énergétique du campus, suite à une augmentation atypique de la consommation durant la période hivernale. Des mesures correctives sur la gestion technique du bâtiment (GTB) sont préconisées pour le trimestre à venir.', '{"findings": ["Leadership employabilité maintenu", "Réseau partenarial dynamique", "Optimisation énergétique requise"]}'),
('33333333-3333-3333-3333-333333333333', 'Rapport de Pilotage - INSAT Q4 2024', 'monthly', 'L''INSAT atteint des niveaux historiques d''activité scientifique et pédagogique en ce trimestre. La saturation des infrastructures devient un défi critique, avec un taux d''occupation des salles frôlant les 90%, limitant les possibilités d''extension des programmes actuels. La consommation budgétaire est très élevée (98.7%), nécessitant un arbitrage serré pour les dernières semaines de l''exercice. Malgré ces contraintes de ressources, la qualité pédagogique reste stable avec un taux de réussite exemplaire, témoignant de la résilience du corps enseignant et des étudiants.', '{"findings": ["Saturation critique des espaces", "Tension budgétaire maximale", "Résilience pédagogique forte"]}'),
('44444444-4444-4444-4444-444444444444', 'Bilan Trimestriel - ISG Tunis', 'monthly', 'L''ISG Tunis affiche une stabilité remarquable sur l''ensemble de ses indicateurs clés. Les programmes de gestion et de management continuent d''attirer un flux régulier de nouveaux inscrits, garantissant la viabilité financière de l''établissement. Le taux de décrochage est l''un des plus bas du réseau, reflet d''un encadrement de proximité efficace. Les efforts se portent désormais sur l''accréditation internationale de certains cursus, un projet structurant qui devrait porter ses fruits en 2025. La performance ESG est également en avance sur les objectifs fixés.', '{"findings": ["Indicateurs de succès stables", "Taux de décrochage minimal", "Projet accréditation en cours"]}'),
('55555555-5555-5555-5555-555555555555', 'Rapport de Performance - ENSTAB', 'monthly', 'Pour l''ENSTAB, l''année 2024 se clôt sur un bilan contrasté. Si la maîtrise des coûts énergétiques et l''activité de recherche sont positives, l''établissement fait face à un défi de ressources humaines majeur avec plusieurs postes vacants. Cette situation impacte directement le taux de présence et la charge de travail globale. Un plan de recrutement d''urgence a été validé par le rectorat pour stabiliser la situation. Parallèlement, le pipeline d''innovation reste actif avec plusieurs dépôts de brevets en phase de finalisation, promettant une visibilité accrue pour l''école.', '{"findings": ["Déficit de ressources humaines", "Excellence en gestion ESG", "Pipeline innovation actif"]}'),
(NULL, 'Rapport Annuel de Gouvernance - Réseau UCAR 2024', 'annual', 'L''Université de Carthage (UCAR) boucle l''exercice 2024 avec des indicateurs consolidés au vert. Le réseau des 30+ établissements démontre une complémentarité stratégique forte : l''ingénierie et les sciences appliquées (INSAT, ENIT) tirent la recherche vers le haut, tandis que les pôles de gestion (IHEC, ISG) assurent un rayonnement professionnel majeur. L''année a été marquée par le déploiement du centre de commande UCARiq, permettant une visibilité en temps réel sur les flux financiers et pédagogiques. Les priorités pour 2025 s''orientent vers la transition écologique du parc immobilier et l''harmonisation des standards de formation.', '{"findings": ["Synergie réseau renforcée", "Déploiement UCARiq réussi", "Cap sur la transition ESG"]}');
