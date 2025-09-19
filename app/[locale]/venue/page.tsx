"use client";

import { useTranslations } from 'next-intl';

export default function VenuePage() {
  const t = useTranslations('common');
  const tEvent = useTranslations('event');
  const tVenue = useTranslations('venuePage');

  const venues = [
    {
      name: tVenue('venues.kintex.name'),
      date: tVenue('venues.kintex.date'),
      event: tEvent('worldMission'),
      address: tVenue('venues.kintex.address'),
      description: tVenue('venues.kintex.description'),
      transportation: [
        tVenue('venues.kintex.transportation.subway'),
        tVenue('venues.kintex.transportation.airportBus'),
        tVenue('venues.kintex.transportation.parking')
      ],
      facilities: [
        tVenue('venues.kintex.facilities.hall'),
        tVenue('venues.kintex.facilities.breakout'),
        tVenue('venues.kintex.facilities.restaurant'),
        tVenue('venues.kintex.facilities.cafe'),
        tVenue('venues.kintex.facilities.wifi')
      ]
    },
    {
      name: tVenue('venues.alpensia.name'),
      date: tVenue('venues.alpensia.date'),
      event: tEvent('missionaryRetreat'),
      address: tVenue('venues.alpensia.address'),
      description: tVenue('venues.alpensia.description'),
      transportation: [
        tVenue('venues.alpensia.transportation.ktx'),
        tVenue('venues.alpensia.transportation.charter'),
        tVenue('venues.alpensia.transportation.car')
      ],
      facilities: [
        tVenue('venues.alpensia.facilities.conference'),
        tVenue('venues.alpensia.facilities.accommodation'),
        tVenue('venues.alpensia.facilities.restaurant'),
        tVenue('venues.alpensia.facilities.spa'),
        tVenue('venues.alpensia.facilities.golf'),
        tVenue('venues.alpensia.facilities.ski')
      ]
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{t('venue')}</h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        {tVenue('subtitle')}
      </p>

      <div className="max-w-5xl mx-auto space-y-8">
        {venues.map((venue, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🏢</span>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{venue.name}</h2>
                  <p className="text-blue-600 mt-1">{venue.event}</p>
                  <p className="text-sm text-gray-500 mt-1">{venue.date}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">{venue.description}</p>
                  <p className="text-sm text-gray-500 mt-2">📍 {venue.address}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">{tVenue('transportation')}</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {venue.transportation.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{tVenue('facilities')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.facilities.map((facility, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-yellow-50 rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-3">🚌 {tVenue('transportInfo.title')}</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• {tVenue('transportInfo.airport')}</li>
          <li>• {tVenue('transportInfo.shuttle')}</li>
          <li>• {tVenue('transportInfo.accommodation')}</li>
          <li>• {tVenue('transportInfo.details')}</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
          {tVenue('registerButton')}
        </button>
      </div>
    </main>
  );
}