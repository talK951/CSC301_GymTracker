import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://default-ip:8080/api',
  },
});
