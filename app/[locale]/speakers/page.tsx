"use client";

import { useTranslations } from 'next-intl';

export default function SpeakersPage() {
  const t = useTranslations('common');

  const speakers = [
    {
      name: '김요셉 목사',
      title: 'UBF 국제대표',
      bio: '30년간 캠퍼스 선교에 헌신하며 전 세계 100개국 이상에 선교사를 파송한 경험이 있습니다.',
      topic: '세계선교의 비전과 도전',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Dr. Sarah Abraham',
      title: '시카고 UBF 대표',
      bio: '의료선교 전문가로서 아프리카와 아시아 지역에서 20년간 사역했습니다.',
      topic: '의료선교와 복음전도',
      image: '/api/placeholder/200/200'
    },
    {
      name: '이사라 선교사',
      title: '케냐 UBF 선교사',
      bio: '15년간 아프리카 대륙에서 현지인 리더십 개발에 집중해왔습니다.',
      topic: '현지인 리더십 개발',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Pastor John Chang',
      title: '독일 UBF 목사',
      bio: '유럽 난민 사역과 다문화 교회 개척의 선구자입니다.',
      topic: '유럽의 선교 현장',
      image: '/api/placeholder/200/200'
    },
    {
      name: '박마리아 선교사',
      title: '인도 UBF 선교사',
      bio: '힌두교 문화권에서의 복음 전파 전략을 개발했습니다.',
      topic: '힌두 문화권 선교 전략',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Dr. Peter Kim',
      title: '선교학 교수',
      bio: '선교 신학과 실천에 관한 다수의 저서를 출간했습니다.',
      topic: '21세기 선교 패러다임',
      image: '/api/placeholder/200/200'
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{t('speakers')}</h1>
      <p className="text-lg text-gray-600 text-center mb-12">
        세계 각지에서 활동하는 선교 전문가들을 만나보세요
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
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">강연 주제</p>
                <p className="font-semibold text-gray-800">{speaker.topic}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">더 많은 강연자가 곧 공개됩니다!</h2>
        <p className="text-gray-600 mb-6">
          전 세계에서 활동하는 선교사들과 전문가들이 함께합니다
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
          등록하고 알림 받기
        </button>
      </div>
    </main>
  );
}