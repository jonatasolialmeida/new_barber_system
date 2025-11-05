import { Box, Card, CardContent, Grid, Skeleton, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Card Skeleton - Para cards de serviços, agendamentos, etc
export function CardSkeleton() {
  return (
    <Card sx={{ borderRadius: '24px' }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton
          variant="circular"
          width={80}
          height={80}
          sx={{ mx: 'auto', mb: 2 }}
          animation="wave"
        />
        <Skeleton variant="text" height={32} width="80%" sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" height={20} width="90%" sx={{ mx: 'auto' }} />
      </CardContent>
    </Card>
  );
}

// Service Card Skeleton - Para lista de serviços
export function ServiceCardSkeleton() {
  return (
    <Card sx={{ borderRadius: '16px', height: '100%' }}>
      <Skeleton variant="rectangular" height={140} animation="wave" />
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" height={28} width="70%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="100%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="90%" sx={{ mb: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="text" width={60} height={28} />
        </Stack>
      </CardContent>
    </Card>
  );
}

// Table Row Skeleton - Para tabelas de dados
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      {[...Array(columns)].map((_, i) => (
        <Skeleton key={i} variant="text" height={24} sx={{ flex: 1 }} animation="wave" />
      ))}
    </Box>
  );
}

// Dashboard Card Skeleton - Para cards do dashboard
export function DashboardCardSkeleton() {
  return (
    <Card sx={{ borderRadius: '16px', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={80} height={40} />
        </Box>
        <Skeleton variant="circular" width={48} height={48} />
      </Stack>
      <Skeleton variant="text" width="60%" height={20} />
    </Card>
  );
}

// List Item Skeleton - Para listas
export function ListItemSkeleton() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
      <Skeleton variant="circular" width={48} height={48} animation="wave" />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="50%" height={20} />
      </Box>
      <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: '8px' }} />
    </Box>
  );
}

// Profile Skeleton - Para perfil de usuário
export function ProfileSkeleton() {
  return (
    <Card sx={{ borderRadius: '16px' }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} animation="wave" />
        <Skeleton variant="text" height={32} width="60%" sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" height={20} width="40%" sx={{ mx: 'auto', mb: 3 }} />

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Form Skeleton - Para formulários
export function FormSkeleton() {
  return (
    <Card sx={{ borderRadius: '16px' }}>
      <CardContent sx={{ p: 4 }}>
        <Skeleton variant="text" height={32} width="40%" sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Box key={i}>
              <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '8px' }} animation="wave" />
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" height={48} sx={{ flex: 1, borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={48} sx={{ flex: 1, borderRadius: '8px' }} />
        </Box>
      </CardContent>
    </Card>
  );
}

// Page Skeleton - Para páginas completas
export function PageSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={500} height={24} />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <DashboardCardSkeleton />
          </Grid>
        ))}
      </Grid>

      {/* Content Cards */}
      <Grid container spacing={3}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Animated Skeleton - Com animação personalizada
export function AnimatedSkeleton() {
  return (
    <MotionBox
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <CardSkeleton />
    </MotionBox>
  );
}

// Appointment Card Skeleton - Para cards de agendamento
export function AppointmentCardSkeleton() {
  return (
    <Card sx={{ borderRadius: '16px', mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Skeleton variant="circular" width={56} height={56} animation="wave" />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={100} height={24} />
          <Skeleton variant="rounded" width={100} height={24} />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: '8px' }} />
        </Stack>
      </CardContent>
    </Card>
  );
}

// Chart Skeleton - Para gráficos
export function ChartSkeleton() {
  return (
    <Card sx={{ borderRadius: '16px', p: 3 }}>
      <Skeleton variant="text" width={200} height={28} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '8px' }} animation="wave" />
    </Card>
  );
}

// Grid Skeleton - Grid de cards
export function GridSkeleton({ items = 6, columns = 3 }: { items?: number; columns?: number }) {
  return (
    <Grid container spacing={3}>
      {[...Array(items)].map((_, i) => (
        <Grid item xs={12} sm={6} md={12 / columns} key={i}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export default {
  CardSkeleton,
  ServiceCardSkeleton,
  TableRowSkeleton,
  DashboardCardSkeleton,
  ListItemSkeleton,
  ProfileSkeleton,
  FormSkeleton,
  PageSkeleton,
  AnimatedSkeleton,
  AppointmentCardSkeleton,
  ChartSkeleton,
  GridSkeleton,
};
