# 📧 Como Configurar Email no Sistema

## 🔧 Configuração Atual (Desenvolvimento)

Por padrão, o sistema está configurado para usar `console.EmailBackend`, o que significa que **os emails aparecem no terminal** do Docker ao invés de serem enviados de verdade.

Isso é perfeito para desenvolvimento e testes!

## 📬 Como Ver os Emails Durante Desenvolvimento

1. Quando você criar ou cancelar um agendamento, o email será "enviado"
2. Abra o terminal onde o Docker está rodando (backend)
3. Você verá o conteúdo completo do email no console

Exemplo:
```
Content-Type: text/plain; charset="utf-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Subject: Agendamento Confirmado - Corte + Barba
From: noreply@barbershop.com
To: cliente@email.com
Date: Sat, 05 Oct 2024 14:30:00 -0000

Olá João Silva,

Seu agendamento foi confirmado com sucesso!
...
```

## 🚀 Configurar Gmail para Produção

### Passo 1: Criar Senha de App no Gmail

1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá em **Segurança**
3. Ative a **Verificação em duas etapas** (se ainda não estiver ativa)
4. Depois de ativar, volte em **Segurança**
5. Procure por **Senhas de app** (App Passwords)
6. Selecione **Outro (nome personalizado)**
7. Digite: "Sistema Barbearia"
8. Clique em **Gerar**
9. Copie a senha de 16 caracteres gerada

### Passo 2: Configurar o Arquivo `.env`

Abra o arquivo `backend/.env` e modifique:

```env
# Mude de console.EmailBackend para smtp.EmailBackend
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

# Configure seu email
EMAIL_HOST_USER=seu_email@gmail.com

# Cole a senha de app gerada (16 caracteres sem espaços)
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop

# Configure o email de envio
DEFAULT_FROM_EMAIL=noreply@barbershop.com

# Email do admin (opcional)
ADMIN_EMAIL=admin@barbershop.com
```

### Passo 3: Reiniciar o Backend

```bash
cd backend
docker compose restart backend
```

## ✅ Testar se Funcionou

1. Faça login no sistema
2. Crie um novo agendamento
3. Verifique a caixa de entrada do email do cliente
4. Verifique a caixa de entrada do email do barbeiro

**Se os emails não chegarem:**
- Verifique a pasta de SPAM
- Confirme que a senha de app foi copiada corretamente
- Verifique os logs do Docker: `docker compose logs backend`

## 🔐 Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` com suas credenciais reais
- ✅ O `.env` já está no `.gitignore`
- ✅ Use sempre senhas de app, nunca sua senha real do Gmail
- ✅ Em produção, considere usar serviços como SendGrid, Mailgun, ou AWS SES

## 📝 Outros Provedores de Email

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu_email@outlook.com
EMAIL_HOST_PASSWORD=sua_senha
```

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.sua_api_key_aqui
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=postmaster@seu-dominio.mailgun.org
EMAIL_HOST_PASSWORD=sua_senha_mailgun
```

## 🧪 Testando Manualmente

Para testar o envio de email manualmente pelo Django shell:

```bash
docker compose exec backend python manage.py shell
```

Depois execute:

```python
from django.core.mail import send_mail

send_mail(
    'Teste de Email',
    'Este é um email de teste do sistema.',
    'noreply@barbershop.com',
    ['seu_email@gmail.com'],
    fail_silently=False,
)
```

Se não der erro, o email foi enviado com sucesso!

## 📊 Status das Notificações

O sistema envia emails automáticos para:

✅ **Cliente** quando:
- Criar um novo agendamento (confirmação)
- Agendamento for cancelado (por qualquer pessoa)

✅ **Barbeiro** quando:
- Receber um novo agendamento
- Agendamento for cancelado (por qualquer pessoa)

## ⚙️ Preferências de Notificação

Os usuários podem desativar notificações por email no perfil deles através dos campos:
- `receive_email_notifications`
- `receive_sms_notifications` (preparado para futuro)
- `receive_whatsapp_notifications` (preparado para futuro)

## 🔄 Voltar para Console (Desenvolvimento)

Para voltar a ver emails no console ao invés de enviar de verdade:

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

E reinicie o backend.
