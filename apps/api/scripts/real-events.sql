-- Remplace les événements de démo par de vrais événements tech en Tunisie (vérifiés sur le web, oct. 2026).
BEGIN;

DELETE FROM events;

INSERT INTO events
  (slug, title, description, organizer, start_date, end_date, format, city, address, latitude, longitude,
   target_audience, categories, registration_url, website_url, is_free, price, views, moderation_status)
VALUES
-- ─── À venir ────────────────────────────────────────────────────────────────
(
  'trai-2026-hammamet',
  'TRAI 2026 — TRIZ & Artificial Intelligence Conference',
  E'26e conférence internationale IFIP WG 5.4 sur la synergie entre TRIZ, l''intelligence artificielle et l''optimisation pour la conception de systèmes complexes.\n\nTrois jours réunissant chercheurs, ingénieurs, designers et spécialistes de l''innovation autour de la résolution de problèmes de nouvelle génération, du design inventif et de la décision intelligente. Actes publiés chez Springer.\n\nAffiliée à ETRIA, IFIP, INSA Strasbourg et l''Université de Strasbourg.',
  'ETRIA / IFIP WG 5.4',
  '2026-10-21T09:00:00+01:00', '2026-10-23T18:00:00+01:00',
  'onsite', 'Autre', 'Diar Lemdina Hotel, Yasmine Hammamet', 36.371, 10.546,
  '["Data Scientists","Développeurs","Managers"]', '["IA","Data"]',
  'https://www.trai2026.org/', 'https://www.trai2026.org/', false, NULL, 42, 'published'
),
(
  'aidist-2026-tunis',
  'IEEE AIDIST 2026 — AI for a Digital and Sustainable Transition',
  E'Conférence internationale IEEE sur l''intelligence artificielle au service d''une transition numérique et durable, dans le cadre de la 5e édition du Forum International Citoyen sur l''Éducation et la Recherche Interdisciplinaire (FCIERI).\n\nCo-sponsorisée techniquement par l''IEEE Computational Intelligence Society, sous l''égide du Ministère de l''Enseignement supérieur et de la Recherche scientifique. Axes : IA et résilience écologique, IA et santé, citoyenneté et éthique de l''IA, IA dans l''industrie et les services. Papiers publiés sur IEEE Xplore.',
  'IEEE CIS / FCIERI',
  '2026-10-29T09:00:00+01:00', '2026-10-31T18:00:00+01:00',
  'onsite', 'Tunis', 'El Mouradi Hotel Gammarth, Tunis', 36.918, 10.287,
  '["Data Scientists","Étudiants","Développeurs"]', '["IA","Data"]',
  'https://forumtunisieneducation.org/artificial-intelligence-conference/',
  'https://forumtunisieneducation.org/artificial-intelligence-conference/', false, NULL, 67, 'published'
),
(
  'smart-innovations-sousse-2026',
  'International Conference on Smart Innovations for Medicine and Engineering',
  E'Conférence internationale consacrée aux innovations intelligentes appliquées à la médecine et à l''ingénierie : IA médicale, systèmes embarqués, données de santé et ingénierie assistée.\n\nTrois jours de présentations scientifiques et d''échanges entre chercheurs et praticiens, à la Foire Internationale de Sousse.',
  'Université de Sousse',
  '2026-11-02T09:00:00+01:00', '2026-11-04T18:00:00+01:00',
  'onsite', 'Sousse', 'Foire Internationale de Sousse', 35.853, 10.600,
  '["Data Scientists","Étudiants","Développeurs"]', '["IA","Data"]',
  NULL, NULL, false, NULL, 23, 'published'
),
-- ─── Passés ──────────────────────────────────────────────────────────────────
(
  'ai-forward-summit-2026-hammamet',
  'AI Forward Summit 2026',
  E'Sommet régional sur l''intelligence artificielle organisé à Hammamet, autour de quatre piliers : infrastructure numérique prête pour l''IA, écosystèmes d''innovation et renforcement des compétences, gouvernance et cadres éthiques de l''IA, partenariats et coopération régionale.\n\nDeux jours d''ateliers suivis de deux jours de conférence principale et d''exposition, au Medina Congress & Exhibition Center.',
  'AICTO',
  '2026-09-07T09:00:00+01:00', '2026-09-10T18:00:00+01:00',
  'onsite', 'Autre', 'Medina Congress & Exhibition Center, Yasmine Hammamet', 36.368, 10.553,
  '["Managers","Entrepreneurs","Data Scientists"]', '["IA","Business"]',
  'https://ai-forwardsummit.org/', 'https://ai-forwardsummit.org/', true, NULL, 180, 'published'
),
(
  'fork-it-tunis-2026',
  'Fork it! Tunis 2026',
  E'Conférence tech d''une journée réunissant 200 professionnels et créatifs de la tech méditerranéenne à la Cité de la Culture de Tunis.\n\nRetours d''expérience concrets en français, anglais et arabe, avec un plateau d''intervenants internationaux et locaux. Thèmes 2026 : impact de l''IA sur le software delivery et l''UX design.',
  'Fork it! Community',
  '2026-04-18T09:00:00+01:00', '2026-04-18T18:00:00+01:00',
  'onsite', 'Tunis', 'Cité de la Culture, Tunis', 36.826, 10.185,
  '["Développeurs","Designers","Entrepreneurs"]', '["Développement","Design","IA"]',
  'https://www.forkit.community/events/2026-tunisia-tunis',
  'https://www.forkit.community/events/2026-tunisia-tunis', false, NULL, 540, 'published'
),
(
  'tunisia-digital-summit-2026',
  'Tunisia Digital Summit 2026 — 10e édition',
  E'Dixième édition du Tunisia Digital Summit, rendez-vous majeur de la transformation digitale en Tunisie.\n\nDeux jours de conférences, panels et networking réunissant décideurs, entreprises et acteurs du numérique, au Radisson Blu & Convention Center.',
  'Tunisia Digital Summit',
  '2026-04-22T09:00:00+01:00', '2026-04-23T18:00:00+01:00',
  'onsite', 'Tunis', 'Radisson Blu & Convention Center, Tunis', 36.835, 10.240,
  '["Managers","Entrepreneurs","Développeurs"]', '["Business","Startup"]',
  NULL, 'https://www.facebook.com/Tunisia.Digital.Summit/', false, NULL, 410, 'published'
),
(
  'ai-dl-ml-sfax-2026',
  'AI, DL & ML Conference — Sfax',
  E'Conférence de deux jours à Sfax consacrée aux domaines en pleine évolution de l''intelligence artificielle, du deep learning et du machine learning.\n\nPrésentations de recherche et retours d''expérience destinés aux chercheurs, étudiants et praticiens de la data.',
  'Université de Sfax',
  '2026-10-08T09:00:00+01:00', '2026-10-09T18:00:00+01:00',
  'onsite', 'Sfax', 'Sfax, Tunisie', 34.740, 10.760,
  '["Data Scientists","Étudiants","Développeurs"]', '["IA","Data"]',
  NULL, NULL, false, NULL, 95, 'published'
);

COMMIT;
