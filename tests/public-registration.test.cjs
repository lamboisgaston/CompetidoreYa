const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(relative, mocks = {}) {
  const cache = new Map();
  function read(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} }; cache.set(filename, module);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    const localRequire = name => {
      if (name in mocks) return mocks[name];
      if (!name.startsWith('.')) return require(name);
      return read(path.resolve(path.dirname(filename), name.replace(/\.js$/, '.ts')));
    };
    new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
    return module.exports;
  }
  return read(path.resolve(__dirname, '..', relative));
}

test('el alta pública rechaza superadministrador, roles inventados y parámetros extra', () => {
  const { registerSchema } = load('src/modules/auth/auth.schemas.ts');
  const base = { email: 'ciudadano@example.test', password: 'clave-de-prueba-123' };
  for (const role of ['SUPER_ADMIN', 'ADMIN', '', undefined]) assert.equal(registerSchema.safeParse({ ...base, role }).success, false);
  for (const role of ['COMPETIDOR', 'ORGANIZADOR', 'ARBITRO']) assert.equal(registerSchema.safeParse({ ...base, role }).success, true);
  assert.equal(registerSchema.safeParse({ ...base, role: 'COMPETIDOR', admin: true }).success, false);
});

test('el servicio impide elevar privilegios aunque se omita el controlador', async () => {
  const writes = []; let hashes = 0;
  const { registerUser } = load('src/modules/auth/auth.service.ts', {
    '@prisma/client': { AuditAction: { LOGIN: 'LOGIN' } },
    bcrypt: { hash: async () => { hashes++; return 'hash'; } }, jsonwebtoken: {},
    '../../config/env.js': { env: { BCRYPT_SALT_ROUNDS: 12 } },
    '../../config/prisma.js': { prisma: { user: { findUnique: async () => null, create: async input => { writes.push(input.data); return input.data; } } } },
    '../audit/audit.service.js': { registerAudit: async () => {} },
  });
  const base = { email: 'ciudadano@example.test', password: 'clave-de-prueba-123' };
  await assert.rejects(registerUser({ ...base, role: 'SUPER_ADMIN' }), /no admite registro público/);
  assert.equal(hashes, 0); assert.equal(writes.length, 0);
  await registerUser({ ...base, role: 'COMPETIDOR' });
  assert.equal(writes.length, 1); assert.equal(writes[0].role, 'COMPETIDOR');
});

test('Express recibe el rechazo del controlador y puede responder sin una promesa sin manejar', async () => {
  const { asyncRoute } = load('src/core/middleware/async-route.ts');
  const rechazo = new Error('registro rechazado');
  const recibido = await new Promise(resolve => asyncRoute(async () => { throw rechazo; })({}, {}, resolve));
  assert.equal(recibido, rechazo);
});
