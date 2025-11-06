'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import {
  TrendingUp,
  TrendingDown,
  EventAvailable,
  AttachMoney,
  People,
  ContentCut,
  Assessment,
  CalendarMonth,
  Schedule,
  CheckCircle,
  Cancel,
  AccessTime,
} from '@mui/icons-material';
import { colors } from '@/styles/designTokens';
import {
  PageTransition,
  StaggerTransition,
  StaggerItem,
  RevealTransition,
  LoadingTransition,
} from '@/components/PageTransition';
import {
  DashboardCardSkeleton,
  ChartSkeleton,
  AppointmentCardSkeleton,
} from '@/components/SkeletonLoaders';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface Appointment {
  id: number;
  service_name: string;
  barber_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  price_charged: string;
}

interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  pendingAppointments: number;
  growthRate: number;
}

interface ChartData {
  appointmentsByDay: Array<{ name: string; appointments: number; revenue: number }>;
  appointmentsByStatus: Array<{ name: string; value: number; color: string }>;
  popularServices: Array<{ name: string; count: number; revenue: number }>;
  revenueByMonth: Array<{ month: string; revenue: number; appointments: number }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    pendingAppointments: 0,
    growthRate: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    appointmentsByDay: [],
    appointmentsByStatus: [],
    popularServices: [],
    revenueByMonth: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments/');
      const appointmentsData = response.data.results || response.data;
      setAppointments(appointmentsData);

      // Calcular estatísticas
      calculateStats(appointmentsData);
      generateChartData(appointmentsData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentsData: Appointment[]) => {
    const total = appointmentsData.length;
    const completed = appointmentsData.filter(a => a.status === 'COMPLETED').length;
    const pending = appointmentsData.filter(
      a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
    ).length;
    const revenue = appointmentsData
      .filter(a => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + parseFloat(a.price_charged || '0'), 0);

    // Simular taxa de crescimento (em produção, comparar com período anterior)
    const growthRate = completed > 0 ? ((completed / total) * 100) - 85 : 0;

    setStats({
      totalAppointments: total,
      completedAppointments: completed,
      totalRevenue: revenue,
      pendingAppointments: pending,
      growthRate,
    });
  };

