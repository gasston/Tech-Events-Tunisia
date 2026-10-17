"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventFiltersSchema = exports.LoginSchema = exports.AdminUpdateEventSchema = exports.SubmitEventSchema = void 0;
const zod_1 = require("zod");
exports.SubmitEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10).max(5000),
    organizer: zod_1.z.string().min(2).max(200),
    coverImage: zod_1.z.string().optional().nullable(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime().optional().nullable(),
    format: zod_1.z.enum(['onsite', 'online', 'hybrid']),
    city: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
    latitude: zod_1.z.number().optional().nullable(),
    longitude: zod_1.z.number().optional().nullable(),
    onlineUrl: zod_1.z.string().url().optional().nullable(),
    targetAudience: zod_1.z.array(zod_1.z.string()).min(1),
    categories: zod_1.z.array(zod_1.z.string()).min(1),
    registrationUrl: zod_1.z.string().url().optional().nullable(),
    websiteUrl: zod_1.z.string().url().optional().nullable(),
    isFree: zod_1.z.boolean(),
    price: zod_1.z.number().positive().optional().nullable(),
});
exports.AdminUpdateEventSchema = exports.SubmitEventSchema.extend({
    moderationStatus: zod_1.z.enum(['pending', 'published', 'rejected']).optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.EventFiltersSchema = zod_1.z.object({
    format: zod_1.z.enum(['onsite', 'online', 'hybrid']).optional(),
    city: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    audience: zod_1.z.string().optional(),
    status: zod_1.z.enum(['upcoming', 'past']).optional(),
    q: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(50).default(20),
});
