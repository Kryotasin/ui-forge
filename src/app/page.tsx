// src/app/page.tsx
import { Suspense } from 'react';
import MainContent from '@/app/components/MainContent';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading main content...</div>}>
asd
      <MainContent />
    </Suspense>
  );
}