  const generateChartData = (appointmentsData: Appointment[]) => {
    // Agendamentos por dia (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const appointmentsByDay = last7Days.map(date => {
      const dayAppointments = appointmentsData.filter(a => a.date === date);
      const dayRevenue = dayAppointments
        .filter(a => a.status === 'COMPLETED')
        .reduce((sum, a) => sum + parseFloat(a.price_charged || '0'), 0);

      return {
        name: new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }),
        appointments: dayAppointments.length,
        revenue: dayRevenue,
      };
    });

    // Agendamentos por status
    const statusCounts = appointmentsData.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusColors: Record<string, string> = {
      COMPLETED: colors.success[500],
      CONFIRMED: colors.primary[500],
      SCHEDULED: colors.info[500],
      IN_PROGRESS: colors.warning[500],
      CANCELLED: colors.error[500],
      NO_SHOW: colors.gray[500],
    };

    const statusLabels: Record<string, string> = {
      COMPLETED: 'Concluídos',
      CONFIRMED: 'Confirmados',
      SCHEDULED: 'Agendados',
      IN_PROGRESS: 'Em Andamento',
      CANCELLED: 'Cancelados',
      NO_SHOW: 'Não Compareceu',
    };

    const appointmentsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
      color: statusColors[status] || colors.gray[500],
    }));

    // Serviços mais populares
    const serviceCounts = appointmentsData.reduce((acc, a) => {
      if (!acc[a.service_name]) {
        acc[a.service_name] = { count: 0, revenue: 0 };
      }
      acc[a.service_name].count++;
      if (a.status === 'COMPLETED') {
        acc[a.service_name].revenue += parseFloat(a.price_charged || '0');
      }
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const popularServices = Object.entries(serviceCounts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Receita por mês (últimos 6 meses)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      };
    });

    const revenueByMonth = last6Months.map(({ month, year, monthIndex }) => {
      const monthAppointments = appointmentsData.filter(a => {
        const appointmentDate = new Date(a.date + 'T00:00:00');
        return (
          appointmentDate.getMonth() === monthIndex &&
          appointmentDate.getFullYear() === year &&
          a.status === 'COMPLETED'
        );
      });

      const revenue = monthAppointments.reduce(
        (sum, a) => sum + parseFloat(a.price_charged || '0'),
        0
      );

      return {
        month,
        revenue,
        appointments: monthAppointments.length,
      };
    });

    setChartData({
      appointmentsByDay,
      appointmentsByStatus,
      popularServices,
      revenueByMonth,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      SCHEDULED: 'info',
      CONFIRMED: 'primary',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
      NO_SHOW: 'default',
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      SCHEDULED: 'Agendado',
      CONFIRMED: 'Confirmado',
      IN_PROGRESS: 'Em Andamento',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
      NO_SHOW: 'Não Compareceu',
    };
    return labels[status] || status;
  };

  // Stat cards data
  const statCards = [
    {
      title: 'Total de Agendamentos',
      value: stats.totalAppointments,
      icon: <CalendarMonth />,
      color: colors.primary[500],
      gradient: colors.gradients.primary,
      trend: stats.growthRate > 0 ? 'up' : 'down',
      trendValue: Math.abs(stats.growthRate).toFixed(1) + '%',
    },
    {
      title: 'Agendamentos Concluídos',
      value: stats.completedAppointments,
      icon: <CheckCircle />,
      color: colors.success[500],
      gradient: colors.gradients.success,
      trend: 'up',
      trendValue: stats.totalAppointments > 0
        ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(0) + '%'
        : '0%',
    },
    {
      title: 'Receita Total',
      value: formatCurrency(stats.totalRevenue),
      icon: <AttachMoney />,
      color: colors.warning[600],
      gradient: colors.gradients.warm,
      trend: 'up',
      trendValue: '+12.5%',
    },
    {
      title: 'Agendamentos Pendentes',
      value: stats.pendingAppointments,
      icon: <AccessTime />,
      color: colors.info[500],
      gradient: colors.gradients.cool,
      trend: 'neutral',
      trendValue: 'Aguardando',
    },
  ];

  if (authLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <DashboardCardSkeleton />
            </Grid>
          ))}
          <Grid item xs={12} md={8}>
            <ChartSkeleton />
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartSkeleton />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!user) return null;

  return (
    <PageTransition variant="slideUp">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header com gradiente */}
        <RevealTransition direction="top">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: colors.gradients.barber,
              color: 'white',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <MotionBox
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" position="relative">
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Olá, {user.first_name}! 👋
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Bem-vindo ao seu dashboard. Aqui está um resumo das suas atividades.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={logout}
              >
                Sair
              </Button>
            </Box>
          </Paper>
        </RevealTransition>

        {/* Stats Cards com animação */}
        <StaggerTransition staggerDelay={0.1}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StaggerItem>
                  <LoadingTransition isLoading={loading} loader={<DashboardCardSkeleton />}>
                    <MotionCard
                      whileHover={{
                        y: -8,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      }}
                      sx={{
                        borderRadius: '20px',
                        background: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '150px',
                          height: '150px',
                          background: stat.gradient,
                          opacity: 0.1,
                          borderRadius: '50%',
                          transform: 'translate(30%, -30%)',
                        }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {stat.title}
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                              {stat.value}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              {stat.trend === 'up' && (
                                <TrendingUp fontSize="small" sx={{ color: colors.success[500] }} />
                              )}
                              {stat.trend === 'down' && (
                                <TrendingDown fontSize="small" sx={{ color: colors.error[500] }} />
                              )}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: stat.trend === 'up' ? colors.success[500] : colors.gray[600],
                                  fontWeight: 'medium',
                                }}
                              >
                                {stat.trendValue}
                              </Typography>
                            </Stack>
                          </Box>
                          <Avatar
                            sx={{
                              bgcolor: alpha(stat.color, 0.1),
                              color: stat.color,
                              width: 56,
                              height: 56,
                            }}
                          >
                            {stat.icon}
                          </Avatar>
                        </Stack>
                      </CardContent>
                    </MotionCard>
                  </LoadingTransition>
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
        </StaggerTransition>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Line Chart - Agendamentos por Dia */}
          <Grid item xs={12} md={8}>
            <RevealTransition direction="left">
              <LoadingTransition isLoading={loading} loader={<ChartSkeleton />}>
                <Card sx={{ borderRadius: '20px', p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Agendamentos nos Últimos 7 Dias
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Acompanhe a evolução dos seus agendamentos
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.appointmentsByDay}>
                      <defs>
                        <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.primary[500]} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colors.primary[500]} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                      <XAxis dataKey="name" stroke={colors.gray[600]} />
                      <YAxis stroke={colors.gray[600]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="appointments"
                        stroke={colors.primary[500]}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAppointments)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </LoadingTransition>
            </RevealTransition>
          </Grid>

          {/* Pie Chart - Status dos Agendamentos */}
          <Grid item xs={12} md={4}>
            <RevealTransition direction="right">
              <LoadingTransition isLoading={loading} loader={<ChartSkeleton />}>
                <Card sx={{ borderRadius: '20px', p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Status dos Agendamentos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Distribuição por status
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.appointmentsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.appointmentsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </LoadingTransition>
            </RevealTransition>
          </Grid>

          {/* Bar Chart - Serviços Mais Populares */}
          <Grid item xs={12} md={6}>
            <RevealTransition direction="bottom">
              <LoadingTransition isLoading={loading} loader={<ChartSkeleton />}>
                <Card sx={{ borderRadius: '20px', p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Serviços Mais Populares
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Top 5 serviços mais agendados
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.popularServices}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                      <XAxis dataKey="name" stroke={colors.gray[600]} />
                      <YAxis stroke={colors.gray[600]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Bar dataKey="count" fill={colors.secondary[500]} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </LoadingTransition>
            </RevealTransition>
          </Grid>

          {/* Line Chart - Receita Mensal */}
          <Grid item xs={12} md={6}>
            <RevealTransition direction="bottom" delay={0.1}>
              <LoadingTransition isLoading={loading} loader={<ChartSkeleton />}>
                <Card sx={{ borderRadius: '20px', p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Receita Mensal
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Últimos 6 meses
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} />
                      <XAxis dataKey="month" stroke={colors.gray[600]} />
                      <YAxis stroke={colors.gray[600]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={colors.success[500]}
                        strokeWidth={3}
                        dot={{ fill: colors.success[500], r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </LoadingTransition>
            </RevealTransition>
          </Grid>
        </Grid>

        {/* Últimos Agendamentos */}
        <RevealTransition direction="bottom">
          <Card sx={{ borderRadius: '20px', p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Últimos Agendamentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe seus agendamentos mais recentes
                </Typography>
              </Box>
              {appointments.length > 3 && (
                <Button variant="outlined" onClick={() => router.push('/appointments/history')}>
                  Ver Todos
                </Button>
              )}
            </Box>

            <LoadingTransition
              isLoading={loading}
              loader={
                <Stack spacing={2}>
                  {[...Array(3)].map((_, i) => (
                    <AppointmentCardSkeleton key={i} />
                  ))}
                </Stack>
              }
            >
              {appointments.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <CalendarMonth sx={{ fontSize: 80, color: colors.gray[300], mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhum agendamento encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Comece agendando seu primeiro horário
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/appointments/new')}
                  >
                    Fazer Agendamento
                  </Button>
                </Box>
              ) : (
                <StaggerTransition>
                  <Grid container spacing={2}>
                    {appointments.slice(0, 3).map((appointment, index) => (
                      <Grid item xs={12} key={appointment.id}>
                        <StaggerItem>
                          <MotionCard
                            variant="outlined"
                            whileHover={{ scale: 1.02 }}
                            sx={{ borderRadius: '16px' }}
                          >
                            <CardContent>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: alpha(colors.primary[500], 0.1),
                                    color: colors.primary[500],
                                    width: 56,
                                    height: 56,
                                  }}
                                >
                                  <ContentCut />
                                </Avatar>
                                <Box flex={1}>
                                  <Typography variant="h6" gutterBottom>
                                    {appointment.service_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Barbeiro: {appointment.barber_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    📅 {formatDate(appointment.date)} às {appointment.start_time}
                                  </Typography>
                                </Box>
                                <Box textAlign="right">
                                  <Chip
                                    label={getStatusLabel(appointment.status)}
                                    color={getStatusColor(appointment.status)}
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                  <Typography variant="h6" color="primary" fontWeight="bold">
                                    {formatCurrency(parseFloat(appointment.price_charged || '0'))}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardContent>
                          </MotionCard>
                        </StaggerItem>
                      </Grid>
                    ))}
                  </Grid>
                </StaggerTransition>
              )}
            </LoadingTransition>
          </Card>
        </RevealTransition>
      </Container>
    </PageTransition>
  );
}
