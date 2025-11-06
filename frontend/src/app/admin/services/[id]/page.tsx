'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  GridLegacy as Grid,
  Alert,
  CircularProgress,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id;
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    is_active: true,
  });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not owner
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'OWNER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'OWNER') {
      loadService();
    }
  }, [user]);

  const loadService = async () => {
    try {
      const response = await api.get(`/services/${serviceId}/`);
      const service = response.data;
      setFormData({
        name: service.name,
        description: service.description || '',
        duration: service.duration.toString(),
        price: service.price,
        is_active: service.is_active,
      });
      if (service.image) {
        setCurrentImage(service.image);
      }
    } catch (err: any) {
      setError('Erro ao carregar serviço.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('is_active', formData.is_active.toString());

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await api.put(`/services/${serviceId}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/admin/services');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail ||
                       err.response?.data?.name?.[0] ||
                       'Erro ao atualizar serviço.';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // Show loading while checking auth or if not authorized
  if (authLoading || !user || user.role !== 'OWNER') {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.push('/admin/services')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Editar Serviço
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Nome do Serviço"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Corte Masculino"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descrição"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva o serviço..."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Duração (minutos)"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                    placeholder="30"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Preço (R$)"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: '0.01' }}
                    placeholder="50.00"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      {currentImage || imagePreview ? 'Trocar Imagem' : 'Escolher Imagem do Serviço'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {(imagePreview || currentImage) && (
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {imagePreview ? 'Nova imagem:' : 'Imagem atual:'}
                        </Typography>
                        <Box
                          component="img"
                          src={imagePreview || currentImage || ''}
                          alt="Service"
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 300,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={handleChange}
                        name="is_active"
                      />
                    }
                    label="Serviço Ativo"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => router.push('/admin/services')}
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
