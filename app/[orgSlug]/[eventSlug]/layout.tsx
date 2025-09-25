import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  children: React.ReactNode;
  params: {
    orgSlug: string;
    eventSlug: string;
  };
}

async function getEvent(orgSlug: string, eventSlug: string) {
  const event = await prisma.event.findFirst({
    where: {
      slug: eventSlug,
      organization: {
        slug: orgSlug
      }
    },
    include: {
      organization: true,
      menus: {
        where: {
          isVisible: true,
          parentId: null
        },
        orderBy: {
          order: 'asc'
        },
        include: {
          children: {
            where: {
              isVisible: true
            },
            orderBy: {
              order: 'asc'
            }
          },
          page: true
        }
      },
      customDomains: {
        where: {
          isPrimary: true,
          status: 'VERIFIED'
        }
      }
    }
  });

  return event;
}

function getLocalizedText(content: any, locale: string = 'ko'): string {
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null) {
    return content[locale] || content['ko'] || Object.values(content)[0] || '';
  }
  return '';
}

export default async function EventLayout({ children, params }: Props) {
  const event = await getEvent(params.orgSlug, params.eventSlug);

  if (!event) {
    notFound();
  }

  // Get locale from query params or default
  const headersList = headers();
  const customDomain = headersList.get('x-custom-domain');
  const searchParams = new URL(headersList.get('referer') || 'http://localhost').searchParams;
  const currentLocale = searchParams.get('locale') || event.defaultLocale || 'ko';

  // Build base URL for links
  const baseUrl = customDomain ? '' : `/${params.orgSlug}/${params.eventSlug}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Event Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              {event.organization.logo && (
                <img
                  className="h-8 w-auto"
                  src={event.organization.logo}
                  alt={event.organization.name}
                />
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {getLocalizedText(event.title, currentLocale)}
                </h1>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              {event.menus.map((menu) => {
                const hasChildren = menu.children && menu.children.length > 0;
                const menuTitle = getLocalizedText(menu.title, currentLocale);

                if (hasChildren) {
                  return (
                    <DropdownMenu key={menu.id}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center">
                          {menuTitle}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {menu.children.map((child) => {
                          const childTitle = getLocalizedText(child.title, currentLocale);
                          const href = child.pageId
                            ? `${baseUrl}/pages/${child.page?.slug}`
                            : child.url || '#';

                          return (
                            <DropdownMenuItem key={child.id} asChild>
                              <Link
                                href={href}
                                target={child.target || '_self'}
                              >
                                {childTitle}
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                const href = menu.pageId
                  ? `${baseUrl}/pages/${menu.page?.slug}`
                  : menu.url || baseUrl;

                return (
                  <Link
                    key={menu.id}
                    href={href}
                    target={menu.target || '_self'}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    {menuTitle}
                  </Link>
                );
              })}

              {/* Registration Button */}
              <Button asChild>
                <Link href={`${baseUrl}/register`}>
                  등록하기
                </Link>
              </Button>
            </nav>

            {/* Language Selector */}
            {event.isMultiLanguage && event.supportedLocales.length > 1 && (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {currentLocale.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {event.supportedLocales.map((locale) => (
                      <DropdownMenuItem key={locale} asChild>
                        <Link href={`${baseUrl}?locale=${locale}`}>
                          {locale === 'ko' ? '한국어' : locale === 'en' ? 'English' : locale.toUpperCase()}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden px-4 pb-2">
          <Button variant="outline" size="sm" className="w-full">
            메뉴
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} {event.organization.name}. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href={`${baseUrl}/privacy`} className="hover:text-gray-900">
                개인정보처리방침
              </Link>
              <Link href={`${baseUrl}/terms`} className="hover:text-gray-900">
                이용약관
              </Link>
              {event.organization.email && (
                <a href={`mailto:${event.organization.email}`} className="hover:text-gray-900">
                  문의하기
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}