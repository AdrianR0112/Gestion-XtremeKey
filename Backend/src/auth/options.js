const bcrypt = require('bcryptjs');
const { admin } = require('better-auth/plugins');
const { adminAc, userAc } = require('better-auth/plugins/admin/access');

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
          defaultValue: 'cliente',
          input: false,
        },
      },
    },
    plugins: [
      admin({
        defaultRole: 'cliente',
        adminRoles: ['admin'],
        roles: {
          admin: adminAc,
          cliente: userAc,
        },
      }),
    ],
  };
}

module.exports = { createBetterAuthOptions };
