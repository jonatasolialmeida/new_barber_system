# 📦 Análise de Pacotes - Versões Desatualizadas

Análise realizada em: **06/11/2025**

---

## ✅ Pacotes Atualizados

Estes pacotes já estão nas versões mais recentes:

| Pacote | Versão Atual | Status |
|--------|--------------|--------|
| **react** | 19.2.0 | ✅ Latest (Oct 2025) |
| **react-dom** | 19.2.0 | ✅ Latest |
| **@tanstack/react-query** | 5.17.19 → 5.90.7 | ✅ Latest minor |
| **react-hook-form** | 7.49.3 → 7.66.0 | ✅ Latest minor |
| **date-fns** | 4.1.0 | ✅ Latest |
| **axios** | 1.7.9 → 1.13.2 | ✅ Latest minor |
| **react-hot-toast** | 2.4.1 → 2.6.0 | ✅ Latest minor |
| **@emotion/react** | 11.13.5 → 11.14.0 | ✅ Latest minor |
| **@emotion/styled** | 11.13.5 → 11.14.1 | ✅ Latest minor |

---

## ⚠️ Pacotes com Updates MAJOR (Breaking Changes)

### 🔴 CRÍTICO - Mudanças Importantes

#### 1. **Next.js**
- **Atual:** 15.1.4
- **Latest:** 16.0.1 (Released Nov 2025)
- **Impact:** 🔴 HIGH
- **Breaking Changes:**
  - Turbopack agora é estável e padrão
  - Changes in metadata API
  - Novos padrões de cache
- **Ação:** Requer teste extensivo

#### 2. **Material-UI (MUI)** - v6 → v7
- **@mui/material:** 6.3.0 → 7.3.5
- **@mui/icons-material:** 6.3.0 → 7.3.5
- **@mui/material-nextjs:** 6.3.0 → 7.3.5
- **Impact:** 🔴 HIGH
- **Breaking Changes:**
  - Package layout atualizado (ESM completo)
  - CSS Layers support
  - APIs depreciadas removidas
  - Melhor integração com Tailwind CSS v4
