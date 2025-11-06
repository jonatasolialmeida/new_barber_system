# 📚 Storybook - Design System Documentation

Documentação visual interativa dos componentes do Barber System.

## 📦 Instalação

```bash
# Instalar Storybook e dependências
npm install --save-dev @storybook/nextjs@latest
npm install --save-dev @storybook/addon-links@latest
npm install --save-dev @storybook/addon-essentials@latest
npm install --save-dev @storybook/addon-interactions@latest
npm install --save-dev @storybook/addon-a11y@latest
npm install --save-dev @storybook/test@latest
npm install --save-dev storybook@latest
```

## 🚀 Comandos

```bash
# Iniciar Storybook em desenvolvimento
npm run storybook

# Build para produção
npm run build-storybook

# Preview do build
npx http-server storybook-static
```

## 📁 Estrutura

```
frontend/
├── .storybook/
│   ├── main.ts          # Configuração principal
│   └── preview.tsx      # Decoradores e parâmetros globais
├── src/
│   └── components/
│       ├── base/
│       │   ├── Button.stories.tsx
│       │   ├── Card.stories.tsx
│       │   └── Input.stories.tsx
│       └── EmptyState.stories.tsx
└── STORYBOOK.md         # Esta documentação
```

## 📖 Stories Criadas

### Base Components

#### Button.stories.tsx
- ✅ Variants: Primary, Secondary, Outlined, Text
- ✅ Sizes: Small, Medium, Large
- ✅ States: Loading, Disabled
- ✅ Special: Gradient, Glow, GradientAndGlow
- ✅ With icons: Icon, StartIcon
- ✅ IconButton component
- ✅ ButtonGroup: Horizontal, Vertical
- ✅ Full width
- ✅ All colors showcase

**Total:** 15+ stories

#### Card.stories.tsx
- ✅ Variants: Elevated, Outlined, Gradient, Glass, Hover
- ✅ Interactive states
- ✅ Custom gradients: Sunset, Ocean
- ✅ Complex content example
- ✅ All variants showcase

**Total:** 12+ stories

#### Input.stories.tsx
- ✅ Variants: Outlined, Filled, Glass
- ✅ Validation: Success, Error
- ✅ Password with toggle
- ✅ States: Disabled, Required
- ✅ Types: Email, Phone, Number
- ✅ TextArea component
- ✅ SearchInput component
- ✅ Form example
- ✅ All variants showcase

**Total:** 17+ stories

### Empty States

#### EmptyState.stories.tsx
- ✅ Basic usage: Default, WithAction, WithTwoActions
- ✅ Variants: Default, Card, Minimal
- ✅ Sizes: Small, Medium, Large
- ✅ Pre-configured states:
  - NoAppointments
  - NoSearchResults
  - NoServices
  - NoBarbers
  - NoRevenue
  - NoReports
  - ErrorState
  - OfflineState
- ✅ All illustrations showcase
- ✅ Real world examples

**Total:** 20+ stories

---

## 🎨 Features

### Decoradores Globais

Todas as stories são envolvidas em:
- `ErrorBoundary` - Captura erros
- `QueryProvider` - React Query context
- `ThemeProvider` - Theme switcher (light/dark)
- `ToastProvider` - Toast notifications

### Addons Instalados

1. **@storybook/addon-links**
   - Links entre stories

2. **@storybook/addon-essentials**
   - Controls - Controles interativos
   - Actions - Log de eventos
   - Viewport - Preview responsivo
   - Backgrounds - Troca de background
   - Toolbars - Ferramentas customizadas
   - Docs - Documentação automática

3. **@storybook/addon-interactions**
   - Teste de interações
   - Simulação de user flow

4. **@storybook/addon-a11y**
   - Testes de acessibilidade
   - WCAG compliance
   - Contraste de cores
   - ARIA labels

### Backgrounds

Configurados 2 backgrounds:
- **light**: `#F5F7FA`
- **dark**: `#0A1929`

### Controles

- **color**: Para props de cor
- **date**: Para props de data
- **actions**: Regex `^on[A-Z].*` para callbacks

---

## 📝 Como Criar uma Story

### Template Básico

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import YourComponent from './YourComponent';

const meta = {
  title: 'Components/Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls
    variant: {
      control: 'select',
      options: ['option1', 'option2'],
      description: 'Variant description',
    },
  },
  args: {
    // Default args
    onClick: fn(),
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Story-specific args
  },
};
```

### Dicas

1. **Organize por categoria**: `Components/Base/Button`
2. **Use tags**: `['autodocs']` para docs automáticas
3. **Defina argTypes**: Para controles interativos
4. **Mock callbacks**: Use `fn()` do `@storybook/test`
5. **Adicione descrições**: Em `parameters.docs.description`
6. **Crie variações**: Uma story para cada variant/state

---

## 🎯 Casos de Uso

### 1. Desenvolvimento de Componentes

```bash
npm run storybook
```

- Desenvolva componentes isoladamente
- Teste todas as variações
- Veja mudanças em tempo real
- Debug visual issues

### 2. Design Review

- Compartilhe build estático
- Demonstre variações
- Valide UX/UI
- Coleta feedback

### 3. Documentação

- Docs automáticas com `autodocs`
- Exemplos interativos
- Props documentation
- Usage guidelines

### 4. Testes Visuais

```bash
# Com Chromatic (opcional)
npm install --save-dev chromatic
npx chromatic --project-token=<your-token>
```

### 5. Accessibility Testing

Addon A11y mostra automaticamente:
- ✅ Violations
- ⚠️ Warnings
- ℹ️ Info
- Contraste de cores
- ARIA labels

---

## 🔧 Configuração Avançada

### Custom Decorators

Adicione em `.storybook/preview.tsx`:

```tsx
export const decorators = [
  (Story) => (
    <div style={{ padding: '2rem' }}>
      <Story />
    </div>
  ),
];
```

### Custom Toolbar Items

```tsx
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: ['en', 'pt'],
    },
  },
};
```

### Viewport Presets

```tsx
export const parameters = {
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px',
        },
      },
    },
  },
};
```

---

## 📊 Estatísticas

```
Stories Criadas: 64+
Componentes Documentados: 8
Variantes Totais: 40+
Addons Instalados: 4
```

---

## 🚀 Deploy

### Vercel

```bash
npm run build-storybook
# Upload pasta storybook-static/
```

### Netlify

```bash
# netlify.toml
[build]
  command = "npm run build-storybook"
  publish = "storybook-static"
```

### GitHub Pages

```bash
npm run build-storybook
cd storybook-static
git init
git add .
git commit -m "Deploy Storybook"
git branch -M main
git remote add origin <your-repo>
git push -u origin main
```

---

## 📚 Recursos

- [Storybook Docs](https://storybook.js.org/docs)
- [Next.js Integration](https://storybook.js.org/docs/get-started/nextjs)
- [Addon A11y](https://storybook.js.org/addons/@storybook/addon-a11y)
- [Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Testing](https://storybook.js.org/docs/writing-tests)

---

**Última atualização:** 2025-11-06
**Versão:** 1.0.0
