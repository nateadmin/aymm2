import { useEffect, useState } from 'react';
import {
  emitCommunityTableListingUpdated,
  loadCommunityTableListing,
  saveCommunityTableListing,
  subscribeCommunityTableListing,
} from '@/lib/communityTableListing';

export function useCommunityTableListing() {
  const [table, setTable] = useState(() => loadCommunityTableListing());

  useEffect(() => subscribeCommunityTableListing(setTable), []);

  const updateTable = (patch) => {
    const next = saveCommunityTableListing(patch);
    setTable(next);
    emitCommunityTableListingUpdated();
    return next;
  };

  return { table, updateTable };
}