- **Released:** March 2025
- **Ação:** Seguir [guia de migração v7](https://mui.com/material-ui/migration/upgrade-to-v7/)

#### 3. **MUI X Date Pickers**
- **Atual:** 7.23.2
- **Latest:** 8.17.0
- **Impact:** 🟡 MEDIUM
- **Breaking Changes:** API changes para pickers
- **Ação:** Revisar componentes de data

#### 4. **Framer Motion** → Motion
- **Atual:** 11.0.3
- **Latest:** 12.23.24
- **Impact:** 🟡 MEDIUM
- **Breaking Changes:**
  - Rebranding: `framer-motion` → `motion`
  - Layout animations melhorado para React 19
  - API de variantes refinada
- **Ação:** Considerar migrar para pacote `motion`

#### 5. **Zod**
- **Atual:** 3.22.4
- **Latest:** 4.1.12
- **Impact:** 🟡 MEDIUM
- **Breaking Changes:** Mudanças na API de validação
- **Ação:** Revisar todos os schemas

#### 6. **Recharts**
- **Atual:** 2.12.0
- **Latest:** 3.3.0
- **Impact:** 🟡 MEDIUM
- **Breaking Changes:** API de gráficos atualizada
- **Ação:** Testar dashboard e visualizações

#### 7. **@hookform/resolvers**
- **Atual:** 3.3.4
- **Latest:** 5.2.2
- **Impact:** 🟢 LOW
- **Breaking Changes:** Integração com Zod 4
- **Ação:** Atualizar junto com Zod

#### 8. **Storybook**
- **Atual:** 8.0.0
- **Latest:** 8.6.0 (or 10.0.4)
- **Impact:** 🟡 MEDIUM
- **Breaking Changes:**
  - v10 é ESM-only
  - 29% menor install size
  - Storybook Test melhorado
- **Ação:** Considerar upgrade para 8.6 ou esperar estabilidade do 10.x

---

## 📊 Resumo de Impacto

### Por Categoria:

**🔴 Alto Impacto (Teste Extensivo Necessário):**
- Next.js 15 → 16
- MUI 6 → 7

**🟡 Médio Impacto (Teste Moderado):**
- Framer Motion 11 → 12
- Zod 3 → 4
- Recharts 2 → 3
- MUI X Date Pickers 7 → 8
- Storybook 8 → 10

**🟢 Baixo Impacto (Patch/Minor):**
- React Query, React Hook Form, Axios, etc.

---

## 🎯 Estratégia de Atualização Recomendada

### Fase 1: Updates Seguros (Baixo Risco)
```bash
npm update @emotion/react @emotion/styled
npm update @tanstack/react-query @tanstack/react-query-devtools
npm update react-hook-form axios react-hot-toast
```

### Fase 2: MUI v7 (Alto Impacto)
```bash
npm install @mui/material@^7.3.5 @mui/icons-material@^7.3.5 @mui/material-nextjs@^7.3.5
npm install @mui/x-date-pickers@^8.17.0
```
**Depois:** Rodar todos os componentes e testes

### Fase 3: Next.js 16 (Crítico)
```bash
npm install next@^16.0.1
```
**Depois:** Teste completo da aplicação

### Fase 4: Outras Libraries
```bash
npm install framer-motion@^12.23.24  # ou motion
npm install zod@^4.1.12
npm install @hookform/resolvers@^5.2.2
npm install recharts@^3.3.0
```

### Fase 5: Storybook (Opcional)
```bash
npx storybook@latest upgrade
# ou
npm install storybook@^10.0.4
```

---

## ⚡ Recomendação Imediata

### Opção 1: Atualização Conservadora (Recomendado)
Atualizar apenas os **patches e minors** (baixo risco):
- ✅ React Query 5.17 → 5.90
- ✅ React Hook Form 7.49 → 7.66
- ✅ Emotion, Axios, Toast
- ⏳ Manter MUI v6, Next 15, Zod 3

**Vantagem:** Zero breaking changes, app continua funcionando
**Desvantagem:** Fica em versões antigas das principais libs

### Opção 2: Atualização Completa (Arriscado mas Moderno)
Atualizar tudo para latest:
- 🔴 Next.js 16
- 🔴 MUI v7
- 🟡 Zod 4, Framer Motion 12, Recharts 3

**Vantagem:** Stack completamente atualizado, novos recursos
**Desvantagem:** Requer refatoração significativa, testes extensivos

### Opção 3: Híbrida (Balanceado) ⭐ RECOMENDADO
Atualizar o que é crítico, adiar o arriscado:
- ✅ Patches/minors: React Query, React Hook Form, etc.
- ✅ **MUI v7** (vale a pena pela melhoria ESM e Tailwind)
- ⏳ **Adiar Next.js 16** (muito recente, esperar 16.1+)
- ⏳ **Adiar Zod 4** (aguardar estabilização)
- ✅ **Framer Motion 12** (safe upgrade)

---

## 🔍 Checklist Pós-Atualização

- [ ] `npm install` sem erros
- [ ] `npm run dev` inicia sem warnings
- [ ] `npm run build` compila com sucesso
- [ ] `npm run storybook` funciona (se atualizar Storybook)
- [ ] Todas as páginas carregam corretamente
- [ ] Login/Register funcionando
- [ ] Dashboard renderiza
- [ ] Dark mode funciona
- [ ] Formulários validam corretamente
- [ ] PWA ainda funciona
- [ ] Service Worker registra
- [ ] Lighthouse score mantido (90+)

---

## 📚 Links de Migração

### Next.js 16
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Upgrading Guide](https://nextjs.org/docs/upgrading)

### MUI v7
- [MUI v7 Release](https://mui.com/blog/material-ui-v7-is-here/)
- [Migration Guide v6 → v7](https://mui.com/material-ui/migration/upgrade-to-v7/)

### Framer Motion → Motion
- [Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide)
- [Breaking Changes](https://motion.dev/docs/upgrade-guide)

### Zod 4
- [Zod GitHub Releases](https://github.com/colinhacks/zod/releases)

### Recharts 3
- [Recharts Releases](https://github.com/recharts/recharts/releases)

---

## 💡 Conclusão

Sua aplicação está rodando versões **relativamente recentes** mas não **latest**:

- ✅ **React 19.2** - Perfeito!
- ⚠️ **Next.js 15.1** - Funcional, mas 16 já saiu
- ⚠️ **MUI v6** - v7 trouxe melhorias importantes (ESM, CSS Layers)
- ⚠️ **Zod 3** - v4 é breaking, pode aguardar
- ⚠️ **Storybook 8** - v10 é ESM-only, pode aguardar

**Recomendação Final:**
Faça a **Opção 3 (Híbrida)** - atualizar MUI v7 e patches/minors, mas manter Next.js 15 e Zod 3 por enquanto. Isso te dá modernidade sem grandes quebras.
