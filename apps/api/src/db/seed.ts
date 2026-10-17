import 'dotenv/config'
import { db } from './index'
import { events, admins } from './schema'
import bcrypt from 'bcryptjs'

function slug(title: string, suffix: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + suffix
}

async function seed() {
  console.log('Seeding database...')

  // Admin
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin_password_change_me'
  const hash = await bcrypt.hash(password, 12)

  await db.insert(admins)
    .values({ email, passwordHash: hash })
    .onConflictDoNothing()

  console.log(`Admin created: ${email}`)

  // Events — reference date: 2026-10-16
  const demoEvents = [
    {
      slug: slug('ai-meetup-tunis', '001'),
      title: 'AI Meetup Tunis',
      description: `Rejoignez-nous pour une soirée dédiée à l'intelligence artificielle au cœur de Tunis. Au programme : démonstrations de modèles de langage, retours d'expérience sur l'intégration de l'IA en entreprise, et networking.\n\nInvités : chercheurs de l'INAT, ingénieurs de startups locales, représentants de GDG Tunis.\n\nThèmes abordés :\n- LLMs open source vs propriétaires\n- RAG et retrieval en production\n- IA générative pour le secteur bancaire tunisien`,
      organizer: 'GDG Tunis',
      startDate: new Date('2026-10-16T18:30:00+01:00'),
      endDate: new Date('2026-10-16T21:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis',
      address: 'The Dot, Lac 1, Tunis',
      latitude: 36.832,
      longitude: 10.218,
      targetAudience: ['Développeurs', 'Data Scientists', 'Entrepreneurs'],
      categories: ['IA', 'Développement'],
      registrationUrl: 'https://gdg.community.dev',
      isFree: true,
      moderationStatus: 'published' as const,
    },
    {
      slug: slug('devfest-tunis', '002'),
      title: 'DevFest Tunis 2026',
      description: `Le plus grand événement developer de l'année revient à Tunis ! DevFest réunit plus de 500 développeurs, designers et entrepreneurs pour deux jours de conférences, ateliers et networking.\n\nSessions :\n- Keynote : L'état du développement web en 2026\n- Flutter & Dart : de zéro à production\n- Architecture microservices sur Kubernetes\n- Design system à grande échelle\n- Web3 et développement décentralisé`,
      organizer: 'GDG Tunis',
      startDate: new Date('2026-10-17T09:00:00+01:00'),
      endDate: new Date('2026-10-18T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis',
      address: 'Hôtel El Mouradi Africa, Tunis',
      latitude: 36.795,
      longitude: 10.183,
      targetAudience: ['Développeurs', 'Designers', 'Entrepreneurs'],
      categories: ['Développement', 'Design', 'Cloud'],
      registrationUrl: 'https://gdg.community.dev/devfest-tunis',
      isFree: false,
      price: '25.00',
      moderationStatus: 'published' as const,
    },
    {
      slug: slug('startup-weekend-tunis', '003'),
      title: 'Startup Weekend Tunis',
      description: `54 heures pour transformer votre idée en startup. Le Startup Weekend est l'événement incontournable de l'écosystème entrepreneurial tunisien.\n\nComment ça marche ?\nVendredi soir : pitchs de 60 secondes, vote, formation des équipes.\nSamedi et dimanche : sprint de développement, mentoring, présentations finales.\n\nDes mentors issus de Flat6Labs, Wamda et des grandes entreprises tunisiennes seront présents pour vous accompagner.`,
      organizer: 'Techstars',
      startDate: new Date('2026-10-18T18:00:00+01:00'),
      endDate: new Date('2026-10-20T20:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis',
      address: 'Impact Hub Tunis, Menzah 9',
      latitude: 36.866,
      longitude: 10.196,
      targetAudience: ['Entrepreneurs', 'Développeurs', 'Designers'],
      categories: ['Startup', 'Business'],
      registrationUrl: 'https://startupweekend.org',
      isFree: false,
      price: '15.00',
      moderationStatus: 'published' as const,
    },
    {
      slug: slug('cloud-native-tunisia', '004'),
      title: 'Cloud Native Tunisia Meetup',
      description: `Meetup mensuel dédié aux technologies cloud natives : Kubernetes, Docker, service mesh, GitOps et tout l'écosystème CNCF.\n\nAu programme de cette édition :\n- Retour d'expérience : migration vers Kubernetes en production\n- ArgoCD et GitOps chez une fintech tunisienne\n- Session live coding : Helm charts from scratch\n- Q&A ouvert`,
      organizer: 'Cloud Native Tunisia',
      startDate: new Date('2026-10-25T18:00:00+01:00'),
      endDate: new Date('2026-10-25T21:00:00+01:00'),
      format: 'hybrid' as const,
      city: 'Ariana',
      address: 'iHub, Ariana',
      latitude: 36.866,
      longitude: 10.160,
      onlineUrl: 'https://meet.google.com/cloud-native-tunisia',
      targetAudience: ['DevOps', 'Développeurs'],
      categories: ['Cloud', 'DevOps'],
      isFree: true,
      moderationStatus: 'published' as const,
    },
    {
      slug: slug('cybersecurity-day-tunisia', '005'),
      title: 'Cybersecurity Day Tunisia',
      description: `La journée nationale de la cybersécurité revient pour sa 5ème édition. Une journée entière de conférences, ateliers pratiques et CTF (Capture The Flag) ouverts à tous.\n\nSessions notables :\n- Threat intelligence et APT en Afrique du Nord\n- Sécurisation des APIs REST\n- Pentest mobile : Android & iOS\n- RGPD et conformité en Tunisie\n- CTF interuniversitaire (100 équipes)`,
      organizer: 'CERT Tunisie',
      startDate: new Date('2026-11-01T09:00:00+01:00'),
      endDate: new Date('2026-11-01T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis',
      address: 'ESPRIT, Ariana',
      latitude: 36.880,
      longitude: 10.197,
      targetAudience: ['Développeurs', 'Étudiants', 'Managers'],
      categories: ['Cybersécurité'],
      isFree: true,
      moderationStatus: 'published' as const,
    },
    {
      slug: slug('data-science-tunisia', '006'),
      title: 'Data Science Tunisia Conference',
      description: `La conférence annuelle Data Science Tunisia rassemble chercheurs, praticiens et entreprises autour des données. Deux journées denses avec 30 speakers internationaux.\n\nThèmes 2026 :\n- Machine Learning en production : défis et solutions\n- Données tabulaires vs LLMs : quand utiliser quoi ?\n- Data pipelines avec dbt et Airflow\n- Éthique des données et biais algorithmiques\n- Cas d'usage Telco et Finance en Tunisie`,
      organizer: 'Data Science Tunisia',
      startDate: new Date('2026-09-20T09:00:00+01:00'),
      endDate: new Date('2026-09-21T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Sousse',
      address: 'Université de Sousse, Technopole',
      latitude: 35.825,
      longitude: 10.639,
      targetAudience: ['Data Scientists', 'Développeurs', 'Managers'],
      categories: ['Data', 'IA'],
      isFree: false,
      price: '20.00',
      moderationStatus: 'published' as const,
    },
    {
      slug: slug('web3-tunisia-meetup', '007'),
      title: 'Web3 Tunisia Meetup',
      description: `Meetup communautaire autour du Web3, la blockchain et les technologies décentralisées.\n\nSessions :\n- Introduction aux smart contracts Solidity\n- DeFi : protocoles et risques\n- NFT au-delà de l'art : cas d'usage réels\n- Présentation de projets tunisiens sur blockchain\n\nNiveau : débutant à intermédiaire. Tout le monde est bienvenu !`,
      organizer: 'Web3 Tunisia',
      startDate: new Date('2026-09-05T18:30:00+01:00'),
      endDate: new Date('2026-09-05T21:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis',
      address: 'Cogite Coworking, Lac 2',
      latitude: 36.845,
      longitude: 10.230,
      targetAudience: ['Développeurs', 'Entrepreneurs', 'Tous publics'],
      categories: ['Web3', 'Développement'],
      isFree: true,
      moderationStatus: 'published' as const,
    },
    {
      slug: slug('product-management-tunisia', '008'),
      title: 'Product Management Tunisia Summit',
      description: `Le premier sommet dédié au Product Management en Tunisie. Une journée pour les PMs, founders et équipes produit qui veulent construire de meilleurs produits.\n\nOrateurs :\n- Ex-PM chez Careem et Glovo\n- Founders de startups tunisiennes scale-ups\n- Head of Product d'une licorne MENA\n\nSessions :\n- Product discovery en marché émergent\n- Métriques produit qui comptent vraiment\n- De 0 à 1 : construire le bon produit dès le départ\n- Stakeholder management : garder le cap`,
      organizer: 'Product Tunis',
      startDate: new Date('2026-11-15T09:00:00+01:00'),
      endDate: new Date('2026-11-15T18:00:00+01:00'),
      format: 'onsite' as const,
      city: 'Tunis',
      address: 'Le Carré, Lac 1',
      latitude: 36.832,
      longitude: 10.222,
      targetAudience: ['Managers', 'Entrepreneurs', 'Développeurs'],
      categories: ['Business', 'Startup'],
      registrationUrl: 'https://producttunis.com',
      isFree: false,
      price: '30.00',
      moderationStatus: 'published' as const,
    },
  ]

  for (const event of demoEvents) {
    await db.insert(events)
      .values(event as any)
      .onConflictDoNothing()
  }

  console.log(`Seeded ${demoEvents.length} events.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
