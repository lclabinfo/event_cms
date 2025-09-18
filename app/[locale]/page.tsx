"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('common');
  const tEvent = useTranslations('event');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('welcome')}</h1>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">{tEvent('worldMission')}</h2>
          <p className="mb-4">2024 World Mission Conference</p>
          <Link
            href="/events/world-mission-conference"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {tEvent('registration')}
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">{tEvent('missionaryRetreat')}</h2>
          <p className="mb-4">2024 Missionary Retreat Program</p>
          <Link
            href="/events/missionary-retreat"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {tEvent('registration')}
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">{tEvent('tourProgram')}</h2>
          <p className="mb-4">Israel Holy Land Tour 2024</p>
          <Link
            href="/events/tour-program"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {tEvent('registration')}
          </Link>
        </div>
      </div>
    </main>
  );
}