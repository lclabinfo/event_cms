import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function EventsPage() {
  const t = useTranslations('event');
  const tCommon = useTranslations('common');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-3">{t('worldMission')}</h2>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">{t('date')}:</span> 2024.08.01 - 08.05</p>
              <p><span className="font-medium">{t('location')}:</span> Seoul, Korea</p>
              <p><span className="font-medium">{t('price')}:</span> ₩300,000</p>
              <p><span className="font-medium">{t('capacity')}:</span> 500</p>
              <p><span className="font-medium">{t('remaining')}:</span> 127</p>
            </div>
            <Link
              href="/events/world-mission-conference"
              className="mt-4 block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('registration')}
            </Link>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-3">{t('missionaryRetreat')}</h2>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">{t('date')}:</span> 2024.07.15 - 07.20</p>
              <p><span className="font-medium">{t('location')}:</span> Jeju Island</p>
              <p><span className="font-medium">{t('price')}:</span> ₩250,000</p>
              <p><span className="font-medium">{t('capacity')}:</span> 200</p>
              <p><span className="font-medium">{t('remaining')}:</span> 43</p>
            </div>
            <Link
              href="/events/missionary-retreat"
              className="mt-4 block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('registration')}
            </Link>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-3">{t('tourProgram')}</h2>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">{t('date')}:</span> 2024.09.10 - 09.20</p>
              <p><span className="font-medium">{t('location')}:</span> Israel</p>
              <p><span className="font-medium">{t('price')}:</span> $2,500</p>
              <p><span className="font-medium">{t('capacity')}:</span> 50</p>
              <p><span className="font-medium">{t('remaining')}:</span> 12</p>
            </div>
            <Link
              href="/events/tour-program"
              className="mt-4 block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('registration')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}