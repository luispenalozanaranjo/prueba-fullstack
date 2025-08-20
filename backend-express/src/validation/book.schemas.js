import { z } from 'zod';

const nowYear = new Date().getFullYear();

/** id de OpenLibrary: queremos '/works/OLxxxxW' o '/books/OLxxxxM' */
export const openLibraryIdSchema = z.string()
  .trim()
  .min(1, 'openLibraryId es obligatorio')
  .refine(s => s.startsWith('/'), 'openLibraryId debe comenzar con "/"')
  .refine(s => /^\/(works|books)\/[A-Za-z0-9]+/.test(s), 'Formato esperado: "/works/OLxxxx..." o "/books/OLxxxx..."');

/** strings base */
const titleSchema  = z.string().trim().min(1, 'title es obligatorio').max(200, 'title demasiado largo');
const authorSchema = z.string().trim().min(1, 'author es obligatorio').max(200, 'author demasiado largo');

/** año opcional (0..año actual) */
const yearSchema = z.number().int().min(0).max(nowYear).nullable().optional();

/** review opcional con límite 500 */
const reviewSchema = z.string().trim().max(500, 'review máximo 500 caracteres').optional();

/** rating opcional 1..5 */
const ratingSchema = z.number().int().min(1).max(5).nullable().optional();

/** portada base64 (permitimos png/jpg/webp); opcional */
const base64ImageSchema = z.string().trim()
  .regex(/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=\s]+$/, 'coverBase64 inválida (debe ser data:image/...;base64,...)')
  .max(2_000_000, 'coverBase64 muy grande (usa una imagen más pequeña)')
  .optional();

/** Crear (POST): campos obligatorios + opcionales */
export const bookCreateSchema = z.object({
  openLibraryId: openLibraryIdSchema,
  title: titleSchema,
  author: authorSchema,
  year: z.preprocess(v => (v === '' || v === null ? null : Number(v)), yearSchema),
  review: z.preprocess(v => (v == null ? undefined : String(v)), reviewSchema),
  rating: z.preprocess(v => (v === '' ? null : v), ratingSchema),
  coverBase64: z.preprocess(v => (v === '' ? undefined : v), base64ImageSchema),
}).strict();

/** Editar (PUT): todos opcionales, pero al menos uno presente */
export const bookUpdateSchema = z.object({
  title: titleSchema.optional(),
  author: authorSchema.optional(),
  year: z.preprocess(v => (v === '' || v === null ? null : Number(v)), yearSchema).optional(),
  review: z.preprocess(v => (v == null ? undefined : String(v)), reviewSchema).optional(),
  rating: z.preprocess(v => (v === '' ? null : v), ratingSchema).optional(),
  coverBase64: z.preprocess(v => (v === '' ? undefined : v), base64ImageSchema).optional(),
}).strict().refine(obj => Object.keys(obj).length > 0, {
  message: 'No hay campos para actualizar',
});

/** Filtros de listado */
export const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  author: z.string().trim().max(100).optional(),
  excludeNoReview: z.preprocess(v => (v === 'true' || v === true), z.boolean()).optional(),
  sort: z.enum(['rating_desc', 'rating_asc']).default('rating_desc'),
}).strict();

/** Validación de id de Mongo en params */
export const mongoIdSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Id inválido'),
});
