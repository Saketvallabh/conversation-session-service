export function normalizePagination(limit?: number, offset?: number) {
  const normalizedLimit = Math.min(Math.max(limit || 10, 1), 100);
  const normalizedOffset = Math.max(offset || 0, 0);

  return {
    limit: normalizedLimit,
    offset: normalizedOffset,
  };
}