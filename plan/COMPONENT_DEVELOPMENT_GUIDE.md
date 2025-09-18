# 🎨 Component Development Guide
**Component-Driven Development Strategy for UBF Event Platform**

## 🏗️ Component Architecture

### **Atomic Design Structure**
```
components/
├── atoms/           # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Label/
│   └── Icon/
├── molecules/       # Simple combinations
│   ├── FormField/
│   ├── PriceTag/
│   ├── SearchBar/
│   └── LanguageSelector/
├── organisms/       # Complex components
│   ├── RegistrationForm/
│   ├── EventCard/
│   ├── PaymentSelector/
│   └── NavigationMenu/
├── templates/       # Page layouts
│   ├── EventLayout/
│   ├── AdminLayout/
│   └── AuthLayout/
└── pages/          # Full pages
    ├── EventListPage/
    ├── RegistrationPage/
    └── AdminDashboard/
```

## 📋 Component Development Priority

### **Week 1: Foundation Components**

#### Designer Tasks
```yaml
Day 1-2:
  Design System Setup:
    - Color palette (primary, secondary, semantic)
    - Typography scale (headings, body, captions)
    - Spacing system (4px base unit)
    - Border radius tokens
    - Shadow system

Day 3-5:
  Atom Components:
    - Button (variants: primary, secondary, outline, ghost)
    - Input (text, email, tel, number, textarea)
    - Select dropdown
    - Checkbox & Radio
    - Badge & Tag
    - Icon system
```

#### Frontend Developer Tasks
```typescript
// Day 1-2: Setup component structure
// components/atoms/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark',
        outline: 'border border-gray-300 hover:bg-gray-50',
        ghost: 'hover:bg-gray-100'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

// Day 3-5: Build all atom components
```

### **Week 2: Form Components**

#### Component Specifications

```typescript
// components/molecules/FormField/FormField.tsx
interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'checkbox';
  required?: boolean;
  error?: string;
  helpText?: string;
  locale: 'ko' | 'en' | 'es';
}

// Multi-language support structure
const translations = {
  ko: {
    required: '필수',
    optional: '선택'
  },
  en: {
    required: 'Required',
    optional: 'Optional'
  },
  es: {
    required: 'Requerido',
    optional: 'Opcional'
  }
};
```

#### Designer Deliverables
```yaml
Form Components:
  - Text input states (default, focused, error, disabled)
  - Form field with label and help text
  - Error message styling
  - Multi-step form progress indicator
  - Group registration fields
  - File upload component
```

### **Week 3: Event Components**

#### Event Card Component
```typescript
// components/organisms/EventCard/EventCard.tsx
interface EventCardProps {
  event: {
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    startDate: Date;
    endDate: Date;
    location: string;
    imageUrl: string;
    price: {
      amount: number;
      currency: string;
      earlyBird?: {
        amount: number;
        deadline: Date;
      };
    };
    capacity: {
      total: number;
      remaining: number;
    };
    tags: string[];
  };
  locale: 'ko' | 'en' | 'es';
  variant: 'grid' | 'list';
}

// Figma Design Specs
/*
Grid View:
  - Width: 320px
  - Image: 16:9 ratio
  - Padding: 16px
  - Shadow: 0 2px 8px rgba(0,0,0,0.1)

List View:
  - Height: 120px
  - Image: Square 120x120
  - Horizontal layout
*/
```

### **Week 4: Registration Flow Components**

#### Multi-Step Registration
```typescript
// components/organisms/RegistrationWizard/RegistrationWizard.tsx
interface RegistrationStep {
  id: string;
  title: LocalizedString;
  component: React.ComponentType;
  validation: ZodSchema;
}

const registrationSteps: RegistrationStep[] = [
  {
    id: 'programs',
    title: { ko: '프로그램 선택', en: 'Select Programs', es: 'Seleccionar Programas' },
    component: ProgramSelector,
    validation: programSelectionSchema
  },
  {
    id: 'participants',
    title: { ko: '참가자 정보', en: 'Participant Info', es: 'Información del Participante' },
    component: ParticipantForm,
    validation: participantSchema
  },
  {
    id: 'payment',
    title: { ko: '결제 정보', en: 'Payment', es: 'Pago' },
    component: PaymentForm,
    validation: paymentSchema
  },
  {
    id: 'confirmation',
    title: { ko: '확인', en: 'Confirmation', es: 'Confirmación' },
    component: ConfirmationView,
    validation: confirmationSchema
  }
];
```

## 🎨 Design System Tokens

### **Color System**
```scss
// styles/tokens/colors.scss
:root {
  // Brand Colors
  --color-primary-50: #e6f2ff;
  --color-primary-100: #bae0ff;
  --color-primary-500: #0066cc;
  --color-primary-700: #004499;
  --color-primary-900: #002966;

  // Semantic Colors
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  // Neutral Colors
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
}
```

