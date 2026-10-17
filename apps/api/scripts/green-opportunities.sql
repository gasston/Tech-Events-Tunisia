-- Appels à candidatures / événements "économie verte" fournis par l'utilisateur (texte réel).
-- Dates limites déjà passées au 2026-10-16 → afficheront en "Passés".
BEGIN;

INSERT INTO events
  (slug, title, description, organizer, start_date, end_date, format, city, address, latitude, longitude,
   target_audience, categories, registration_url, website_url, is_free, price, views, moderation_status)
VALUES
(
  'ggjap-cohorte-6-flat6labs',
  'GGJAP — Accélérateur de croissance verte et d''emplois (6e cohorte)',
  E'Le PNUD Tunisie, en partenariat avec Flat6Labs, lance la 6e cohorte du Projet d''Accélérateur de Croissance Verte et d''Emploi (GGJAP), dans le cadre du Danish-Arab Partnership Programme (DAPP).\n\nProgramme intensif de 5 mois (format hybride, 2 à 4h/semaine) pour accompagner 25 PME/startups tunisiennes vers un modèle plus durable et la création d''emplois verts.\n\nÉligibilité : PME/startup enregistrée en Tunisie, ≥ 2 ans d''activité, équipe d''au moins 4 personnes, activité liée à l''économie verte.\n\nClôture des candidatures : 10 octobre 2026. Contact : tarak.bey@undp.org · melek@flat6labs.com',
  'Flat6Labs & PNUD Tunisie',
  '2026-10-10T18:00:00+01:00', NULL,
  'hybrid', 'Tunis', 'Flat6Labs Tunis', 36.843, 10.267,
  '["Entrepreneurs","Managers"]', '["Startup","Business"]',
  'https://app.babele.co/application-definition/1051', NULL, true, NULL, 320, 'published'
),
(
  'cqe-bilan-ges-giz-2026',
  'Appel à candidatures — Bilan GES pour entreprises industrielles (CQE)',
  E'Initiative du projet « Croissance Qualitative pour l''Emploi » (CQE), financé par l''Union européenne et le ministère allemand BMZ, mis en œuvre par la GIZ Tunisie avec le Ministère de l''Industrie, des Mines et de l''Énergie.\n\nAccompagnement des entreprises industrielles tunisiennes pour la réalisation de leur Bilan GES (gaz à effet de serre) : mesurer les émissions, identifier les principales sources, anticiper les exigences environnementales des marchés et partenaires.\n\nÉligibilité : entreprise industrielle immatriculée en Tunisie (RNE), ≥ 2 ans d''activité, situation financière saine, responsable + chef de projet dédiés, sans accompagnement similaire en 2024/2025.\n\nClôture : 15 octobre 2026. Info : contact.cqe@giz.de',
  'GIZ Tunisie',
  '2026-10-15T18:00:00+01:00', NULL,
  'hybrid', 'Autre', NULL, NULL, NULL,
  '["Entrepreneurs","Managers"]', '["Business"]',
  'https://buff.ly/BsLfRvL', NULL, true, NULL, 140, 'published'
),
(
  'green-skills-academy-2026-sfax',
  'Green Skills Academy',
  E'Événement porté par la Fondation Djagora en partenariat avec l''IIT Sfax, avec le soutien de Greenov''i (projet financé par l''Union européenne, mis en œuvre par Expertise France).\n\n7 fondateurs de startups vertes — Robocare, WeDetect, TIM''ESS, ITRI, Phytopro, Hyotec, Exypnos — partagent méthodes, bonnes pratiques et contacts accumulés pendant des années.\n\nPour toute personne avec une idée de projet, un prototype en cours, ou qui veut réorienter sa carrière vers le vert.\n\nCandidatures avant le 30 septembre 2026.',
  'Fondation Djagora',
  '2026-10-10T09:00:00+01:00', '2026-10-10T18:00:00+01:00',
  'onsite', 'Sfax', 'IIT Sfax', 34.728, 10.452,
  '["Entrepreneurs","Étudiants"]', '["Startup","Business"]',
  'https://bit.ly/4dDUAGu', NULL, true, NULL, 210, 'published'
);

COMMIT;
