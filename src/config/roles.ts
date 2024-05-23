import { registerAs } from '@nestjs/config';

export default registerAs('roles', () => ({
  ADMIN_ROLE: 'admin',
  USER_ROLE: 'user',
}));
