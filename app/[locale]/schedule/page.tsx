"use client";

import { useTranslations } from 'next-intl';

export default function SchedulePage() {
  const t = useTranslations('common');

  const schedule = [
    {
      date: '2026년 5월 17일 (일)',
      title: 'World Mission Congress',
      location: 'KINTEX',
      events: [
        { time: '09:00', description: '등록' },
        { time: '10:00', description: '개회예배' },
        { time: '11:00', description: '주제강연 1' },
        { time: '12:00', description: '점심식사' },
        { time: '14:00', description: '선교보고' },
        { time: '16:00', description: '주제강연 2' },
        { time: '18:00', description: '저녁식사' },
        { time: '19:30', description: '문화공연 및 폐회예배' }
      ]
    },
    {
      date: '2026년 5월 18-20일',
      title: 'Missionary & Shepherd Conference',
      location: 'Alpensia Resort',
      events: [
        { time: 'Day 1', description: '도착 및 등록' },
        { time: 'Day 2', description: '선교사 컨퍼런스 및 워크샵' },
        { time: 'Day 3', description: '목자 컨퍼런스 및 네트워킹' }
      ]
    },
    {
      date: '2026년 5월 20-21일',
      title: 'Tour Programs',
      location: '다양한 지역',
      events: [
        { time: 'Option A', description: '서울 역사문화 탐방' },
        { time: 'Option B', description: '경주 불교문화 탐방' },
        { time: 'Option C', description: 'DMZ 안보관광' }
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
        <p className="text-gray-600 mb-4">* 일정은 사정에 따라 변경될 수 있습니다</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
          지금 등록하기
        </button>
      </div>
    </main>
  );
}