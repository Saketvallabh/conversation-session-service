export default function validate(config: Record<string, unknown>) {
  if (!config.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  return {
    PORT: config.PORT || 3000,
    MONGODB_URI: config.MONGODB_URI,
  };
}