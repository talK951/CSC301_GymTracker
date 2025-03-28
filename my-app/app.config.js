import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    API_BASE_URL: process.env.BASE_URL + '/api' || 'http://default-ip:8080/api',
    WS_URL: process.env.BASE_URL + '/ws' || 'http://default-ip:8080/ws',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_REGION: process.env.AWS_REGION,
  },
});
