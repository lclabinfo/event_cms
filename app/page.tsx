import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Globe, Shield, BarChart, Zap, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              이벤트 관리의 모든 것
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              다국어 지원, 커스텀 도메인, 실시간 등록 관리까지.
              하나의 플랫폼에서 모든 이벤트를 완벽하게 관리하세요.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/register">무료로 시작하기</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">데모 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              강력한 기능들
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              성공적인 이벤트 운영을 위한 모든 도구를 제공합니다
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>다국어 지원</CardTitle>
                <CardDescription>
                  글로벌 이벤트를 위한 완벽한 다국어 페이지 지원
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  각 이벤트마다 다양한 언어로 페이지를 제공하고, 참가자가 선호하는 언어로 등록할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>커스텀 도메인</CardTitle>
                <CardDescription>
                  브랜드에 맞는 고유한 도메인 사용
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  이벤트별로 독립된 도메인을 설정하고, SSL 인증서를 자동으로 관리합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>등록 관리</CardTitle>
                <CardDescription>
                  실시간 참가자 등록 및 관리
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  QR 코드 체크인, 실시간 등록 현황, 맞춤형 등록 양식을 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>프로그램 관리</CardTitle>
                <CardDescription>
                  세션 및 프로그램 일정 관리
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  복잡한 멀티트랙 프로그램도 쉽게 관리하고, 참가자별 맞춤 일정을 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>실시간 분석</CardTitle>
                <CardDescription>
                  데이터 기반 이벤트 인사이트
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  등록 추이, 참가자 분석, 수익 현황을 실시간으로 확인하세요.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>결제 통합</CardTitle>
                <CardDescription>
                  안전한 온라인 결제 처리
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  토스페이먼츠, 아임포트 등 국내 주요 PG사와 연동되어 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              합리적인 가격
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              규모에 맞는 플랜을 선택하세요
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>소규모 이벤트용</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₩0</span>
                  <span className="text-gray-600">/월</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li>✓ 이벤트 1개</li>
                  <li>✓ 참가자 50명</li>
                  <li>✓ 기본 기능</li>
                  <li>✓ 이메일 지원</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col border-primary">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>중규모 이벤트용</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₩49,000</span>
                  <span className="text-gray-600">/월</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li>✓ 이벤트 10개</li>
                  <li>✓ 참가자 1,000명</li>
                  <li>✓ 커스텀 도메인</li>
                  <li>✓ 우선 지원</li>
                  <li>✓ 고급 분석</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>대규모 이벤트용</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">맞춤 견적</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li>✓ 무제한 이벤트</li>
                  <li>✓ 무제한 참가자</li>
                  <li>✓ 전용 서버</li>
                  <li>✓ 전담 매니저</li>
                  <li>✓ API 접근</li>
                  <li>✓ SLA 보장</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              30일 무료 체험으로 모든 Pro 기능을 경험해보세요.
              신용카드 등록 없이 바로 시작할 수 있습니다.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/register">무료 체험 시작</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/contact">문의하기 →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © 2025 Event Platform. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                이용약관
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                개인정보처리방침
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center text-sm text-gray-400 hover:text-white"
                title="플랫폼 관리자"
              >
                <Settings className="h-4 w-4" />
                <span className="ml-1">관리자</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}