Backlog – Funcionalidades pendentes
🔹 Épico 1 – Autenticação e Usuários

 Criar tela de login (frontend React) integrada à API /api/auth/login/.

 Criar tela de registro de cliente (frontend) integrada à API /api/auth/register/.

 Criar tela de registro de barbeiro (frontend) restrita ao admin.

 Criar página de recuperação de senha (frontend).

🔹 Épico 2 – Serviços

 Criar tela CRUD de serviços no dashboard do admin:

 Listar serviços.

 Criar novo serviço (título, valor, imagem).

 Editar serviço existente.

 Excluir serviço.

 Exibir lista de serviços disponíveis no fluxo de agendamento do cliente.

🔹 Épico 3 – Agendamento

 Página de agendamento do cliente:

 Selecionar barbeiro.

 Selecionar serviço.

 Selecionar data.

 Selecionar horário disponível.

 Confirmar agendamento (POST /api/appointments/).

 Página de histórico de agendamentos do cliente.

 Página de cancelamento de agendamento (frontend integrado à API).

🔹 Épico 4 – Dashboard do Barbeiro

 Tela de agenda semanal com todos os horários.

 Tela para bloquear horários/dias indisponíveis.

 Relatório individual de atendimentos realizados.

 Relatório de ganhos por período (mensal, semanal).

🔹 Épico 5 – Dashboard do Admin

 Tela de overview com resumo financeiro (total faturado no mês, nº de atendimentos).

 Tela de gerenciamento de barbeiros (CRUD).

 Tela de visualização de todos os agendamentos.

 Relatório macro de faturamento por barbeiro.

 Relatório macro de faturamento por serviço.

🔹 Épico 6 – Notificações

 Implementar envio de email/SMS ao cliente após agendamento.

 Implementar envio de email/SMS ao barbeiro após novo agendamento.

 Implementar notificação de cancelamento para cliente e barbeiro.

🔹 Épico 7 – Infra & Deploy (ajustes finais)

 Configurar variáveis de ambiente específicas para produção (separar do dev e homolog).

 Configurar logs e monitoramento (Django + containers).

 Automatizar migrações no docker-compose de produção.