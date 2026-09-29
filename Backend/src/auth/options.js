const bcrypt = require('bcryptjs');
const { admin, bearer } = require('better-auth/plugins');
const { adminAc } = require('better-auth/plugins/admin/access');

const { env } = require('../config/env');

function createBetterAuthOptions(database) {
  return {
    basePath: '/api/v1/auth',
    baseURL: env.betterAuthUrl,
    secret: env.betterAuthSecret,
    trustedOrigins: env.corsOrigins,
    database,
    emailAndPassword: {
      enabled: true,
      // El registro publico solo servia al ecommerce; las cuentas de staff se
      // provisionan desde el panel (staff.service -> createAuthIdentity).
      disableSignUp: true,
      requireEmailVerification: false,
      password: {
        hash: async (password) => bcrypt.hash(password, 10),
        verify: async ({ password, hash }) => bcrypt.compare(password, hash),
      },
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'admin',
          input: false,
        },
      },
    },
    plugins: [
      bearer(),
      admin({
        defaultRole: 'admin',
        adminRoles: ['admin'],
        roles: {
          admin: adminAc,
        },
      }),
    ],
  };
}

module.exports = { createBetterAuthOptions };
