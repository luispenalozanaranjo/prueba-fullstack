import { ZodError } from 'zod';

/**
 * Valida req[where] (body|query|params) contra un schema de Zod.
 * Si pasa, sobreescribe req[where] con la versión saneada.
 */
export const validate = (schema, where = 'body') => (req, res, next) => {
  try {
    const input = req[where] ?? {};
    const data = schema.parse(input);
    req[where] = data; // datos saneados/transformados
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: 'ValidationError',
        details: err.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        })),
      });
    }
    next(err);
  }
};
