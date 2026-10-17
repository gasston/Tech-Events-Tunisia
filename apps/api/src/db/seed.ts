import 'dotenv/config'
import { db } from './index'
import { events, admins } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('Seeding database...')

  // Admin
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin_password_change_me'
  const hash = await bcrypt.hash(password, 12)

  await db.insert(admins).values({ email, passwordHash: hash }).onConflictDoNothing()
  console.log(`Admin created: ${email}`)

  // Vrais événements tech en Tunisie (vérifiés sur le web). Tous publiés.
  const realEvents = [
    {
      slug: 'trai-2026-hammamet',
      title: 'TRAI 2026 — TRIZ & Artificial Intelligence Conference',
      description: `26e conférence internationale IFIP WG 5.4 sur la synergie entre TRIZ, l'intelligence artificielle et l'optimisation pour la conception de systèmes complexes.\n\nTrois jours réunissant chercheurs, ingénieurs, designers et spécialistes de l'innovation autour de la résolution de problèmes de nouvelle génération, du design inventif et de la décision intelligente. Actes publiés chez Springer.\n\nAffiliée à ETRIA, IFIP, INSA Strasbourg et l'Université de Strasbourg.`,
      organizer: 'ETRIA / IFIP WG 5.4',
      startDate: new Date('2026-10-21T09:00:00+01:00'),
      endDate: new Date('2026-10-23T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Autre', address: 'Diar Lemdina Hotel, Yasmine Hammamet',
      latitude: 36.371, longitude: 10.546,
      targetAudience: ['Data Scientists', 'Développeurs', 'Managers'],
      categories: ['IA', 'Data'],
      registrationUrl: 'https://www.trai2026.org/', websiteUrl: 'https://www.trai2026.org/',
      isFree: false, price: null, views: 42, moderationStatus: 'published' as const,
    },
    {
      slug: 'aidist-2026-tunis',
      title: 'IEEE AIDIST 2026 — AI for a Digital and Sustainable Transition',
      description: `Conférence internationale IEEE sur l'intelligence artificielle au service d'une transition numérique et durable, dans le cadre de la 5e édition du Forum International Citoyen sur l'Éducation et la Recherche Interdisciplinaire (FCIERI).\n\nCo-sponsorisée techniquement par l'IEEE Computational Intelligence Society, sous l'égide du Ministère de l'Enseignement supérieur. Axes : IA et résilience écologique, IA et santé, éthique de l'IA, IA dans l'industrie. Papiers publiés sur IEEE Xplore.`,
      organizer: 'IEEE CIS / FCIERI',
      startDate: new Date('2026-10-29T09:00:00+01:00'),
      endDate: new Date('2026-10-31T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis', address: 'El Mouradi Hotel Gammarth, Tunis',
      latitude: 36.918, longitude: 10.287,
      targetAudience: ['Data Scientists', 'Étudiants', 'Développeurs'],
      categories: ['IA', 'Data'],
      registrationUrl: 'https://forumtunisieneducation.org/artificial-intelligence-conference/',
      websiteUrl: 'https://forumtunisieneducation.org/artificial-intelligence-conference/',
      isFree: false, price: null, views: 67, moderationStatus: 'published' as const,
    },
    {
      slug: 'smart-innovations-sousse-2026',
      title: 'International Conference on Smart Innovations for Medicine and Engineering',
      description: `Conférence internationale consacrée aux innovations intelligentes appliquées à la médecine et à l'ingénierie : IA médicale, systèmes embarqués, données de santé et ingénierie assistée.\n\nTrois jours de présentations scientifiques et d'échanges entre chercheurs et praticiens, à la Foire Internationale de Sousse.`,
      organizer: 'Université de Sousse',
      startDate: new Date('2026-11-02T09:00:00+01:00'),
      endDate: new Date('2026-11-04T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Sousse', address: 'Foire Internationale de Sousse',
      latitude: 35.853, longitude: 10.600,
      targetAudience: ['Data Scientists', 'Étudiants', 'Développeurs'],
      categories: ['IA', 'Data'],
      registrationUrl: null, websiteUrl: null,
      isFree: false, price: null, views: 23, moderationStatus: 'published' as const,
    },
    {
      slug: 'ai-forward-summit-2026-hammamet',
      title: 'AI Forward Summit 2026',
      description: `Sommet régional sur l'intelligence artificielle à Hammamet : infrastructure numérique prête pour l'IA, écosystèmes d'innovation, gouvernance et éthique de l'IA, partenariats régionaux.\n\nDeux jours d'ateliers suivis de deux jours de conférence et d'exposition, au Medina Congress & Exhibition Center.`,
      organizer: 'AICTO',
      startDate: new Date('2026-09-07T09:00:00+01:00'),
      endDate: new Date('2026-09-10T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Autre', address: 'Medina Congress & Exhibition Center, Yasmine Hammamet',
      latitude: 36.368, longitude: 10.553,
      targetAudience: ['Managers', 'Entrepreneurs', 'Data Scientists'],
      categories: ['IA', 'Business'],
      registrationUrl: 'https://ai-forwardsummit.org/', websiteUrl: 'https://ai-forwardsummit.org/',
      isFree: true, price: null, views: 180, moderationStatus: 'published' as const,
    },
    {
      slug: 'fork-it-tunis-2026',
      title: 'Fork it! Tunis 2026',
      description: `Conférence tech d'une journée réunissant 200 professionnels et créatifs de la tech méditerranéenne à la Cité de la Culture de Tunis.\n\nRetours d'expérience concrets en français, anglais et arabe, avec un plateau d'intervenants internationaux et locaux. Thèmes 2026 : impact de l'IA sur le software delivery et l'UX design.`,
      organizer: 'Fork it! Community',
      startDate: new Date('2026-04-18T09:00:00+01:00'),
      endDate: new Date('2026-04-18T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis', address: 'Cité de la Culture, Tunis',
      latitude: 36.826, longitude: 10.185,
      targetAudience: ['Développeurs', 'Designers', 'Entrepreneurs'],
      categories: ['Développement', 'Design', 'IA'],
      registrationUrl: 'https://www.forkit.community/events/2026-tunisia-tunis',
      websiteUrl: 'https://www.forkit.community/events/2026-tunisia-tunis',
      isFree: false, price: null, views: 540, moderationStatus: 'published' as const,
    },
    {
      slug: 'tunisia-digital-summit-2026',
      title: 'Tunisia Digital Summit 2026 — 10e édition',
      description: `Dixième édition du Tunisia Digital Summit, rendez-vous majeur de la transformation digitale en Tunisie.\n\nDeux jours de conférences, panels et networking réunissant décideurs, entreprises et acteurs du numérique, au Radisson Blu & Convention Center.`,
      organizer: 'Tunisia Digital Summit',
      startDate: new Date('2026-04-22T09:00:00+01:00'),
      endDate: new Date('2026-04-23T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis', address: 'Radisson Blu & Convention Center, Tunis',
      latitude: 36.835, longitude: 10.240,
      targetAudience: ['Managers', 'Entrepreneurs', 'Développeurs'],
      categories: ['Business', 'Startup'],
      registrationUrl: null, websiteUrl: 'https://www.facebook.com/Tunisia.Digital.Summit/',
      isFree: false, price: null, views: 410, moderationStatus: 'published' as const,
    },
    {
      slug: 'ai-dl-ml-sfax-2026',
      title: 'AI, DL & ML Conference — Sfax',
      description: `Conférence de deux jours à Sfax consacrée à l'intelligence artificielle, au deep learning et au machine learning.\n\nPrésentations de recherche et retours d'expérience destinés aux chercheurs, étudiants et praticiens de la data.`,
      organizer: 'Université de Sfax',
      startDate: new Date('2026-10-08T09:00:00+01:00'),
      endDate: new Date('2026-10-09T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Sfax', address: 'Sfax, Tunisie',
      latitude: 34.740, longitude: 10.760,
      targetAudience: ['Data Scientists', 'Étudiants', 'Développeurs'],
      categories: ['IA', 'Data'],
      registrationUrl: null, websiteUrl: null,
      isFree: false, price: null, views: 95, moderationStatus: 'published' as const,
    },
    {
      slug: 'ggjap-cohorte-6-flat6labs',
      title: 'GGJAP — Accélérateur de croissance verte et d\'emplois (6e cohorte)',
      description: `Le PNUD Tunisie, en partenariat avec Flat6Labs, lance la 6e cohorte du Projet d'Accélérateur de Croissance Verte et d'Emploi (GGJAP), dans le cadre du Danish-Arab Partnership Programme.\n\nProgramme intensif de 5 mois (hybride) pour accompagner 25 PME/startups tunisiennes vers un modèle durable et la création d'emplois verts.\n\nClôture des candidatures : 10 octobre 2026.`,
      organizer: 'Flat6Labs & PNUD Tunisie',
      startDate: new Date('2026-10-10T18:00:00+01:00'),
      endDate: null,
      format: 'hybrid' as const,
      city: 'Tunis', address: 'Flat6Labs Tunis',
      latitude: 36.843, longitude: 10.267,
      targetAudience: ['Entrepreneurs', 'Managers'],
      categories: ['Startup', 'Business'],
      registrationUrl: 'https://app.babele.co/application-definition/1051', websiteUrl: null,
      isFree: true, price: null, views: 320, moderationStatus: 'published' as const,
    },
    {
      slug: 'cqe-bilan-ges-giz-2026',
      title: 'Appel à candidatures — Bilan GES pour entreprises industrielles (CQE)',
      description: `Initiative du projet « Croissance Qualitative pour l'Emploi » (CQE), financé par l'Union européenne et le BMZ, mis en œuvre par la GIZ Tunisie avec le Ministère de l'Industrie.\n\nAccompagnement des entreprises industrielles tunisiennes pour réaliser leur Bilan GES : mesurer les émissions, identifier les sources, anticiper les exigences environnementales des marchés.\n\nClôture : 15 octobre 2026.`,
      organizer: 'GIZ Tunisie',
      startDate: new Date('2026-10-15T18:00:00+01:00'),
      endDate: null,
      format: 'hybrid' as const,
      city: 'Autre', address: null,
      latitude: null, longitude: null,
      targetAudience: ['Entrepreneurs', 'Managers'],
      categories: ['Business'],
      registrationUrl: 'https://buff.ly/BsLfRvL', websiteUrl: null,
      isFree: true, price: null, views: 140, moderationStatus: 'published' as const,
    },
    {
      slug: 'green-skills-academy-2026-sfax',
      title: 'Green Skills Academy',
      description: `Événement porté par la Fondation Djagora en partenariat avec l'IIT Sfax, avec le soutien de Greenov'i (financé par l'Union européenne, mis en œuvre par Expertise France).\n\n7 fondateurs de startups vertes — Robocare, WeDetect, TIM'ESS, ITRI, Phytopro, Hyotec, Exypnos — partagent méthodes, bonnes pratiques et contacts.\n\nCandidatures avant le 30 septembre 2026.`,
      organizer: 'Fondation Djagora',
      startDate: new Date('2026-10-10T09:00:00+01:00'),
      endDate: new Date('2026-10-10T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Sfax', address: 'IIT Sfax',
      latitude: 34.728, longitude: 10.452,
      targetAudience: ['Entrepreneurs', 'Étudiants'],
      categories: ['Startup', 'Business'],
      registrationUrl: 'https://bit.ly/4dDUAGu', websiteUrl: null,
      isFree: true, price: null, views: 210, moderationStatus: 'published' as const,
    },
  ]

  for (const event of realEvents) {
    await db.insert(events).values(event as any).onConflictDoNothing()
  }

  console.log(`Seeded ${realEvents.length} events.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
