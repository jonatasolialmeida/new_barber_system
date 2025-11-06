# 🚀 Setup & Testing Guide

Guia completo para configurar, executar e testar todas as funcionalidades do Barber System Frontend.

---

## 📦 Instalação

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

Isso instalará:
- ✅ Next.js 15 com App Router
- ✅ Material-UI 6 (componentes e ícones)
- ✅ React Hook Form + Zod (validação)
- ✅ Framer Motion (animações)
- ✅ React Query (gerenciamento de estado)
- ✅ Recharts (gráficos)
- ✅ Storybook 8 (documentação de componentes)
- ✅ Webpack Bundle Analyzer (análise de bundle)

---

## 🏃 Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Modo Produção

```bash
npm run build
npm run start
```

**Importante:** PWA só funciona em produção (HTTPS ou localhost)

---

## 📚 Storybook - Design System

### Iniciar Storybook

```bash
npm run storybook
```

Acesse: [http://localhost:6006](http://localhost:6006)

### Build Storybook (Produção)

```bash
npm run build-storybook
```

Gera pasta `storybook-static/` pronta para deploy.

### O que você verá

- **Button** (15+ stories): Variants, sizes, states, gradients, glow
- **Card** (12+ stories): Elevated, outlined, gradient, glass, hover
- **Input** (17+ stories): Variants, validation, password toggle, masks
- **EmptyState** (20+ stories): Pre-configured states, illustrations

**Total: 64+ stories documentadas**

### Addons Disponíveis

1. **Controls**: Controles interativos para props
2. **Actions**: Log de eventos (onClick, onChange, etc)
3. **Viewport**: Preview responsivo (mobile, tablet, desktop)
4. **Backgrounds**: Alternar backgrounds (light/dark)
5. **A11y (Accessibility)**: Testes automáticos de acessibilidade
6. **Docs**: Documentação automática com exemplos

---

## 🎨 PWA - Progressive Web App

### Testando PWA

#### Pré-requisitos

1. Build de produção
2. HTTPS ou localhost
3. Service Worker registrado

#### Passo a Passo

```bash
# 1. Build de produção
npm run build

# 2. Iniciar em produção
npm run start
```

#### Verificar Instalação

1. Abra Chrome DevTools (F12)
2. Vá em **Application** > **Service Workers**
3. Verifique se `sw.js` está **activated and running**

#### Testar Instalação do PWA

1. Aguarde 30 segundos após carregar a página
2. Verá notificação: "Instale o Barber System no seu dispositivo"
3. Clique em **Instalar**
4. Ícone do app aparecerá no desktop/home screen

**Ou:**

1. Chrome: Ícone ⊕ na barra de endereços
2. Menu: **Instalar Barber System**

#### Testar Modo Offline

```bash
# 1. Com app rodando, abra DevTools (F12)
# 2. Vá em Application > Service Workers
# 3. Marque "Offline"
# 4. Navegue pela aplicação
```

**Páginas em cache (funcionam offline):**
- `/` - Home
- `/login` - Login
- `/register` - Registro
- `/dashboard` - Dashboard
- `/offline` - Página de fallback

**Teste:**
1. Visite `/dashboard` online
2. Ative modo offline no DevTools
3. Recarregue a página → deve funcionar
4. Tente ir para uma página não visitada → verá `/offline`

#### Testar Background Sync

```bash
# 1. Abra DevTools > Application > Service Workers
# 2. Marque "Offline"
# 3. Tente criar um agendamento
# 4. Deve ser adicionado à fila
# 5. Desmarque "Offline"
# 6. Sync automático enviará o agendamento
```

#### Verificar Cache

```bash
# DevTools > Application > Cache Storage
```

Você verá:
- **barber-system-v1**: App shell (HTML, CSS, JS)
- **runtime-cache**: Assets dinâmicos
- **api-cache**: Respostas de API

#### Limpar Cache Manualmente

Console do DevTools:
```javascript
navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
```

---

## ♿ Acessibilidade (A11y)

### Recursos Implementados

#### 1. Skip Links (Navegação por Teclado)

**Como testar:**
1. Carregue qualquer página
2. Pressione **Tab**
3. Verá links "Pular para..." no topo
4. Navegue para conteúdo principal, navegação, ou rodapé

**Funciona com:**
- Screen readers (NVDA, JAWS, VoiceOver)
- Navegação por teclado

#### 2. Focus Trap (Modais/Dialogs)

**Como testar:**
1. Abra um modal/dialog
2. Pressione **Tab** → foco fica no modal
3. Pressione **Shift+Tab** → cicla ao contrário
4. Pressione **Escape** → fecha o modal

#### 3. Screen Reader Support

**Anúncios Dinâmicos:**
- Sucesso ao salvar: "Salvo com sucesso"
- Erro: "Ocorreu um erro"
- Loading: "Carregando..."

**Como testar (com NVDA/JAWS):**
1. Ative o screen reader
2. Execute ações (submit form, carregar dados)
3. Ouça os anúncios

#### 4. Keyboard Navigation

**Atalhos disponíveis:**
- **Tab**: Próximo elemento
- **Shift+Tab**: Elemento anterior
- **Enter**: Ativar botão/link
- **Space**: Ativar checkbox/radio
- **Escape**: Fechar modal/dropdown
- **Arrow Keys**: Navegar em menus/selects

#### 5. ARIA Labels

Todos os componentes possuem:
- `aria-label` ou `aria-labelledby`
- `aria-describedby` para hints/errors
- `aria-invalid` para campos com erro
- `aria-required` para campos obrigatórios
- `aria-live` para anúncios dinâmicos

#### 6. Storybook A11y Addon

**Como usar:**
1. Execute `npm run storybook`
2. Abra qualquer story
3. Clique na aba **Accessibility** no painel inferior
4. Veja violations, passes, e incomplete

**O que é verificado:**
- Contraste de cores (WCAG AAA)
- ARIA labels
- Keyboard navigation
- Form labels
- Heading hierarchy

---

## ⚡ Performance

### Bundle Analyzer

Analise o tamanho do bundle:

```bash
ANALYZE=true npm run build
```

Abrirá automaticamente `bundle-analysis.html` no navegador.

**O que verificar:**
- Pacotes maiores que 100KB
- Duplicação de código
- Oportunidades de code splitting

### Lighthouse Audit

```bash
# 1. Build de produção
npm run build && npm run start

# 2. Abra Chrome DevTools (F12)
# 3. Vá em "Lighthouse"
# 4. Selecione: Performance, Accessibility, Best Practices, SEO, PWA
# 5. Clique "Analyze page load"
```

**Metas:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 90+
- PWA: 100

### Core Web Vitals

**LCP (Largest Contentful Paint):** < 2.5s
- Maior elemento visível na tela

**FID (First Input Delay):** < 100ms
- Tempo até interação

**CLS (Cumulative Layout Shift):** < 0.1
- Estabilidade visual

**Verificar:**
```bash
# DevTools > Lighthouse > Performance
```

### Otimizações Implementadas

✅ **SWC Minification** - Mais rápido que Terser
✅ **Console.log removal** - Produção (mantém error/warn)
✅ **CSS Optimization** - Experimental
✅ **Package Import Optimization** - MUI, framer-motion, recharts
✅ **Image Optimization** - WebP, AVIF, 8 device sizes
✅ **Static Asset Caching** - max-age=31536000
✅ **Gzip/Brotli Compression** - next.config.ts

---

## 🧪 Testing Checklist

### Funcionalidades Gerais

- [ ] Login com validação Zod
- [ ] Registro com validação de senha forte
- [ ] Dark mode funcionando em todas as páginas
- [ ] Animações suaves (framer-motion)
- [ ] Toast notifications (sucesso/erro)
- [ ] Loading states em botões
- [ ] Empty states em listagens vazias

### Responsividade

- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)
- [ ] Breakpoints MUI funcionando

