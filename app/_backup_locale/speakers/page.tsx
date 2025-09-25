"use client";

import { useTranslations } from 'next-intl';

export default function SpeakersPage() {
  const t = useTranslations('common');
  const tSpeakers = useTranslations('speakersPage');

  const speakers = [
    {
      name: tSpeakers('speakers.kimJoseph.name'),
      title: tSpeakers('speakers.kimJoseph.title'),
      bio: tSpeakers('speakers.kimJoseph.bio'),
      topic: tSpeakers('speakers.kimJoseph.topic'),
      image: '/api/placeholder/200/200'
    },
    {
      name: tSpeakers('speakers.sarahAbraham.name'),
      title: tSpeakers('speakers.sarahAbraham.title'),
      bio: tSpeakers('speakers.sarahAbraham.bio'),
      topic: tSpeakers('speakers.sarahAbraham.topic'),
      image: '/api/placeholder/200/200'
    },
    {
      name: tSpeakers('speakers.leeSarah.name'),
      title: tSpeakers('speakers.leeSarah.title'),
      bio: tSpeakers('speakers.leeSarah.bio'),
      topic: tSpeakers('speakers.leeSarah.topic'),
      image: '/api/placeholder/200/200'
    },
    {
      name: tSpeakers('speakers.johnChang.name'),
      title: tSpeakers('speakers.johnChang.title'),
      bio: tSpeakers('speakers.johnChang.bio'),
      topic: tSpeakers('speakers.johnChang.topic'),
      image: '/api/placeholder/200/200'
    },
    {
      name: tSpeakers('speakers.parkMaria.name'),
      title: tSpeakers('speakers.parkMaria.title'),
      bio: tSpeakers('speakers.parkMaria.bio'),
      topic: tSpeakers('speakers.parkMaria.topic'),
      image: '/api/placeholder/200/200'
    },
    {
      name: tSpeakers('speakers.peterKim.name'),
      title: tSpeakers('speakers.peterKim.title'),
      bio: tSpeakers('speakers.peterKim.bio'),
      topic: tSpeakers('speakers.peterKim.topic'),
      image: '/api/placeholder/200/200'
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{t('speakers')}</h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        {tSpeakers('subtitle')}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {speakers.map((speaker, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-gray-500">👤</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
              <p className="text-blue-600 text-sm mb-3">{speaker.title}</p>
              <p className="text-gray-600 text-sm mb-4">{speaker.bio}</p>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {tSpeakers('speakingTopic')}
                </p>
                <p className="font-semibold text-gray-800">{speaker.topic}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">{tSpeakers('moreSpeakers')}</h2>
        <p className="text-gray-600 mb-6">
          {tSpeakers('moreSpeakersDesc')}
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
          {tSpeakers('getNotified')}
        </button>
      </div>
    </main>
  );
}