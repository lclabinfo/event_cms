"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('common');
  const tEvent = useTranslations('event');
  const tHero = useTranslations('hero');
  const tHome = useTranslations('home');

  return (
    <>
      {/* Hero Section - WMC Style */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {tHero('title')}
          </h1>
          <p className="text-2xl md:text-3xl mb-8 font-light">
            "{tHero('subtitle')}"
          </p>
          <p className="text-lg md:text-xl mb-2 opacity-90">
            {tHero('verse')}
          </p>
          <p className="text-lg md:text-xl mb-12 opacity-90">
            {tHero('dates')}
          </p>

          <div className="space-x-4">
            <Link
              href="/schedule"
              className="inline-block bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105"
            >
              {tHero('viewSchedule')}
            </Link>
            <button className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-800 transition-all transform hover:scale-105">
              {tHero('registerButton')} ({t('comingSoon')})
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Event Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">{tHome('programsTitle')}</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {tHome('programsSubtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-6xl">🌍</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{tEvent('worldMission')}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-line">
                  {tHome('worldMissionDesc')}
                </p>
                <Link
                  href="/schedule"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <span className="text-6xl">⛰️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{tEvent('missionaryRetreat')}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-line">
                  {tHome('missionaryDesc')}
                </p>
                <Link
                  href="/schedule"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">🗺️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{tEvent('tourProgram')}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-line">
                  {tHome('tourDesc')}
                </p>
                <Link
                  href="/schedule"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {tHome('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {tHome('ctaSubtitle')}
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105">
            {tHome('ctaButton')}
          </button>
        </div>
      </section>
    </>
  );
}