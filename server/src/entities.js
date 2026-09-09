export const ENTITY_REGISTRY = {
  Profile: {
    table: 'profiles',
    sortDefault: '-created_at',
    ownerField: 'user_email',
    writableByOwner: true,
  },
  Connection: {
    table: 'connections',
    sortDefault: '-created_at',
    ownerFields: ['from_email', 'to_email'],
    writableByOwner: true,
  },
  Message: {
    table: 'messages',
    sortDefault: '-created_at',
    ownerFields: ['from_email', 'to_email'],
    writableByOwner: true,
  },
  FamilyTable: {
    table: 'family_tables',
    sortDefault: '-created_at',
    ownerField: 'family_email',
    writableByOwner: true,
  },
  TableRequest: {
    table: 'table_requests',
    sortDefault: '-created_at',
    ownerFields: ['family_email', 'requester_email'],
    writableByOwner: true,
  },
  NewsfeedPost: {
    table: 'newsfeed_posts',
    sortDefault: '-created_at',
    ownerField: 'author_email',
    writableByOwner: true,
  },
  Comment: {
    table: 'comments',
    sortDefault: '-created_at',
    ownerField: 'author_email',
    writableByOwner: true,
  },
  Report: {
    table: 'reports',
    sortDefault: '-created_at',
    ownerField: 'reporter_email',
    writableByOwner: true,
  },
  Block: {
    table: 'blocks',
    sortDefault: '-created_at',
    ownerField: 'blocker_email',
    writableByOwner: true,
  },
  Contact: {
    table: 'contacts',
    sortDefault: '-created_at',
    publicCreate: true,
    adminOnlyRead: true,
  },
  IdentityChangeRequest: {
    table: 'identity_change_requests',
    sortDefault: '-created_at',
    ownerField: 'user_email',
    writableByOwner: true,
  },
  User: {
    table: 'users',
    sortDefault: '-created_at',
    adminOnly: true,
  },
};

export function isAdmin(user) {
  return user?.role === 'admin' || user?.role === 'super_admin';
}

export function canReadEntity(entityName, user) {
  const config = ENTITY_REGISTRY[entityName];
  if (!config) return false;
  if (config.publicCreate && !user) return false;
  if (config.adminOnlyRead && !isAdmin(user)) return false;
  return Boolean(user);
}

export function canWriteEntity(entityName, user, record, email) {
  const config = ENTITY_REGISTRY[entityName];
  if (!config) return false;
  if (isAdmin(user)) return true;
  if (!user) return Boolean(config.publicCreate);

  if (config.adminOnly) return false;
  if (!config.writableByOwner) return false;

  if (config.ownerField) {
    const owner = record?.[config.ownerField] ?? email;
    return owner === user.email;
  }

  if (config.ownerFields) {
    const owner = record
      ? config.ownerFields.some((field) => record[field] === user.email)
      : true;
    return owner;
  }

  return false;
}

export function parseSort(sortField) {
  if (!sortField) return { column: 'created_at', direction: 'DESC' };
  if (sortField.startsWith('-')) {
    return { column: sortField.slice(1), direction: 'DESC' };
  }
  return { column: sortField, direction: 'ASC' };
}

export function rowToEntity(row) {
  if (!row) return null;
  const { created_at, updated_at, ...rest } = row;
  return {
    id: rest.id,
    ...rest,
    created_date: created_at,
    updated_date: updated_at,
  };
}
