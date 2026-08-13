// Definición global de roles de usuario (Coherencia exacta con BackEnd/src/config/global.config.js)

export const ROLES = {
  SUPER_ADMIN: 'super administrator',
  ADMIN: 'administrator',
  EDITOR: 'editor',
  AUTHOR: 'author',
  CONTRIBUTOR: 'contributor',
  SUBSCRIBER: 'subscriber'
} as const;

export const ALLOWED_ROLES = Object.values(ROLES);

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Administrador',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.AUTHOR]: 'Autor',
  [ROLES.CONTRIBUTOR]: 'Contribuidor',
  [ROLES.SUBSCRIBER]: 'Subscriptor'
};
