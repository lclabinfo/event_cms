# 🎨 Multi-Tenant Event Platform - Page Structure Design

## 🎯 Overview
Multi-tenant SaaS 이벤트 플랫폼의 완벽한 페이지 구조 및 라우팅 설계입니다.

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

# 기관별 접근 방식 (3가지 옵션)
option_1_subdomain: {org-slug}.events.platform.com
option_2_path: events.platform.com/org/{org-slug}
option_3_custom: events.seoul-ubf.org  # CNAME 설정

# 추천: Subdomain 방식 (option_1)
# 이유:
# - 명확한 격리
# - 쉬운 SSL 인증서 관리 (wildcard)
# - 향후 마이크로서비스 전환 용이
```

### Routing Structure
```typescript
// Next.js App Router 구조
/app/
├── platform-admin/        // 수퍼 어드민 (플랫폼 운영자)
├── [org]/                // 기관별 라우팅
│   ├── admin/           // 기관 관리자
│   ├── my/              // 참가자 포털
│   └── [event]/         // 공개 행사 페이지
├── auth/                 // 인증 페이지
└── (marketing)/         // 플랫폼 마케팅 페이지
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
**Path**: `/[org]/admin`

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
**Path**: `/[org]/admin/events`

```typescript
interface EventsManagement {
  list: {
    path: "/[org]/admin/events",
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
    path: "/[org]/admin/events/create",
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
    path: "/[org]/admin/events/[id]",
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
**Path**: `/[org]/admin/registrations`

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
일반 대중이 접근하는 공개 행사 페이지입니다.

### 1. Event Homepage
**Path**: `/[org]/[event]`

```typescript
interface EventHomepage {
  layout: "public-event-layout",
  sections: [
    {
      id: "hero",
      components: "EventHeroBanner",
      content: [
        "event_title",
        "tagline",
        "date_time",
        "venue",
        "register_button",
        "countdown_timer"
      ]
    },
    {
      id: "about",
      title: "About the Event",
      content: [
        "description",
        "highlights",
        "who_should_attend",
        "key_takeaways"
      ]
    },
    {
      id: "programs",
      title: "Programs & Schedule",
      display: "timeline_or_grid",
      features: [
        "filter_by_track",
        "search_sessions",
        "add_to_personal_schedule"
      ]
    },
    {
      id: "speakers",
      title: "Speakers",
      display: "grid",
      card: [
        "photo",
        "name",
        "title",
        "organization",
        "bio_preview"
      ],
      modal: "full_speaker_profile"
    },
    {
      id: "pricing",
      title: "Registration Packages",
      display: "pricing_table",
      features: [
        "early_bird_highlight",
        "group_discount",
        "compare_packages"
      ]
    },
    {
      id: "venue",
      title: "Venue",
      components: [
        "VenueMap",
        "Directions",
        "Parking",
        "Accommodation"
      ]
    },
    {
      id: "sponsors",
      title: "Sponsors & Partners",
      tiers: [
        "platinum",
        "gold",
        "silver",
        "bronze"
      ]
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      categories: [
        "registration",
        "payment",
        "venue",
        "program",
        "general"
      ]
    },
    {
      id: "contact",
      title: "Contact Us",
      information: [
        "email",
        "phone",
        "social_media",
        "contact_form"
      ]
    }
  ],

  navigation: {
    sticky: true,
    items: [
      "About",
      "Programs",
      "Speakers",
      "Venue",
      "Register"
    ],
    cta: "Register Now"
  }
}
```

### 2. Registration Flow
**Path**: `/[org]/[event]/register`

```typescript
interface RegistrationFlow {
  steps: [
    {
      id: "select_package",
      title: "Choose Your Package",
      components: "PackageSelector",
      features: [
        "compare_packages",
        "early_bird_pricing",
        "group_discount_calculator"
      ]
    },
    {
      id: "select_programs",
      title: "Select Programs",
      components: "ProgramSelector",
      features: [
        "filter_by_track",
        "check_conflicts",
        "waitlist_option",
        "recommendations"
      ]
    },
    {
      id: "participant_info",
      title: "Participant Information",
      form: {
        sections: [
          "personal_details",
          "organization_info",
          "dietary_preferences",
          "special_requirements"
        ],
        validation: "real_time",
        saveProgress: true
      }
    },
    {
      id: "additional_info",
      title: "Additional Information",
      conditional: "based_on_selections",
      customFields: "from_event_settings"
    },
    {
      id: "review",
      title: "Review Your Registration",
      display: [
        "selected_package",
        "programs_list",
        "participant_summary",
        "price_breakdown"
      ],
      edit: "inline_or_go_back"
    },
    {
      id: "payment",
      title: "Payment",
      methods: [
        "credit_card",
        "bank_transfer",
        "virtual_account"
      ],
      features: [
        "secure_payment",
        "save_card_option",
        "invoice_request"
      ]
    },
    {
      id: "confirmation",
      title: "Registration Complete",
      display: [
        "success_message",
        "registration_number",
        "receipt",
        "next_steps"
      ],
      actions: [
        "download_ticket",
        "add_to_calendar",
        "share_on_social",
        "register_another"
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
**Path**: `/[org]/[event]/schedule`

```typescript
interface EventSchedule {
  views: [
    {
      id: "agenda",
      title: "Agenda View",
      display: "timeline",
      features: [
        "filter_by_day",
        "filter_by_track",
        "search_sessions"
      ]
    },
    {
      id: "calendar",
      title: "Calendar View",
      display: "calendar_grid",
      features: [
        "drag_to_personal_schedule",
        "color_by_track",
        "show_conflicts"
      ]
    },
    {
      id: "my_schedule",
      title: "My Schedule",
      requiresAuth: true,
      features: [
        "personalized_agenda",
        "add_sessions",
        "export_calendar",
        "get_reminders"
      ]
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
    actions: [
      "add_to_schedule",
      "share",
      "download_materials"
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
    │   └── MobileMenu.tsx
    ├── forms/
    │   ├── DynamicForm.tsx
    │   ├── FormField.tsx
    │   ├── ValidationMessage.tsx
    │   └── FileUpload.tsx
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
    server: "React Query for server state"
  },

  styling: {
    approach: "Tailwind CSS",
    customization: "CSS modules when needed",
    responsive: "mobile-first",
    darkMode: "supported"
  },

  testing: {
    unit: "Jest + React Testing Library",
    integration: "Cypress",
    accessibility: "axe-core"
  },

  documentation: {
    props: "JSDoc comments",
    complex: "README in component folder",
    storybook: "for shared components"
  }
}
```