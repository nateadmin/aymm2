import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/entities';

export function useEntityList(entityName, filters = {}, options = {}) {
  const client = entities[entityName];
  const filterKey = JSON.stringify(filters);

  return useQuery({
    queryKey: [entityName, 'list', filterKey, options.sort, options.limit],
    queryFn: () => {
      if (!client) {
        throw new Error(`Unknown entity: ${entityName}`);
      }
      if (Object.keys(filters).length > 0) {
        return client.filter(filters, options.sort, options.limit);
      }
      return client.list(options.sort, options.limit);
    },
    enabled: options.enabled ?? true,
  });
}
