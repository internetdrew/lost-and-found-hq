import { z } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateRequest = (schema: {
  body?: z.ZodType;
  params?: z.ZodType;
}): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (schema.body) {
        await schema.body.parseAsync(req.body);
      }
      if (schema.params) {
        await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
        return;
      }
      res.status(500).json({ error: 'Validation failed' });
      return;
    }
  };
};
