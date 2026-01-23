import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return {
    secret,
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  };
});
