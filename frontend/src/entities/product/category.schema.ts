import * as v from 'valibot';

const CategoryToName = {
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
};

export const CategorySchema = v.pipe(
  v.picklist(['auto', 'real_estate', 'electronics']),
  v.transform((ctg) => ({ slug: ctg, name: CategoryToName[ctg] })),
);
