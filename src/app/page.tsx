// src/app/page.tsx
import { Suspense } from 'react';
import MainContent from './components/main-content';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading main content...</div>}>
      <MainContent />
    </Suspense>
  );
}