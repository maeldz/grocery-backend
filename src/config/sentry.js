export default {
  dsn: process.env.NODE_ENV !== 'development' ? process.env.SENTRY_DSN : '',
};
