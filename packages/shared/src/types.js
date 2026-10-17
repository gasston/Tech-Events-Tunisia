"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_COLORS = exports.FORMAT_LABELS = exports.AUDIENCES = exports.CITIES = exports.CATEGORIES = void 0;
exports.getTemporalStatus = getTemporalStatus;
exports.CATEGORIES = [
    'IA',
    'Développement',
    'Startup',
    'Cloud',
    'Cybersécurité',
    'Data',
    'Design',
    'Business',
    'DevOps',
    'Web3',
    'Autre',
];
exports.CITIES = [
    'Tunis',
    'Ariana',
    'Ben Arous',
    'Manouba',
    'Sousse',
    'Sfax',
    'Autre',
];
exports.AUDIENCES = [
    'Développeurs',
    'Designers',
    'Entrepreneurs',
    'Étudiants',
    'Managers',
    'Data Scientists',
    'DevOps',
    'Tous publics',
];
exports.FORMAT_LABELS = {
    onsite: 'Présentiel',
    online: 'En ligne',
    hybrid: 'Hybride',
};
exports.CATEGORY_COLORS = {
    'IA': { bg: '#DBEAFE', text: '#1D4ED8' },
    'Développement': { bg: '#DCFCE7', text: '#15803D' },
    'Startup': { bg: '#FEF3C7', text: '#B45309' },
    'Cloud': { bg: '#E0F2FE', text: '#0369A1' },
    'Cybersécurité': { bg: '#FEE2E2', text: '#B91C1C' },
    'Data': { bg: '#F3E8FF', text: '#7E22CE' },
    'Design': { bg: '#FCE7F3', text: '#BE185D' },
    'Business': { bg: '#FEF9C3', text: '#CA8A04' },
    'DevOps': { bg: '#CCFBF1', text: '#0F766E' },
    'Web3': { bg: '#E0E7FF', text: '#4338CA' },
    'Autre': { bg: '#F3F4F6', text: '#4B5563' },
};
function getTemporalStatus(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    if (now < start)
        return 'upcoming';
    if (end && now > end)
        return 'past';
    if (!end && now > start)
        return 'past';
    return 'ongoing';
}
