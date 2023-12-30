export const parseNullableInt = (value: string | null): number | null => {
  if (value === null) {
    return null;
  }

  const parsed = parseInt(value, 10);

  return isNaN(parsed) ? null : parsed;
};