### **Typography System**
```scss
// styles/tokens/typography.scss
:root {
  // Font Families
  --font-sans: 'Pretendard', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  // Font Sizes
  --text-xs: 0.75rem;    // 12px
  --text-sm: 0.875rem;   // 14px
  --text-base: 1rem;     // 16px
  --text-lg: 1.125rem;   // 18px
  --text-xl: 1.25rem;    // 20px
  --text-2xl: 1.5rem;    // 24px
  --text-3xl: 1.875rem;  // 30px
  --text-4xl: 2.25rem;   // 36px

  // Line Heights
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  // Font Weights
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

## 🔄 Component Handoff Process

### **1. Design Phase** (Designer)
```yaml
Figma Setup:
  - Create component in Figma library
  - Add all states and variants
  - Include responsive breakpoints
  - Add interaction prototypes
  - Write component documentation

Handoff Checklist:
  ✅ All states designed (default, hover, active, disabled, error)
  ✅ Responsive versions (mobile, tablet, desktop)
  ✅ Dark mode variant
  ✅ Accessibility annotations
  ✅ Animation specs
  ✅ Content guidelines
```

### **2. Development Phase** (Frontend Developer)
```yaml
Implementation Checklist:
  ✅ Create component folder structure
  ✅ Write TypeScript interfaces
  ✅ Implement all variants
  ✅ Add Storybook stories
  ✅ Write unit tests
  ✅ Add accessibility attributes
  ✅ Test responsive behavior
  ✅ Document props with JSDoc
```

### **3. Integration Phase** (Backend Developer)
```yaml
Integration Tasks:
  ✅ Connect to API endpoints
  ✅ Add data validation
  ✅ Implement error handling
  ✅ Add loading states
  ✅ Test with real data
  ✅ Performance optimization
```

## 📚 Component Documentation Template

```typescript
/**
 * EventCard Component
 *
 * @description Displays event information in a card format
 * @example
 * ```tsx
 * <EventCard
 *   event={eventData}
 *   locale="ko"
 *   variant="grid"
 * />
 * ```
 *
 * @figma https://figma.com/file/xxx/EventCard
 * @storybook https://storybook.local/event-card
 */
```

## 🧪 Component Testing Strategy

### **Unit Testing**
```typescript
// components/atoms/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
  });
});
```

### **Visual Testing**
```yaml
Tools:
  - Storybook for component playground
  - Chromatic for visual regression
  - Percy for cross-browser testing

Test Cases:
  - All component variants
  - Different viewport sizes
  - Dark/light mode
  - Different languages (text overflow)
  - Loading states
  - Error states
```

## 🚀 Progressive Enhancement Strategy

### **Phase 1: MVP Components** (Oct 31 Launch)
```yaml
Essential Components:
  ✅ Basic form elements
  ✅ Event listing and detail
  ✅ Registration flow
  ✅ Payment interface
  ✅ Confirmation pages
```

### **Phase 2: Enhanced Components** (November)
```yaml
Enhancements:
  - Animation and transitions
  - Advanced form validation
  - Real-time updates
  - Offline support
  - PWA features
```

### **Phase 3: Premium Components** (December)
```yaml
Premium Features:
  - Dashboard analytics
  - Data visualization
  - Drag-and-drop builders
  - Advanced filtering
  - Bulk operations
```

## 📱 Responsive Component Guidelines

### **Breakpoints**
```scss
// styles/breakpoints.scss
$breakpoints: (
  'sm': 640px,   // Mobile landscape
  'md': 768px,   // Tablet
  'lg': 1024px,  // Desktop
  'xl': 1280px,  // Large desktop
  '2xl': 1536px  // Extra large
);
```

### **Component Responsive Behavior**
```typescript
// Example: Responsive EventCard
const EventCard = ({ variant = 'grid' }) => {
  return (
    <div className={cn(
      'flex',
      // Mobile: Always stack vertically
      'flex-col',
      // Tablet and up: Use variant layout
      'md:flex-row': variant === 'list',
      'md:flex-col': variant === 'grid'
    )}>
      {/* Component content */}
    </div>
  );
};
```

## 🎯 Performance Guidelines

### **Component Optimization**
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.data.id === nextProps.data.id;
});

// Use lazy loading for large components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

### **Bundle Size Optimization**
```yaml
Strategies:
  - Tree shaking unused components
  - Code splitting by route
  - Dynamic imports for optional features
  - Optimize images with next/image
  - Use CSS modules for style isolation
  - Minimize third-party dependencies
```

## 🔧 Developer Tools Setup

### **VS Code Snippets**
```json
// .vscode/components.code-snippets
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "import { FC } from 'react';",
      "import { cn } from '@/lib/utils';",
      "",
      "interface ${1:ComponentName}Props {",
      "  className?: string;",
      "}",
      "",
      "export const ${1:ComponentName}: FC<${1:ComponentName}Props> = ({",
      "  className",
      "}) => {",
      "  return (",
      "    <div className={cn('', className)}>",
      "      $0",
      "    </div>",
      "  );",
      "};"
    ]
  }
}
```

This component development guide provides a clear roadmap for your designer and developers to work efficiently in parallel, with specific focus on component-driven development for your UBF event platform.