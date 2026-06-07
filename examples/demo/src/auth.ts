import { betterAuth } from 'better-auth';
import { memoryAdapter } from 'better-auth/adapters/memory';

export const buildAuth = () => {
  if (!process.env.BETTER_AUTH_SECRET) {
    return null;
  }

  return betterAuth({
    database: memoryAdapter({
      user: [],
      session: [],
      account: [],
      verification: [],
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3333',
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
  });
};
