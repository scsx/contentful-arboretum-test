import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE || '',
  accessToken: process.env.CONTENTFUL_CDA_TOKEN || '',
  environment: 'master',
});

export default client;