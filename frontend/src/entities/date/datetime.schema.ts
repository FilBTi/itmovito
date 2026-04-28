import * as v from 'valibot';

export const DateSchema = v.pipe(
  v.string(),
  v.transform((item) => new Date(item)),
);
