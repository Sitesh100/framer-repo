'use client';

import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/search/SearchResults';

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  
  const type = searchParams.get('type') || 'bus';
  const from = searchParams.get('from') || 'Unknown';
  const to = searchParams.get('to') || 'Unknown';
  const date = searchParams.get('date') || 'Not specified';

  return (
    <div>
      <SearchResults />
    </div>
  );
}
