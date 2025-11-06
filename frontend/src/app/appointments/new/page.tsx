'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: string;
  image?: string;
}

interface Barber {
  id: number;
  full_name: string;
  email: string;
}

const steps = ['Selecione o Serviço', 'Escolha o Barbeiro', 'Data e Horário', 'Confirmação'];

export default function NewAppointmentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadServices();
      loadBarbers();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      const response = await api.get('/services/?is_active=true');
      setServices(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBarbers = async () => {
    try {
      const response = await api.get('/users/barbers/');
      setBarbers(response.data);
    } catch (err) {
      console.error('Erro ao carregar barbeiros:', err);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !selectedBarber || !selectedService) return;

    try {
      const response = await api.get('/appointments/available_slots/', {
        params: {
          barber: selectedBarber,
          date: selectedDate,
          service: selectedService.id,
        },
      });
      setAvailableSlots(response.data.available_slots || []);
    } catch (err) {
      console.error('Erro ao carregar horários:', err);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedBarber && selectedService) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedBarber, selectedService]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    handleNext();
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/appointments/', {
        service: selectedService.id,
        barber: selectedBarber,
        date: selectedDate,
        start_time: selectedTime,
      });

      router.push('/dashboard?appointment=success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail ||
                       err.response?.data?.non_field_errors?.[0] ||
                       'Erro ao criar agendamento.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            {loading ? (
              <Box display="flex" justifyContent="center" width="100%" py={4}>
                <CircularProgress />
              </Box>
            ) : services.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">Nenhum serviço disponível no momento.</Alert>
              </Grid>
            ) : (
              services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      border: selectedService?.id === service.id ? 2 : 0,
                      borderColor: 'primary.main',
                      '&:hover': {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleServiceSelect(service)}
                  >
                    {service.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={service.image}
                        alt={service.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {service.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={`${service.duration} min`} size="small" />
                        <Typography variant="h6" color="primary">
                          R$ {service.price}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Serviço selecionado: {selectedService?.name}
            </Typography>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Escolha o Barbeiro</InputLabel>
              <Select
                value={selectedBarber || ''}
                onChange={(e) => setSelectedBarber(Number(e.target.value))}
                label="Escolha o Barbeiro"
              >
                {barbers.map((barber) => (
                  <MenuItem key={barber.id} value={barber.id}>
                    {barber.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleBack}>
                Voltar
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedBarber}
              >
                Continuar
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Barbeiro: {barbers.find(b => b.id === selectedBarber)?.full_name}
            </Typography>

            <TextField
              fullWidth
              type="date"
              label="Data do Agendamento"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              sx={{ mt: 3 }}
            />

            {selectedDate && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Horários Disponíveis:
                </Typography>
                {availableSlots.length === 0 ? (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Nenhum horário disponível para esta data. O barbeiro pode estar com a agenda bloqueada ou todos os horários já estão ocupados.
                  </Alert>
                ) : (
                  <Grid container spacing={1}>
                    {availableSlots.map((slot) => (
                      <Grid item xs={4} sm={3} md={2} key={slot}>
                        <Button
                          fullWidth
                          variant={selectedTime === slot ? 'contained' : 'outlined'}
                          onClick={() => setSelectedTime(slot)}
                          size="small"
                        >
                          {slot}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleBack}>
                Voltar
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
              >
                Continuar
              </Button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" gutterBottom align="center" color="primary">
              Confirme seu Agendamento
            </Typography>

            <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Serviço
                  </Typography>
                  <Typography variant="h6">{selectedService?.name}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Barbeiro
                  </Typography>
                  <Typography variant="h6">
                    {barbers.find(b => b.id === selectedBarber)?.full_name}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Data
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Horário
                  </Typography>
                  <Typography variant="body1">{selectedTime}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duração
                  </Typography>
                  <Typography variant="body1">{selectedService?.duration} minutos</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Valor
                  </Typography>
                  <Typography variant="h6" color="primary">
                    R$ {selectedService?.price}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleBack} disabled={submitting}>
                Voltar
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                fullWidth
              >
                {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.push('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Novo Agendamento
          </Typography>
          <Box sx={{ width: 48 }} /> {/* Spacer for centering */}
        </Box>

        <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          {renderStepContent()}
        </Paper>
      </Box>
    </Container>
  );
}