### Acessibilidade

- [ ] Skip links visíveis ao pressionar Tab
- [ ] Navegação completa por teclado
- [ ] Focus trap em modais
- [ ] ARIA labels presentes
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Storybook A11y addon sem violations

### PWA

- [ ] Service Worker registrado
- [ ] Prompt de instalação aparece após 30s
- [ ] App instalável via browser
- [ ] Funciona offline (páginas visitadas)
- [ ] Página /offline aparece quando offline
- [ ] Cache estratégias funcionando
- [ ] Ícones 192x192 e 512x512 presentes

### Performance

- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse PWA: 100
- [ ] Bundle analyzer sem pacotes gigantes
- [ ] Imagens otimizadas (WebP/AVIF)
- [ ] First Load JS < 200KB
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

## 🐛 Troubleshooting

### Service Worker não está registrando

**Solução:**
```bash
# 1. Verificar se está em produção
# 2. Limpar cache e service workers antigos
# DevTools > Application > Service Workers > Unregister
# DevTools > Application > Storage > Clear site data
# 3. Recarregar página
```

### PWA não mostra prompt de instalação

**Verificar:**
- [ ] Está em HTTPS ou localhost
- [ ] manifest.json carregado (DevTools > Application > Manifest)
- [ ] Service Worker ativo
- [ ] Ícones 192x192 e 512x512 presentes
- [ ] Aguardou 30 segundos
- [ ] Não instalou anteriormente (localStorage)

