"use client";

import { useTranslations } from 'next-intl';

export default function VenuePage() {
  const t = useTranslations('common');

  const venues = [
    {
      name: 'KINTEX (킨텍스)',
      date: '5월 17일',
      event: 'World Mission Congress',
      address: '경기도 고양시 일산서구 킨텍스로 217-60',
      description: '한국 최대 규모의 전시 컨벤션 센터로, 3,000명 이상 수용 가능한 대형 홀을 보유하고 있습니다.',
      transportation: [
        '지하철: 3호선 대화역 2번 출구 (도보 5분)',
        '공항버스: 인천공항에서 직행버스 운행 (1시간 소요)',
        '주차: 대형 주차장 완비 (유료)'
      ],
      facilities: ['대형 강당', '분임토의실', '식당', '카페', '무선 인터넷']
    },
    {
      name: 'Alpensia Resort (알펜시아 리조트)',
      date: '5월 18-20일',
      event: 'Missionary & Shepherd Conference',
      address: '강원도 평창군 대관령면 솔봉로 325',
      description: '2018 평창 동계올림픽이 개최된 곳으로, 아름다운 자연 속에서 영적 재충전의 시간을 가질 수 있습니다.',
      transportation: [
        'KTX: 서울역 → 진부역 (1시간 30분) + 셔틀버스',
        '전세버스: 서울에서 출발 (등록자에게 별도 안내)',
        '자가용: 서울에서 2시간 30분 소요'
      ],
      facilities: ['컨퍼런스 홀', '숙박시설', '레스토랑', '스파', '골프장', '스키장']
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{t('venue')}</h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        행사가 진행되는 장소 안내
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
                  <h3 className="font-semibold mb-2">교통편</h3>
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
                  <h3 className="font-semibold mb-2">시설</h3>
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
        <h2 className="text-lg font-semibold mb-3">🚌 교통 및 숙박 안내</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• 인천공항 ↔ KINTEX: 픽업 서비스 제공 (사전 신청 필수)</li>
          <li>• KINTEX → Alpensia: 전세버스 운행 (5/17 저녁)</li>
          <li>• 숙박: Alpensia Resort 단체 예약 (특별 할인가 적용)</li>
          <li>• 자세한 교통편은 등록 후 개별 안내 예정</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
          지금 등록하기
        </button>
      </div>
    </main>
  );
}