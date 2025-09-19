# 🎨 Multi-Tenant Event Platform - Page Structure Design

## 🎯 Overview
Multi-tenant SaaS 이벤트 플랫폼의 완벽한 페이지 구조 및 라우팅 설계입니다.

**언어 지원**: 한국어(기본), 영어, 스페인어 - 공개 행사 페이지 전체 다국어 지원  
**URL 구조**: `/[event]/[lang]` - 깔끔한 URL, 도메인으로 컨텍스트 구분  
**다층 도메인**: 플랫폼 → 기관 → 이벤트별 커스텀 도메인 완벽 지원  
**프리미엄 브랜딩**: `wmc2026.com` 같은 이벤트 전용 도메인까지 지원

## 📋 Table of Contents
1. [URL Architecture](#url-architecture)
2. [Super Admin Pages](#super-admin-pages)
3. [Organization Admin Pages](#organization-admin-pages)
4. [Participant Portal](#participant-portal)
5. [Public Event Pages](#public-event-pages)
6. [Component Structure](#component-structure)

---

## URL Architecture

### Domain Structure
```yaml
# 플랫폼 메인 도메인
platform_domain: events.platform.com

# 다층 도메인 시스템 (Multi-level Custom Domain)

# Level 1: 플랫폼 기본 도메인
platform: events.platform.com

# Level 2: 기관별 도메인
org_subdomain: {org-slug}.events.platform.com      # 기본
org_custom: events.seoul-ubf.org                   # 기관 커스텀

# Level 3: 이벤트별 도메인  
event_subdomain: {event-slug}.seoul-ubf.org        # 이벤트 서브도메인
event_custom: wmc2026.com                          # 이벤트 전용 도메인

# 모든 도메인에서 동일한 기능 제공:
# - 자동 SSL 인증서
# - DNS 자동 검증  
# - 도메인별 브랜딩
# - 리다이렉트 설정
```

### Routing Structure
```typescript
// Next.js App Router 구조 (서브도메인 기반)
/app/
├── platform-admin/        // 수퍼 어드민 (플랫폼 운영자)
├── admin/                 // 기관 관리자
├── my/                    // 참가자 포털  
├── [event]/               // 공개 행사 페이지
│   ├── page.tsx          // 기본 언어 (한국어)
│   ├── register/         // 등록 페이지
│   ├── schedule/         // 일정 페이지
│   └── [lang]/           // 다른 언어들 (en, es)
│       ├── page.tsx
│       ├── register/
│       └── schedule/
├── auth/                  // 인증 페이지
├── api/                   // API 엔드포인트
│   ├── i18n/             // 번역 관련 API
│   └── [...other]        // 기타 API
└── (marketing)/          // 플랫폼 마케팅 페이지

// 다층 도메인 시스템 URL 예시

// Level 1: 플랫폼 기본 (개발/테스트용)
events.platform.com/seoul-ubf/wmc-2026        // 기본 (한국어)
events.platform.com/seoul-ubf/wmc-2026/en     // 영어

// Level 2: 기관별 도메인
seoul-ubf.events.platform.com/wmc-2026        // 기관 서브도메인
seoul-ubf.events.platform.com/wmc-2026/en     // 영어  
events.seoul-ubf.org/wmc-2026                 // 기관 커스텀 도메인
events.seoul-ubf.org/wmc-2026/en              // 영어

// Level 3: 이벤트별 도메인 (최고급)
wmc2026.seoul-ubf.org/                         // 이벤트 서브도메인
wmc2026.seoul-ubf.org/en                       // 영어
wmc2026.com/                                   // 이벤트 전용 도메인
wmc2026.com/en                                 // 영어

// 고급 도메인 미들웨어
middleware: {
  domainDetection: {
    platform: "events.platform.com → 개발/관리용",
    orgSubdomain: "{org}.events.platform.com → 기관 추출",
    orgCustom: "events.{org}.org → CustomDomain DB에서 기관 조회",
    eventCustom: "{any-domain}.com → CustomDomain DB에서 이벤트 조회"
  },
  contextInjection: {
    organization: "모든 페이지에 기관 정보 주입",
    event: "이벤트 도메인인 경우 이벤트 정보 직접 로드",
    branding: "도메인별 브랜딩 설정 적용"
  },
  sslAndRedirects: {
    forceHttps: "HTTPS 자동 리다이렉트",
    canonicalUrl: "중복 도메인 canonical 처리",
    wwwRedirect: "www → non-www 리다이렉트"
  }
}

// 다층 도메인 시스템의 혁신적 장점
advantages: {
  ultimate_flexibility: "기관과 이벤트 모두 독립적인 브랜딩 가능",
  seo_powerhouse: "이벤트별 전용 도메인으로 최강 SEO",
  premium_experience: "wmc2026.com 같은 프리미엄 도메인 경험",
  white_label_complete: "완전한 화이트라벨 - 플랫폼 흔적 제로",
  marketing_friendly: "기억하기 쉬운 도메인으로 마케팅 효과 극대화",
  enterprise_ready: "대기업급 이벤트도 자체 브랜드로 운영",
  multi_event_support: "한 기관이 여러 이벤트별 도메인 운영",
  global_expansion: "국가별 도메인도 자연스럽게 지원"
}
```

---

## Super Admin Pages
플랫폼 운영자(판매자)를 위한 관리 페이지입니다.

### 1. Dashboard
**Path**: `/platform-admin`

```typescript
interface SuperAdminDashboard {
  layout: "sidebar-layout",
  sections: {
    header: {
      title: "Platform Admin Dashboard",
      userMenu: ["profile", "settings", "logout"]
    },
    metrics: [
      {
        title: "Total Organizations",
        value: "dynamicCount",
        change: "+12% from last month",
        icon: "Building"
      },
      {
        title: "Active Subscriptions",
        value: "dynamicCount",
        change: "+8% from last month",
        icon: "CreditCard"
      },
      {
        title: "Monthly Revenue",
        value: "dynamicAmount",
        change: "+15% from last month",
        icon: "TrendingUp"
      },
      {
        title: "Total Events",
        value: "dynamicCount",
        change: "+23% from last month",
        icon: "Calendar"
      }
    ],
    charts: {
      revenueChart: {
        type: "line",
        title: "Revenue Trend",
        period: ["daily", "weekly", "monthly"]
      },
      organizationGrowth: {
        type: "bar",
        title: "New Organizations",
        period: "last_12_months"
      },
      planDistribution: {
        type: "pie",
        title: "Subscription Plans",
        segments: ["free", "basic", "pro", "enterprise"]
      }
    },
    recentActivity: {
      title: "Recent Activity",
      items: [
        "New organization registered",
        "Subscription upgraded",
        "Payment received",
        "Support ticket resolved"
      ]
    }
  }
}
```

### 2. Organizations Management
**Path**: `/platform-admin/organizations`

```typescript
interface OrganizationsPage {
  list: {
    path: "/platform-admin/organizations",
    features: {
      search: {
        fields: ["name", "email", "domain"]
      },
      filters: [
        {
          key: "status",
          options: ["active", "trial", "suspended", "cancelled"]
        },
        {
          key: "plan",
          options: ["free", "basic", "pro", "enterprise"]
        },
        {
          key: "created",
          type: "date_range"
        }
      ],
      sorting: [
        "name",
        "created_date",
        "revenue",
        "events_count",
        "participants_count"
      ],
      bulkActions: [
        "export",
        "send_email",
        "suspend",
        "activate"
      ]
    },
    columns: [
      "organization_name",
      "owner",
      "plan",
      "status",
      "events",
      "participants",
      "revenue",
      "created_date",
      "actions"
    ]
  },

  detail: {
    path: "/platform-admin/organizations/[id]",
    tabs: [
      {
        id: "overview",
        sections: [
          "basic_info",
          "subscription_details",
          "usage_statistics",
          "recent_activity"
        ]
      },
      {
        id: "subscription",
        sections: [
          "current_plan",
          "billing_history",
          "payment_methods",
          "invoices"
        ]
      },
      {
        id: "events",
        sections: [
          "active_events",
          "past_events",
          "event_statistics"
        ]
      },
      {
        id: "users",
        sections: [
          "admins",
          "staff",
          "user_activity"
        ]
      },
      {
        id: "settings",
        sections: [
          "features_toggle",
          "limits_configuration",
          "custom_domain",
          "api_access"
        ]
      }
    ],
    actions: [
      "edit_info",
      "change_plan",
      "suspend_account",
      "login_as_org",
      "send_notification",
      "generate_invoice"
    ]
  },

  create: {
    path: "/platform-admin/organizations/create",
    steps: [
      {
        title: "Organization Info",
        fields: ["name", "slug", "email", "phone", "address"]
      },
      {
        title: "Owner Account",
        fields: ["owner_name", "owner_email", "owner_phone"]
      },
      {
        title: "Subscription Plan",
        fields: ["plan", "billing_cycle", "trial_period"]
      },
      {
        title: "Initial Setup",
        fields: ["timezone", "locale", "features"]
      }
    ]
  }
}
```

### 3. Subscriptions & Billing
**Path**: `/platform-admin/subscriptions`

```typescript
interface SubscriptionsPage {
  overview: {
    metrics: [
      "MRR", // Monthly Recurring Revenue
      "ARR", // Annual Recurring Revenue
      "ARPU", // Average Revenue Per User
      "Churn Rate",
      "LTV" // Lifetime Value
    ],
    charts: {
      revenueByPlan: "stacked_bar",
      churnAnalysis: "line",
      paymentStatus: "donut"
    }
  },

  billing: {
    path: "/platform-admin/subscriptions/billing",
    features: {
      filters: ["status", "due_date", "amount_range"],
      actions: [
        "generate_invoice",
        "send_reminder",
        "process_payment",
        "mark_as_paid"
      ]
    },
    list: {
      columns: [
        "organization",
        "invoice_number",
        "amount",
        "due_date",
        "status",
        "actions"
      ]
    }
  },

  invoices: {
    path: "/platform-admin/subscriptions/invoices",
    features: {
      generate: {
        types: ["tax_invoice", "receipt", "estimate"],
        bulk: true
      },
      export: ["pdf", "excel", "csv"]
    }
  }
}
```

### 4. Analytics
**Path**: `/platform-admin/analytics`

```typescript
interface AnalyticsPage {
  revenue: {
    path: "/platform-admin/analytics/revenue",
    dashboards: [
      {
        title: "Revenue Overview",
        widgets: [
          "total_revenue",
          "revenue_by_plan",
          "revenue_by_organization",
          "payment_methods",
          "failed_payments"
        ]
      },
      {
        title: "Growth Analysis",
        widgets: [
          "growth_rate",
          "cohort_analysis",
          "retention_rate",
          "expansion_revenue"
        ]
      }
    ]
  },

  usage: {
    path: "/platform-admin/analytics/usage",
    metrics: [
      "active_organizations",
      "total_events",
      "total_registrations",
      "average_event_size",
      "feature_adoption"
    ],
    reports: [
      "usage_by_plan",
      "peak_usage_times",
      "api_usage",
      "storage_usage"
    ]
  },

  performance: {
    path: "/platform-admin/analytics/performance",
    monitors: [
      "response_time",
      "error_rate",
      "uptime",
      "api_latency"
    ]
  }
}
```

### 5. Settings
**Path**: `/platform-admin/settings`

```typescript
interface PlatformSettings {
  plans: {
    path: "/platform-admin/settings/plans",
    management: {
      create: {
        fields: ["name", "price", "billing_cycle", "features", "limits"]
      },
      edit: {
        restrictions: ["cannot_reduce_limits_for_active_users"]
      },
      archive: {
        condition: "no_active_subscriptions"
      }
    }
  },

  features: {
    path: "/platform-admin/settings/features",
    flags: [
      {
        key: "custom_domain",
        scope: ["plan", "organization"],
        default: false
      },
      {
        key: "api_access",
        scope: ["plan", "organization"],
        default: false
      },
      {
        key: "white_label",
        scope: ["enterprise_only"],
        default: false
      }
    ]
  },

  integrations: {
    path: "/platform-admin/settings/integrations",
    services: [
      "payment_gateways",
      "email_providers",
      "sms_providers",
      "analytics_tools",
      "crm_systems"
    ]
  }
}
```

---

## Organization Admin Pages
기관 관리자(구매자)를 위한 관리 페이지입니다.

### 1. Organization Dashboard
**Path**: `/admin` (서브도메인에서 기관 구분)

```typescript
interface OrgAdminDashboard {
  layout: "org-admin-layout",
  widgets: [
    {
      type: "stats_card",
      title: "Active Events",
      value: "dynamicCount",
      link: "/admin/events?status=active"
    },
    {
      type: "stats_card",
      title: "Total Registrations",
      value: "dynamicCount",
      trend: "+15% this month"
    },
    {
      type: "stats_card",
      title: "Revenue This Month",
      value: "dynamicAmount",
      currency: "KRW"
    },
    {
      type: "stats_card",
      title: "Pending Approvals",
      value: "dynamicCount",
      urgency: "high"
    }
  ],

  sections: {
    upcomingEvents: {
      title: "Upcoming Events",
      limit: 5,
      columns: ["title", "date", "registrations", "status"],
      actions: ["view", "edit", "duplicate"]
    },
    recentRegistrations: {
      title: "Recent Registrations",
      limit: 10,
      columns: ["name", "event", "amount", "status", "date"],
      actions: ["view", "approve", "contact"]
    },
    quickActions: {
      title: "Quick Actions",
      buttons: [
        "Create Event",
        "View Reports",
        "Send Email",
        "Export Data"
      ]
    }
  }
}
```

### 2. Events Management
**Path**: `/admin/events` (서브도메인에서 기관 구분)

```typescript
interface EventsManagement {
  list: {
    path: "/admin/events",
    views: {
      table: {
        columns: [
          "title",
          "date",
          "venue",
          "registrations",
          "revenue",
          "status",
          "actions"
        ]
      },
      calendar: {
        display: ["month", "week", "agenda"],
        colorCoding: "by_status"
      },
      kanban: {
        columns: ["draft", "published", "ongoing", "completed"],
        dragDrop: true
      }
    },
    filters: [
      "status",
      "date_range",
      "venue_type",
      "registration_status"
    ],
    actions: [
      "create",
      "duplicate",
      "archive",
      "export"
    ]
  },

  create: {
    path: "/admin/events/create",
    wizard: {
      steps: [
        {
          id: "basic_info",
          title: "Event Information",
          fields: [
            "title",
            "slug",
            "description",
            "tags",
            "visibility"
          ]
        },
        {
          id: "schedule",
          title: "Schedule & Venue",
          fields: [
            "start_date",
            "end_date",
            "registration_period",
            "venue",
            "online_url"
          ]
        },
        {
          id: "pricing",
          title: "Pricing & Capacity",
          fields: [
            "base_price",
            "early_bird",
            "max_participants",
            "payment_methods"
          ]
        },
        {
          id: "registration_form",
          title: "Registration Form",
          features: [
            "form_builder",
            "custom_fields",
            "conditional_logic",
            "validation_rules"
          ]
        },
        {
          id: "programs",
          title: "Programs & Sessions",
          features: [
            "add_programs",
            "schedule_sessions",
            "capacity_limits",
            "pricing_tiers"
          ]
        },
        {
          id: "communication",
          title: "Email Settings",
          templates: [
            "confirmation_email",
            "reminder_email",
            "payment_success",
            "cancellation"
          ]
        },
        {
          id: "review",
          title: "Review & Publish",
          actions: [
            "preview",
            "save_draft",
            "publish_now",
            "schedule_publish"
          ]
        }
      ]
    }
  },

  detail: {
    path: "/admin/events/[id]",
    tabs: [
      {
        id: "overview",
        components: [
          "EventSummary",
          "RegistrationChart",
          "RevenueMetrics",
          "QuickActions"
        ]
      },
      {
        id: "registrations",
        features: [
          "search_filter",
          "bulk_actions",
          "export",
          "check_in",
          "send_emails"
        ]
      },
      {
        id: "programs",
        management: [
          "add_program",
          "edit_schedule",
          "manage_capacity",
          "waitlist"
        ]
      },
      {
        id: "payments",
        features: [
          "transaction_list",
          "refund_processing",
          "payment_reports",
          "reconciliation"
        ]
      },
      {
        id: "emails",
        features: [
          "template_editor",
          "send_broadcast",
          "automation_rules",
          "delivery_stats"
        ]
      },
      {
        id: "analytics",
        reports: [
          "registration_funnel",
          "revenue_breakdown",
          "attendance_tracking",
          "feedback_analysis"
        ]
      },
      {
        id: "settings",
        options: [
          "basic_info",
          "registration_form",
          "payment_settings",
          "access_control"
        ]
      }
    ]
  }
}
```

### 3. Registrations Management
**Path**: `/admin/registrations` (서브도메인에서 기관 구분)

```typescript
interface RegistrationsManagement {
  dashboard: {
    path: "/[org]/admin/registrations",
    metrics: [
      "total_registrations",
      "pending_approval",
      "confirmed",
      "cancelled",
      "revenue_collected"
    ],
    charts: {
      registrationTrend: "line",
      statusDistribution: "donut",
      revenueByEvent: "bar"
    }
  },

  list: {
    path: "/[org]/admin/registrations/list",
    features: {
      search: {
        fields: ["name", "email", "phone", "registration_number"]
      },
      filters: [
        "event",
        "status",
        "payment_status",
        "date_range",
        "program"
      ],
      bulkActions: [
        "approve",
        "reject",
        "send_email",
        "export",
        "change_status",
        "assign_program"
      ],
      individualActions: [
        "view_detail",
        "edit",
        "send_ticket",
        "process_refund",
        "add_note"
      ]
    },
    columns: [
      "checkbox",
      "registration_number",
      "participant_name",
      "event",
      "programs",
      "amount",
      "payment_status",
      "registration_status",
      "registered_date",
      "actions"
    ]
  },

  detail: {
    path: "/[org]/admin/registrations/[id]",
    sections: [
      {
        title: "Registration Information",
        fields: [
          "registration_number",
          "type",
          "status",
          "created_date"
        ]
      },
      {
        title: "Participant Details",
        fields: [
          "name",
          "email",
          "phone",
          "organization",
          "custom_fields"
        ]
      },
      {
        title: "Payment Information",
        fields: [
          "amount",
          "payment_method",
          "payment_status",
          "transaction_id"
        ]
      },
      {
        title: "Programs",
        table: [
          "program_name",
          "schedule",
          "status",
          "attendance"
        ]
      },
      {
        title: "Activity Log",
        timeline: [
          "registration_created",
          "payment_received",
          "email_sent",
          "checked_in"
        ]
      }
    ],
    actions: [
      "edit_registration",
      "send_confirmation",
      "generate_ticket",
      "process_refund",
      "check_in",
      "add_internal_note"
    ]
  }
}
```

### 4. Payments Management
**Path**: `/[org]/admin/payments`

```typescript
interface PaymentsManagement {
  overview: {
    path: "/[org]/admin/payments",
    metrics: [
      {
        title: "Total Revenue",
        value: "sum_amount",
        period: "this_month"
      },
      {
        title: "Pending Payments",
        value: "count",
        filter: "status=pending"
      },
      {
        title: "Failed Payments",
        value: "count",
        filter: "status=failed"
      },
      {
        title: "Refunds Processed",
        value: "sum_amount",
        filter: "type=refund"
      }
    ],
    charts: {
      dailyRevenue: {
        type: "area",
        period: "last_30_days"
      },
      paymentMethods: {
        type: "pie",
        segments: ["card", "bank_transfer", "virtual_account"]
      },
      successRate: {
        type: "gauge",
        calculation: "completed/total"
      }
    }
  },

  transactions: {
    path: "/[org]/admin/payments/transactions",
    list: {
      columns: [
        "transaction_id",
        "registration",
        "participant",
        "amount",
        "method",
        "provider",
        "status",
        "date",
        "actions"
      ],
      filters: [
        "status",
        "method",
        "date_range",
        "amount_range",
        "event"
      ],
      actions: [
        "view_detail",
        "download_receipt",
        "process_refund",
        "retry_payment",
        "view_in_provider"
      ]
    }
  },

  refunds: {
    path: "/[org]/admin/payments/refunds",
    process: {
      steps: [
        "select_transaction",
        "enter_reason",
        "confirm_amount",
        "process_refund",
        "send_notification"
      ],
      policies: [
        "full_refund_before_7_days",
        "partial_refund_before_3_days",
        "no_refund_after_event_start"
      ]
    },
    list: {
      columns: [
        "refund_id",
        "original_transaction",
        "amount",
        "reason",
        "status",
        "processed_date",
        "processed_by"
      ]
    }
  },

  reports: {
    path: "/[org]/admin/payments/reports",
    types: [
      {
        id: "revenue_report",
        filters: ["date_range", "event", "payment_method"],
        export: ["pdf", "excel", "csv"]
      },
      {
        id: "reconciliation",
        features: ["match_with_bank", "identify_discrepancies"]
      },
      {
        id: "tax_report",
        compliance: ["generate_tax_invoice", "vat_summary"]
      }
    ]
  }
}
```

### 5. Team Management
**Path**: `/[org]/admin/team`

```typescript
interface TeamManagement {
  members: {
    path: "/[org]/admin/team/members",
    list: {
      columns: [
        "name",
        "email",
        "role",
        "status",
        "last_login",
        "joined_date",
        "actions"
      ],
      actions: [
        "invite_member",
        "edit_role",
        "reset_password",
        "deactivate",
        "remove"
      ]
    },

    invite: {
      path: "/[org]/admin/team/invite",
      form: {
        fields: [
          "email",
          "name",
          "role",
          "permissions",
          "welcome_message"
        ],
        bulkInvite: {
          enabled: true,
          format: "csv_upload"
        }
      }
    }
  },

  roles: {
    path: "/[org]/admin/team/roles",
    predefined: [
      {
        id: "org_admin",
        name: "Organization Admin",
        permissions: "all"
      },
      {
        id: "event_manager",
        name: "Event Manager",
        permissions: ["events", "registrations", "reports"]
      },
      {
        id: "finance_manager",
        name: "Finance Manager",
        permissions: ["payments", "refunds", "reports"]
      },
      {
        id: "support_staff",
        name: "Support Staff",
        permissions: ["registrations.view", "participants.contact"]
      }
    ],
    customRoles: {
      enabled: true,
      maxCustomRoles: 10
    }
  },

  permissions: {
    path: "/[org]/admin/team/permissions",
    modules: {
      events: [
        "create",
        "edit",
        "delete",
        "publish",
        "duplicate"
      ],
      registrations: [
        "view",
        "approve",
        "reject",
        "edit",
        "export"
      ],
      payments: [
        "view",
        "process",
        "refund",
        "export"
      ],
      team: [
        "invite",
        "edit",
        "remove"
      ],
      settings: [
        "view",
        "edit"
      ]
    }
  }
}
```

### 6. Organization Settings
**Path**: `/[org]/admin/settings`

```typescript
interface OrgSettings {
  general: {
    path: "/[org]/admin/settings/general",
    sections: [
      {
        title: "Organization Information",
        fields: [
          "name",
          "slug",
          "description",
          "email",
          "phone",
          "address"
        ]
      },
      {
        title: "Localization",
        fields: [
          "timezone",
          "locale",
          "currency",
          "date_format"
        ]
      }
    ]
  },

  branding: {
    path: "/[org]/admin/settings/branding",
    customization: {
      logo: {
        format: ["png", "jpg", "svg"],
        maxSize: "2MB",
        dimensions: "recommended 200x50"
      },
      colors: {
        primary: "color_picker",
        secondary: "color_picker",
        accent: "color_picker"
      },
      fonts: {
        heading: "font_selector",
        body: "font_selector"
      },
      customCSS: {
        enabled: "pro_plan_only",
        editor: "code_editor"
      }
    }
  },

  payment: {
    path: "/[org]/admin/settings/payment",
    providers: [
      {
        id: "toss",
        name: "TossPayments",
        fields: [
          "client_key",
          "secret_key",
          "webhook_endpoint"
        ],
        testMode: true
      },
      {
        id: "portone",
        name: "PortOne",
        fields: [
          "imp_key",
          "imp_secret",
          "merchant_uid"
        ]
      }
    ],
    bankAccount: {
      fields: [
        "bank_name",
        "account_number",
        "account_holder"
      ]
    }
  },

  domain: {
    path: "/[org]/admin/settings/domain",
    custom: {
      requirements: "pro_plan_or_above",
      steps: [
        "enter_domain",
        "add_cname_record",
        "verify_dns",
        "provision_ssl"
      ],
      status: {
        verification: "pending|verified|failed",
        ssl: "pending|active|expired"
      }
    }
  },

  forms: {
    path: "/[org]/admin/settings/forms",
    builder: {
      fieldTypes: [
        "text",
        "email",
        "phone",
        "number",
        "select",
        "checkbox",
        "radio",
        "date",
        "file",
        "textarea"
      ],
      features: [
        "drag_drop",
        "conditional_logic",
        "validation_rules",
        "multi_language"
      ],
      templates: [
        "basic_registration",
        "detailed_registration",
        "group_registration",
        "workshop_registration"
      ]
    }
  },

  emails: {
    path: "/[org]/admin/settings/emails",
    templates: {
      system: [
        "registration_confirmation",
        "payment_success",
        "payment_failed",
        "event_reminder",
        "cancellation_notice"
      ],
      custom: {
        maxTemplates: 20,
        editor: "rich_text_with_variables"
      },
      variables: [
        "{{participant_name}}",
        "{{event_title}}",
        "{{event_date}}",
        "{{registration_number}}",
        "{{amount}}",
        "{{qr_code}}"
      ]
    },
    settings: {
      sender: {
        name: "organization_name",
        email: "noreply@domain.com",
        replyTo: "support@domain.com"
      },
      footer: {
        unsubscribe: true,
        address: true,
        social_links: true
      }
    }
  }
}
```

---

## Participant Portal
참가자를 위한 개인 포털 페이지입니다.

### 1. Participant Dashboard
**Path**: `/[org]/my`

```typescript
interface ParticipantDashboard {
  layout: "participant-layout",
  sections: {
    welcome: {
      greeting: "Hello, {{name}}",
      quickStats: [
        "upcoming_events",
        "completed_events",
        "total_spent"
      ]
    },

    upcomingEvents: {
      title: "Your Upcoming Events",
      cards: {
        display: "event_card",
        information: [
          "event_title",
          "date_time",
          "venue",
          "registration_status",
          "payment_status"
        ],
        actions: [
          "view_details",
          "download_ticket",
          "add_to_calendar"
        ]
      }
    },

    recentActivity: {
      title: "Recent Activity",
      timeline: [
        "registration_confirmed",
        "payment_processed",
        "ticket_downloaded",
        "reminder_sent"
      ]
    },

    quickActions: {
      buttons: [
        "Browse Events",
        "View Tickets",
        "Payment History",
        "Update Profile"
      ]
    }
  }
}
```

### 2. My Registrations
**Path**: `/[org]/my/registrations`

```typescript
interface MyRegistrations {
  tabs: [
    {
      id: "upcoming",
      title: "Upcoming Events",
      filter: "event_date >= today",
      cards: {
        fields: [
          "event_banner",
          "event_title",
          "date_time",
          "venue",
          "programs_enrolled",
          "amount_paid",
          "registration_number"
        ],
        actions: [
          "view_event",
          "download_ticket",
          "cancel_registration"
        ],
        badges: [
          "confirmed",
          "payment_pending",
          "early_bird"
        ]
      }
    },
    {
      id: "past",
      title: "Past Events",
      filter: "event_date < today",
      cards: {
        fields: [
          "event_title",
          "date",
          "attended_status"
        ],
        actions: [
          "download_certificate",
          "view_photos",
          "give_feedback"
        ]
      }
    },
    {
      id: "cancelled",
      title: "Cancelled",
      filter: "status = cancelled",
      information: [
        "cancellation_date",
        "refund_status",
        "refund_amount"
      ]
    }
  ],

  detail: {
    path: "/[org]/my/registrations/[id]",
    sections: [
      {
        title: "Registration Details",
        fields: [
          "registration_number",
          "registered_date",
          "status"
        ]
      },
      {
        title: "Event Information",
        fields: [
          "event_title",
          "date_time",
          "venue",
          "description"
        ]
      },
      {
        title: "Your Programs",
        table: [
          "program_name",
          "schedule",
          "location",
          "status"
        ]
      },
      {
        title: "Payment Summary",
        fields: [
          "base_amount",
          "discount",
          "total_paid",
          "payment_method",
          "payment_date"
        ]
      },
      {
        title: "Your Ticket",
        features: [
          "qr_code_display",
          "download_pdf",
          "add_to_wallet"
        ]
      }
    ],
    actions: [
      "download_ticket",
      "request_invoice",
      "cancel_registration",
      "contact_organizer"
    ]
  }
}
```

### 3. Payment History
**Path**: `/[org]/my/payments`

```typescript
interface PaymentHistory {
  summary: {
    cards: [
      {
        title: "Total Spent",
        value: "sum_all_payments",
        period: "all_time"
      },
      {
        title: "This Year",
        value: "sum_year_payments",
        period: "current_year"
      },
      {
        title: "Pending Payments",
        value: "sum_pending",
        urgency: "high"
      }
    ]
  },

  list: {
    columns: [
      "date",
      "event",
      "amount",
      "method",
      "status",
      "receipt"
    ],
    filters: [
      "date_range",
      "status",
      "payment_method"
    ],
    actions: [
      "download_receipt",
      "request_invoice",
      "view_details"
    ]
  },

  detail: {
    path: "/[org]/my/payments/[id]",
    information: [
      "transaction_id",
      "payment_date",
      "amount",
      "method",
      "card_last_4",
      "status",
      "receipt_url"
    ],
    relatedInfo: [
      "event_details",
      "registration_info"
    ]
  }
}
```

### 4. Certificates
**Path**: `/[org]/my/certificates`

```typescript
interface Certificates {
  types: [
    {
      id: "participation",
      title: "Certificate of Participation",
      eligibility: "attended_event"
    },
    {
      id: "completion",
      title: "Certificate of Completion",
      eligibility: "completed_all_programs"
    }
  ],

  list: {
    display: "grid",
    card: {
      preview: "certificate_thumbnail",
      information: [
        "event_title",
        "issue_date",
        "certificate_number"
      ],
      actions: [
        "preview",
        "download_pdf",
        "share",
        "verify"
      ]
    }
  },

  verification: {
    path: "/[org]/certificates/verify/[number]",
    publicAccess: true,
    display: [
      "certificate_details",
      "participant_name",
      "event_information",
      "issue_date",
      "verification_status"
    ]
  }
}
```

### 5. Profile Settings
**Path**: `/[org]/my/profile`

```typescript
interface ProfileSettings {
  sections: [
    {
      id: "personal_info",
      title: "Personal Information",
      fields: [
        "first_name",
        "last_name",
        "email",
        "phone",
        "birth_date",
        "gender"
      ]
    },
    {
      id: "organization_info",
      title: "Organization",
      fields: [
        "company",
        "position",
        "department"
      ]
    },
    {
      id: "preferences",
      title: "Preferences",
      fields: [
        "language",
        "communication_preference",
        "dietary_restrictions",
        "accessibility_needs"
      ]
    },
    {
      id: "notifications",
      title: "Notification Settings",
      options: [
        "email_notifications",
        "sms_notifications",
        "event_reminders",
        "payment_alerts",
        "newsletter"
      ]
    },
    {
      id: "security",
      title: "Security",
      features: [
        "change_password",
        "two_factor_auth",
        "login_history",
        "connected_devices"
      ]
    }
  ]
}
```

---

## Public Event Pages
일반 대중이 접근하는 공개 행사 페이지입니다. 모든 공개 페이지는 다국어를 지원합니다.

### Language Support Structure
```typescript
interface LanguageConfig {
  supported: ["ko", "en", "es"],  // 한국어, 영어, 스페인어
  default: "ko",
  
  // URL 구조 옵션
  urlPattern: {
    option1: "/[org]/[event]/[lang]",          // 추천: 기관/행사 중심, 언어는 옵션
    option2: "/[org]/[event]?lang=[lang]",     // 쿼리 파라미터 방식
    option3: "[lang].[org].domain.com/[event]" // 서브도메인 방식
  },
  
  detection: {
    priority: [
      "url_parameter",      // URL에 명시된 언어
      "user_preference",    // 로그인 사용자 설정
      "browser_language",   // 브라우저 언어 설정
      "geo_location",       // IP 기반 지역 감지
      "default_language"    // 기본 언어
    ]
  },
  
  storage: {
    method: "localStorage",
    key: "preferred_language",
    persist: true
  }
}
```

### 1. Event Homepage
**Path**: `/[event]` (기본 언어) 또는 `/[event]/[lang]` - 서브도메인에서 기관 구분

```typescript
interface EventHomepage {
  layout: "public-event-layout",
  
  // 언어 선택 컴포넌트
  languageSelector: {
    position: "header_top_right",
    display: "dropdown",  // dropdown, flags, text_links
    options: [
      { code: "ko", label: "한국어", flag: "🇰🇷" },
      { code: "en", label: "English", flag: "🇺🇸" },
      { code: "es", label: "Español", flag: "🇪🇸" }
    ],
    showCurrentLanguage: true,
    animation: "smooth_transition"
  },
  
  sections: [
    {
      id: "hero",
      components: "EventHeroBanner",
      content: {
        // 다국어 콘텐츠 구조
        event_title: {
          ko: "이벤트 제목",
          en: "Event Title",
          es: "Título del Evento"
        },
        tagline: {
          ko: "행사 슬로건",
          en: "Event Tagline",
          es: "Eslogan del Evento"
        },
        date_time: "locale_formatted",  // 언어별 날짜 포맷
        venue: {
          ko: "장소명",
          en: "Venue Name",
          es: "Nombre del Lugar"
        },
        register_button: {
          ko: "지금 등록하기",
          en: "Register Now",
          es: "Regístrate Ahora"
        },
        countdown_timer: {
          labels: {
            ko: { days: "일", hours: "시간", minutes: "분", seconds: "초" },
            en: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
            es: { days: "Días", hours: "Horas", minutes: "Minutos", seconds: "Segundos" }
          }
        }
      }
    },
    {
      id: "about",
      title: {
        ko: "행사 소개",
        en: "About the Event",
        es: "Acerca del Evento"
      },
      content: {
        description: {
          ko: "행사 설명...",
          en: "Event description...",
          es: "Descripción del evento..."
        },
        highlights: {
          ko: ["주요 특징 1", "주요 특징 2"],
          en: ["Highlight 1", "Highlight 2"],
          es: ["Destacado 1", "Destacado 2"]
        },
        who_should_attend: {
          ko: "참가 대상",
          en: "Who Should Attend",
          es: "Quién Debe Asistir"
        },
        key_takeaways: {
          ko: "주요 혜택",
          en: "Key Takeaways",
          es: "Beneficios Clave"
        }
      }
    },
    {
      id: "programs",
      title: {
        ko: "프로그램 및 일정",
        en: "Programs & Schedule",
        es: "Programas y Horario"
      },
      display: "timeline_or_grid",
      features: [
        "filter_by_track",
        "search_sessions",
        "add_to_personal_schedule"
      ],
      labels: {
        filter: {
          ko: "필터",
          en: "Filter",
          es: "Filtrar"
        },
        search: {
          ko: "검색",
          en: "Search",
          es: "Buscar"
        },
        add_to_schedule: {
          ko: "내 일정에 추가",
          en: "Add to My Schedule",
          es: "Agregar a Mi Horario"
        }
      }
    },
    {
      id: "speakers",
      title: {
        ko: "연사",
        en: "Speakers",
        es: "Ponentes"
      },
      display: "grid",
      card: [
        "photo",
        "name",
        "title",
        "organization",
        "bio_preview"
      ],
      modal: "full_speaker_profile",
      labels: {
        view_profile: {
          ko: "프로필 보기",
          en: "View Profile",
          es: "Ver Perfil"
        }
      }
    },
    {
      id: "pricing",
      title: {
        ko: "등록 패키지",
        en: "Registration Packages",
        es: "Paquetes de Registro"
      },
      display: "pricing_table",
      features: [
        "early_bird_highlight",
        "group_discount",
        "compare_packages"
      ],
      labels: {
        early_bird: {
          ko: "얼리버드 할인",
          en: "Early Bird Discount",
          es: "Descuento Pronto Pago"
        },
        group_discount: {
          ko: "단체 할인",
          en: "Group Discount",
          es: "Descuento de Grupo"
        },
        select_package: {
          ko: "패키지 선택",
          en: "Select Package",
          es: "Seleccionar Paquete"
        },
        currency_display: {
          ko: "₩",
          en: "$",
          es: "$"
        }
      }
    },
    {
      id: "venue",
      title: {
        ko: "행사장",
        en: "Venue",
        es: "Lugar"
      },
      components: [
        "VenueMap",
        "Directions",
        "Parking",
        "Accommodation"
      ],
      labels: {
        directions: {
          ko: "오시는 길",
          en: "Directions",
          es: "Direcciones"
        },
        parking: {
          ko: "주차 안내",
          en: "Parking Information",
          es: "Información de Estacionamiento"
        },
        accommodation: {
          ko: "숙박 안내",
          en: "Accommodation",
          es: "Alojamiento"
        }
      }
    },
    {
      id: "sponsors",
      title: {
        ko: "후원사 및 파트너",
        en: "Sponsors & Partners",
        es: "Patrocinadores y Socios"
      },
      tiers: [
        {
          level: "platinum",
          label: {
            ko: "플래티넘",
            en: "Platinum",
            es: "Platino"
          }
        },
        {
          level: "gold",
          label: {
            ko: "골드",
            en: "Gold",
            es: "Oro"
          }
        },
        {
          level: "silver",
          label: {
            ko: "실버",
            en: "Silver",
            es: "Plata"
          }
        },
        {
          level: "bronze",
          label: {
            ko: "브론즈",
            en: "Bronze",
            es: "Bronce"
          }
        }
      ]
    },
    {
      id: "faq",
      title: {
        ko: "자주 묻는 질문",
        en: "Frequently Asked Questions",
        es: "Preguntas Frecuentes"
      },
      categories: [
        {
          id: "registration",
          label: {
            ko: "등록",
            en: "Registration",
            es: "Registro"
          }
        },
        {
          id: "payment",
          label: {
            ko: "결제",
            en: "Payment",
            es: "Pago"
          }
        },
        {
          id: "venue",
          label: {
            ko: "장소",
            en: "Venue",
            es: "Lugar"
          }
        },
        {
          id: "program",
          label: {
            ko: "프로그램",
            en: "Program",
            es: "Programa"
          }
        },
        {
          id: "general",
          label: {
            ko: "일반",
            en: "General",
            es: "General"
          }
        }
      ]
    },
    {
      id: "contact",
      title: {
        ko: "문의하기",
        en: "Contact Us",
        es: "Contáctenos"
      },
      information: [
        "email",
        "phone",
        "social_media",
        "contact_form"
      ],
      labels: {
        email: {
          ko: "이메일",
          en: "Email",
          es: "Correo Electrónico"
        },
        phone: {
          ko: "전화",
          en: "Phone",
          es: "Teléfono"
        },
        send_message: {
          ko: "메시지 보내기",
          en: "Send Message",
          es: "Enviar Mensaje"
        }
      }
    }
  ],

  navigation: {
    sticky: true,
    items: [
      {
        id: "about",
        label: {
          ko: "소개",
          en: "About",
          es: "Acerca de"
        }
      },
      {
        id: "programs",
        label: {
          ko: "프로그램",
          en: "Programs",
          es: "Programas"
        }
      },
      {
        id: "speakers",
        label: {
          ko: "연사",
          en: "Speakers",
          es: "Ponentes"
        }
      },
      {
        id: "venue",
        label: {
          ko: "장소",
          en: "Venue",
          es: "Lugar"
        }
      },
      {
        id: "register",
        label: {
          ko: "등록",
          en: "Register",
          es: "Registrar"
        }
      }
    ],
    cta: {
      ko: "지금 등록하기",
      en: "Register Now",
      es: "Regístrate Ahora"
    }
  }
}
```

### 2. Registration Flow
**Path**: `/[event]/register` (기본 언어) 또는 `/[event]/[lang]/register` - 서브도메인에서 기관 구분

```typescript
interface RegistrationFlow {
  // 언어별 등록 페이지 설정
  languageSettings: {
    persistLanguage: true,  // 등록 과정 중 언어 유지
    autoDetect: false,      // 자동 감지 비활성화 (일관성을 위해)
    showSelector: true      // 언어 선택기 표시
  },

  steps: [
    {
      id: "select_package",
      title: {
        ko: "패키지 선택",
        en: "Choose Your Package",
        es: "Elige Tu Paquete"
      },
      components: "PackageSelector",
      features: [
        "compare_packages",
        "early_bird_pricing",
        "group_discount_calculator"
      ],
      labels: {
        compare: {
          ko: "패키지 비교",
          en: "Compare Packages",
          es: "Comparar Paquetes"
        },
        select: {
          ko: "선택",
          en: "Select",
          es: "Seleccionar"
        }
      }
    },
    {
      id: "select_programs",
      title: {
        ko: "프로그램 선택",
        en: "Select Programs",
        es: "Seleccionar Programas"
      },
      components: "ProgramSelector",
      features: [
        "filter_by_track",
        "check_conflicts",
        "waitlist_option",
        "recommendations"
      ],
      messages: {
        conflict: {
          ko: "시간이 겹치는 프로그램이 있습니다",
          en: "There are conflicting programs",
          es: "Hay programas en conflicto"
        },
        waitlist: {
          ko: "대기자 명단에 등록하시겠습니까?",
          en: "Would you like to join the waitlist?",
          es: "¿Te gustaría unirte a la lista de espera?"
        }
      }
    },
    {
      id: "participant_info",
      title: {
        ko: "참가자 정보",
        en: "Participant Information",
        es: "Información del Participante"
      },
      form: {
        sections: [
          {
            id: "personal_details",
            label: {
              ko: "개인 정보",
              en: "Personal Details",
              es: "Datos Personales"
            }
          },
          {
            id: "organization_info",
            label: {
              ko: "소속 정보",
              en: "Organization Info",
              es: "Información de la Organización"
            }
          },
          {
            id: "dietary_preferences",
            label: {
              ko: "식사 선호사항",
              en: "Dietary Preferences",
              es: "Preferencias Dietéticas"
            }
          },
          {
            id: "special_requirements",
            label: {
              ko: "특별 요구사항",
              en: "Special Requirements",
              es: "Requisitos Especiales"
            }
          }
        ],
        validation: {
          messages: {
            required: {
              ko: "필수 입력 항목입니다",
              en: "This field is required",
              es: "Este campo es obligatorio"
            },
            email: {
              ko: "올바른 이메일 형식이 아닙니다",
              en: "Invalid email format",
              es: "Formato de correo inválido"
            }
          }
        },
        saveProgress: true
      }
    },
    {
      id: "additional_info",
      title: {
        ko: "추가 정보",
        en: "Additional Information",
        es: "Información Adicional"
      },
      conditional: "based_on_selections",
      customFields: "from_event_settings"
    },
    {
      id: "review",
      title: {
        ko: "등록 정보 확인",
        en: "Review Your Registration",
        es: "Revisar Tu Registro"
      },
      display: [
        "selected_package",
        "programs_list",
        "participant_summary",
        "price_breakdown"
      ],
      labels: {
        edit: {
          ko: "수정",
          en: "Edit",
          es: "Editar"
        },
        confirm: {
          ko: "확인",
          en: "Confirm",
          es: "Confirmar"
        }
      }
    },
    {
      id: "payment",
      title: {
        ko: "결제",
        en: "Payment",
        es: "Pago"
      },
      methods: [
        {
          id: "credit_card",
          label: {
            ko: "신용카드",
            en: "Credit Card",
            es: "Tarjeta de Crédito"
          }
        },
        {
          id: "bank_transfer",
          label: {
            ko: "계좌이체",
            en: "Bank Transfer",
            es: "Transferencia Bancaria"
          }
        },
        {
          id: "virtual_account",
          label: {
            ko: "가상계좌",
            en: "Virtual Account",
            es: "Cuenta Virtual"
          }
        }
      ],
      features: [
        "secure_payment",
        "save_card_option",
        "invoice_request"
      ],
      labels: {
        total: {
          ko: "총 결제금액",
          en: "Total Amount",
          es: "Monto Total"
        },
        process_payment: {
          ko: "결제하기",
          en: "Process Payment",
          es: "Procesar Pago"
        }
      }
    },
    {
      id: "confirmation",
      title: {
        ko: "등록 완료",
        en: "Registration Complete",
        es: "Registro Completo"
      },
      messages: {
        success: {
          ko: "등록이 성공적으로 완료되었습니다!",
          en: "Registration completed successfully!",
          es: "¡Registro completado exitosamente!"
        }
      },
      display: [
        "success_message",
        "registration_number",
        "receipt",
        "next_steps"
      ],
      actions: [
        {
          id: "download_ticket",
          label: {
            ko: "티켓 다운로드",
            en: "Download Ticket",
            es: "Descargar Ticket"
          }
        },
        {
          id: "add_to_calendar",
          label: {
            ko: "캘린더에 추가",
            en: "Add to Calendar",
            es: "Añadir al Calendario"
          }
        },
        {
          id: "share_on_social",
          label: {
            ko: "공유하기",
            en: "Share",
            es: "Compartir"
          }
        },
        {
          id: "register_another",
          label: {
            ko: "추가 등록",
            en: "Register Another",
            es: "Registrar Otro"
          }
        }
      ]
    }
  ],

  features: {
    progressBar: {
      type: "stepped",
      showStepNumbers: true
    },
    navigation: {
      allowBackward: true,
      skipOptional: true
    },
    persistence: {
      saveProgress: true,
      resumeLater: true,
      timeout: "30_minutes"
    },
    groupRegistration: {
      enabled: true,
      maxParticipants: 10,
      bulkUpload: "csv_template"
    }
  }
}
```

### 3. Event Schedule
**Path**: `/[event]/schedule` (기본 언어) 또는 `/[event]/[lang]/schedule` - 서브도메인에서 기관 구분

```typescript
interface EventSchedule {
  // 언어별 날짜/시간 포맷 설정
  localeSettings: {
    dateFormat: {
      ko: "YYYY년 MM월 DD일",
      en: "MMM DD, YYYY",
      es: "DD de MMM, YYYY"
    },
    timeFormat: {
      ko: "HH:mm",  // 24시간
      en: "hh:mm A", // 12시간 AM/PM
      es: "HH:mm"   // 24시간
    },
    weekDays: {
      ko: ["일", "월", "화", "수", "목", "금", "토"],
      en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    }
  },

  views: [
    {
      id: "agenda",
      title: {
        ko: "일정 보기",
        en: "Agenda View",
        es: "Vista de Agenda"
      },
      display: "timeline",
      features: [
        "filter_by_day",
        "filter_by_track",
        "search_sessions"
      ],
      labels: {
        filterByDay: {
          ko: "날짜별 필터",
          en: "Filter by Day",
          es: "Filtrar por Día"
        },
        filterByTrack: {
          ko: "트랙별 필터",
          en: "Filter by Track",
          es: "Filtrar por Track"
        },
        search: {
          ko: "세션 검색",
          en: "Search Sessions",
          es: "Buscar Sesiones"
        }
      }
    },
    {
      id: "calendar",
      title: {
        ko: "캘린더 보기",
        en: "Calendar View",
        es: "Vista de Calendario"
      },
      display: "calendar_grid",
      features: [
        "drag_to_personal_schedule",
        "color_by_track",
        "show_conflicts"
      ],
      labels: {
        dragToAdd: {
          ko: "드래그하여 내 일정에 추가",
          en: "Drag to add to my schedule",
          es: "Arrastra para añadir a mi horario"
        }
      }
    },
    {
      id: "my_schedule",
      title: {
        ko: "내 일정",
        en: "My Schedule",
        es: "Mi Horario"
      },
      requiresAuth: true,
      features: [
        "personalized_agenda",
        "add_sessions",
        "export_calendar",
        "get_reminders"
      ],
      labels: {
        exportCalendar: {
          ko: "캘린더 내보내기",
          en: "Export Calendar",
          es: "Exportar Calendario"
        },
        setReminder: {
          ko: "알림 설정",
          en: "Set Reminder",
          es: "Configurar Recordatorio"
        }
      }
    }
  ],

  sessionDetail: {
    modal: true,
    information: [
      "title",
      "description",
      "speakers",
      "time",
      "location",
      "capacity",
      "materials"
    ],
    labels: {
      speakers: {
        ko: "연사",
        en: "Speakers",
        es: "Ponentes"
      },
      time: {
        ko: "시간",
        en: "Time",
        es: "Hora"
      },
      location: {
        ko: "장소",
        en: "Location",
        es: "Ubicación"
      },
      capacity: {
        ko: "정원",
        en: "Capacity",
        es: "Capacidad"
      },
      materials: {
        ko: "자료",
        en: "Materials",
        es: "Materiales"
      }
    },
    actions: [
      {
        id: "add_to_schedule",
        label: {
          ko: "내 일정에 추가",
          en: "Add to Schedule",
          es: "Añadir al Horario"
        }
      },
      {
        id: "share",
        label: {
          ko: "공유",
          en: "Share",
          es: "Compartir"
        }
      },
      {
        id: "download_materials",
        label: {
          ko: "자료 다운로드",
          en: "Download Materials",
          es: "Descargar Materiales"
        }
      }
    ]
  }
}
```

---

## Component Structure

### Directory Organization
```typescript
/components/
├── platform/                    // 플랫폼 관리 컴포넌트
│   ├── dashboard/
│   │   ├── PlatformMetrics.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── OrganizationGrid.tsx
│   │   └── SubscriptionStatus.tsx
│   ├── organizations/
│   │   ├── OrganizationForm.tsx
│   │   ├── OrganizationList.tsx
│   │   ├── OrganizationDetail.tsx
│   │   └── SubscriptionManager.tsx
│   └── billing/
│       ├── InvoiceGenerator.tsx
│       ├── PaymentHistory.tsx
│       └── BillingSettings.tsx
│
├── admin/                       // 기관 관리자 컴포넌트
│   ├── dashboard/
│   │   ├── AdminMetrics.tsx
│   │   ├── EventsOverview.tsx
│   │   ├── RecentActivity.tsx
│   │   └── QuickActions.tsx
│   ├── events/
│   │   ├── EventBuilder/
│   │   │   ├── BasicInfoStep.tsx
│   │   │   ├── ScheduleStep.tsx
│   │   │   ├── PricingStep.tsx
│   │   │   ├── FormBuilderStep.tsx
│   │   │   └── ReviewStep.tsx
│   │   ├── EventList.tsx
│   │   ├── EventCalendar.tsx
│   │   └── EventAnalytics.tsx
│   ├── registrations/
│   │   ├── RegistrationTable.tsx
│   │   ├── RegistrationDetail.tsx
│   │   ├── BulkActions.tsx
│   │   └── CheckInScanner.tsx
│   ├── payments/
│   │   ├── TransactionList.tsx
│   │   ├── RefundProcessor.tsx
│   │   ├── PaymentReports.tsx
│   │   └── Reconciliation.tsx
│   └── settings/
│       ├── BrandingSettings.tsx
│       ├── PaymentGateway.tsx
│       ├── EmailTemplates.tsx
│       └── FormBuilder.tsx
│
├── participant/                 // 참가자 포털 컴포넌트
│   ├── dashboard/
│   │   ├── ParticipantOverview.tsx
│   │   ├── UpcomingEvents.tsx
│   │   └── ActivityTimeline.tsx
│   ├── registrations/
│   │   ├── MyRegistrations.tsx
│   │   ├── RegistrationCard.tsx
│   │   └── Ticket.tsx
│   ├── payments/
│   │   ├── PaymentHistory.tsx
│   │   └── Receipt.tsx
│   └── profile/
│       ├── ProfileForm.tsx
│       ├── PreferenceSettings.tsx
│       └── SecuritySettings.tsx
│
├── public/                      // 공개 페이지 컴포넌트
│   ├── event/
│   │   ├── EventHero.tsx
│   │   ├── EventInfo.tsx
│   │   ├── ProgramGrid.tsx
│   │   ├── SpeakerCard.tsx
│   │   ├── VenueMap.tsx
│   │   └── FAQ.tsx
│   ├── registration/
│   │   ├── RegistrationWizard/
│   │   │   ├── PackageSelector.tsx
│   │   │   ├── ProgramSelector.tsx
│   │   │   ├── ParticipantForm.tsx
│   │   │   ├── PaymentStep.tsx
│   │   │   └── Confirmation.tsx
│   │   └── GroupRegistration.tsx
│   └── schedule/
│       ├── ScheduleView.tsx
│       ├── SessionCard.tsx
│       └── PersonalSchedule.tsx
│
└── shared/                      // 공통 컴포넌트
    ├── layouts/
    │   ├── PlatformLayout.tsx
    │   ├── AdminLayout.tsx
    │   ├── ParticipantLayout.tsx
    │   └── PublicLayout.tsx
    ├── navigation/
    │   ├── Sidebar.tsx
    │   ├── Navbar.tsx
    │   ├── Breadcrumb.tsx
    │   ├── MobileMenu.tsx
    │   └── LanguageSelector.tsx  // 언어 선택기
    ├── localization/            // 다국어 지원 컴포넌트
    │   ├── LanguageProvider.tsx
    │   ├── TranslatedText.tsx
    │   ├── LocalizedDate.tsx
    │   ├── LocalizedCurrency.tsx
    │   ├── LanguageDetector.tsx
    │   └── hooks/
    │       ├── useTranslation.ts
    │       ├── useLocale.ts
    │       └── useLanguagePreference.ts
    ├── forms/
    │   ├── DynamicForm.tsx
    │   ├── FormField.tsx
    │   ├── ValidationMessage.tsx
    │   ├── FileUpload.tsx
    │   └── LocalizedFormField.tsx  // 다국어 폼 필드
    ├── tables/
    │   ├── DataTable.tsx
    │   ├── TableFilters.tsx
    │   ├── TablePagination.tsx
    │   └── BulkActions.tsx
    ├── charts/
    │   ├── LineChart.tsx
    │   ├── BarChart.tsx
    │   ├── PieChart.tsx
    │   └── MetricCard.tsx
    └── ui/                      // 기본 UI 컴포넌트
        ├── Button.tsx
        ├── Card.tsx
        ├── Modal.tsx
        ├── Toast.tsx
        ├── Dropdown.tsx
        ├── Tabs.tsx
        └── LoadingSpinner.tsx
```

### Component Guidelines
```typescript
// 컴포넌트 작성 가이드라인
interface ComponentGuidelines {
  naming: {
    convention: "PascalCase",
    descriptive: true,
    examples: ["EventRegistrationForm", "PaymentProcessor"]
  },

  structure: {
    imports: "grouped by source",
    types: "interface over type",
    props: "destructured with defaults",
    hooks: "custom hooks for logic",
    render: "early returns for edge cases"
  },

  state: {
    local: "useState for UI state",
    global: "Zustand for app state",
    server: "React Query for server state",
    language: "Context API for language preference"
  },

  localization: {
    textContent: {
      approach: "Translation keys, not hardcoded strings",
      format: "useTranslation() hook",
      example: "const { t } = useTranslation(); <p>{t('event.title')}</p>"
    },
    dateTime: {
      library: "date-fns with locale support",
      format: "LocalizedDate component",
      timezone: "Always store UTC, display local"
    },
    numbers: {
      currency: "Intl.NumberFormat with locale",
      format: "LocalizedCurrency component"
    },
    validation: {
      messages: "Localized error messages",
      patterns: "Locale-specific patterns (phone, postal)"
    },
    seo: {
      metadata: "Localized meta tags",
      urls: "Language prefix in routes",
      hreflang: "Alternate language links"
    }
  },

  styling: {
    approach: "Tailwind CSS",
    customization: "CSS modules when needed",
    responsive: "mobile-first",
    darkMode: "supported",
    rtl: "Support for right-to-left languages"
  },

  testing: {
    unit: "Jest + React Testing Library",
    integration: "Cypress",
    accessibility: "axe-core",
    i18n: "Test with multiple locales"
  },

  documentation: {
    props: "JSDoc comments",
    complex: "README in component folder",
    storybook: "for shared components",
    translations: "Document translation keys"
  }
}

// 다국어 컴포넌트 예시
interface LocalizationExample {
  // 언어 선택기 사용 예시
  languageSelector: `
    import { LanguageSelector } from '@/components/shared/navigation';
    
    <LanguageSelector 
      currentLang="ko"
      availableLanguages={['ko', 'en', 'es']}
      onLanguageChange={(lang) => handleLanguageChange(lang)}
    />
  `,

  // 번역 훅 사용 예시
  translationHook: `
    import { useTranslation } from '@/hooks/useTranslation';
    
    function EventCard() {
      const { t, locale } = useTranslation();
      
      return (
        <div>
          <h2>{t('event.title')}</h2>
          <p>{t('event.date', { date: eventDate })}</p>
        </div>
      );
    }
  `,

  // 다국어 폼 필드 예시
  localizedFormField: `
    import { LocalizedFormField } from '@/components/shared/forms';
    
    <LocalizedFormField
      name="firstName"
      label={{ ko: "이름", en: "First Name", es: "Nombre" }}
      placeholder={{ ko: "이름 입력", en: "Enter name", es: "Ingrese nombre" }}
      validation={{
        required: { ko: "필수 항목", en: "Required", es: "Requerido" }
      }}
    />
  `,

  // 날짜 현지화 예시
  localizedDate: `
    import { LocalizedDate } from '@/components/shared/localization';
    
    <LocalizedDate 
      date={eventDate}
      format="long" // short, medium, long, full
      locale={currentLocale}
    />
  `,

  // 통화 현지화 예시
  localizedCurrency: `
    import { LocalizedCurrency } from '@/components/shared/localization';
    
    <LocalizedCurrency 
      amount={150000}
      currency="KRW"
      locale={currentLocale}
      display="symbol" // symbol, code, name
    />
  `
}
```