### Storybook não inicia

**Solução:**
```bash
# 1. Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json

# 2. Reinstalar
npm install

# 3. Limpar cache
npm cache clean --force

# 4. Reiniciar
npm run storybook
```

### Erro de importação "@/..."

**Solução:**
- Verificar `tsconfig.json` possui `"@/*": ["./src/*"]`
- Verificar `.storybook/main.ts` possui alias configurado

### Bundle muito grande

**Solução:**
```bash
# 1. Analisar bundle
ANALYZE=true npm run build

# 2. Verificar imports
# Ruim: import { Button } from '@mui/material';
# Bom: import Button from '@mui/material/Button';

# 3. Lazy loading
const Component = dynamic(() => import('./Component'), { ssr: false });
```

---

## 📖 Documentação Adicional

### Arquivos de Documentação

- **COMPONENTS.md** - Guia completo de componentes (867 linhas)
- **STORYBOOK.md** - Guia do Storybook (373 linhas)
- **SETUP.md** - Este arquivo

### Recursos Externos

- [Next.js Docs](https://nextjs.org/docs)
- [Material-UI Docs](https://mui.com/material-ui/)
- [Storybook Docs](https://storybook.js.org/docs)
- [PWA Docs](https://web.dev/progressive-web-apps/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 🎯 Próximos Passos Sugeridos

### Funcionalidades

- [ ] Implementar testes unitários (Jest + Testing Library)
- [ ] Adicionar testes E2E (Playwright/Cypress)
- [ ] Implementar autenticação com refresh token
- [ ] Adicionar i18n (internacionalização)
- [ ] Implementar rate limiting
- [ ] Adicionar analytics (GA4, Mixpanel)

### Componentes

- [ ] Refatorar páginas restantes com novos componentes
- [ ] Criar mais stories no Storybook
- [ ] Adicionar visual regression tests (Chromatic)
- [ ] Criar component library package (@barber/ui)

### Performance

- [ ] Implementar ISR (Incremental Static Regeneration)
- [ ] Server Components onde aplicável
- [ ] Streaming SSR
- [ ] Edge Runtime para rotas estáticas
- [ ] CDN caching strategy

### DevOps

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deploy automático (Vercel/Netlify)
- [ ] Storybook deploy (Chromatic)
- [ ] Error tracking (Sentry)
- [ ] Monitoring (Datadog, New Relic)

---

**Última atualização:** 2025-11-06
**Versão:** 2.0.0
**Status:** ✅ Produção Ready
