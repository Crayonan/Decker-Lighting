import { createClient } from 'contentful';

const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error('Contentful space ID or access token is missing in environment variables.');
}

export const client = createClient({
  space: spaceId,
  accessToken: accessToken
});