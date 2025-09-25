"use client";

import { useTranslations } from 'next-intl';

export default function SchedulePage() {
  const t = useTranslations('common');
  const tSchedule = useTranslations('schedulePage');
  const tEvent = useTranslations('event');

  const schedule = [
    {
      date: tSchedule('day1.date'),
      title: tEvent('worldMission'),
      location: 'KINTEX',
      events: [
        { time: '09:00', description: tSchedule('day1.events.registration') },
        { time: '10:00', description: tSchedule('day1.events.opening') },
        { time: '11:00', description: tSchedule('day1.events.lecture1') },
        { time: '12:00', description: tSchedule('day1.events.lunch') },
        { time: '14:00', description: tSchedule('day1.events.missionReport') },
        { time: '16:00', description: tSchedule('day1.events.lecture2') },
        { time: '18:00', description: tSchedule('day1.events.dinner') },
        { time: '19:30', description: tSchedule('day1.events.closing') }
      ]
    },
    {
      date: tSchedule('day2.date'),
      title: tEvent('missionaryRetreat'),
      location: 'Alpensia Resort',
      events: [
        { time: 'Day 1', description: tSchedule('day2.events.arrival') },
        { time: 'Day 2', description: tSchedule('day2.events.conference') },
        { time: 'Day 3', description: tSchedule('day2.events.shepherdConf') }
      ]
    },
    {
      date: tSchedule('day3.date'),
      title: tEvent('tourProgram'),
      location: tSchedule('day3.location', { defaultValue: '다양한 지역' }),
      events: [
        { time: 'Option A', description: tSchedule('day3.events.tourA') },
        { time: 'Option B', description: tSchedule('day3.events.tourB') },
        { time: 'Option C', description: tSchedule('day3.events.tourC') }
      ]
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('schedule')}</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {schedule.map((day, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold">{day.title}</h2>
              <p className="text-lg mt-2">{day.date}</p>
              <p className="text-sm mt-1 opacity-90">{day.location}</p>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="flex border-b pb-3 last:border-0">
                    <div className="font-semibold text-blue-600 w-32">
                      {event.time}
                    </div>
                    <div className="flex-1 text-gray-700">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">{tSchedule('disclaimer')}</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
          {t('registerNow')}
        </button>
      </div>
    </main>
  );
}