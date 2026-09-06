'use client';

import React from 'react';
import { LuxuryStore } from '@/components/LuxuryStore';

export function LuxuryView() {
  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <LuxuryStore />
    </div>
  );
}
