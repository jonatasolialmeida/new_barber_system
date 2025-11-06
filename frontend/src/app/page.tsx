'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  ContentCut,
  Schedule,
  Star,
  TrendingUp,
  ArrowForward,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { colors } from '@/styles/designTokens';
import { useRef } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function LandingPage() {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      icon: <Schedule sx={{ fontSize: 50 }} />,
      title: 'Agendamento Fácil',
      description: 'Reserve seu horário em segundos. Sistema intuitivo e rápido para sua comodidade.',
      color: colors.primary[500],
    },
    {
      icon: <ContentCut sx={{ fontSize: 50 }} />,
      title: 'Profissionais Qualificados',
      description: 'Equipe experiente e treinada nos melhores cortes e técnicas modernas.',
      color: colors.secondary[500],
    },
    {
      icon: <Star sx={{ fontSize: 50 }} />,
      title: 'Experiência Premium',
      description: 'Ambiente moderno, confortável e equipado para sua melhor experiência.',
      color: colors.warning[600],
    },
    {
      icon: <TrendingUp sx={{ fontSize: 50 }} />,
      title: 'Gestão Inteligente',
      description: 'Sistema completo de gestão para barbeiros e proprietários otimizarem o negócio.',
      color: colors.success[600],
    },
  ];

  const stats = [
    { value: '2500+', label: 'Agendamentos', delay: 0 },
    { value: '98%', label: 'Satisfação', delay: 0.1 },
    { value: '150+', label: 'Clientes Ativos', delay: 0.2 },
    { value: '24/7', label: 'Suporte', delay: 0.3 },
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Cliente Regular',
      avatar: 'C',
      comment: 'Melhor sistema de agendamento que já usei! Prático, rápido e eficiente.',
      rating: 5,
    },
    {
      name: 'João Santos',
      role: 'Barbeiro',
      avatar: 'J',
      comment: 'Como barbeiro, esse sistema facilitou muito minha rotina. Organização perfeita!',
      rating: 5,
    },
    {
      name: 'Pedro Lima',
      role: 'Proprietário',
      avatar: 'P',
      comment: 'Aumentei minha eficiência em 40%. Relatórios claros e gestão simplificada.',
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <Box ref={ref} sx={{ overflow: 'hidden', position: 'relative' }}>
      {/* Theme Toggle */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        <ThemeToggle size="large" />
      </Box>

      {/* Hero Section com Parallax */}
      <MotionBox
        style={{ opacity, scale }}
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.secondary[700]} 100%)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Elementos decorativos animados */}
        <MotionBox
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        <MotionBox
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <MotionTypography
                  variant="overline"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    mb: 2,
                    display: 'block',
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  🔥 Sistema Completo de Agendamento
                </MotionTypography>

                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 900,
                    lineHeight: 1.2,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  Transforme Sua
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #FFF 0%, rgba(255,255,255,0.7) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Barbearia
                  </Box>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: 5,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '90%',
                  }}
                >
                  A plataforma mais moderna para gerenciar agendamentos, clientes e impulsionar seu negócio.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 5 }}>
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => router.push('/register')}
                      sx={{
                        py: 2,
                        px: 5,
                        fontSize: '1.1rem',
                        borderRadius: '16px',
                        textTransform: 'none',
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        '&:hover': {
                          backgroundColor: 'white',
                          boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                        },
                      }}
                    >
                      Começar Grátis
                    </Button>
                  </MotionBox>

                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.push('/login')}
                      sx={{
                        py: 2,
                        px: 5,
                        fontSize: '1.1rem',
                        borderRadius: '16px',
                        textTransform: 'none',
                        borderColor: 'white',
                        color: 'white',
                        borderWidth: 2,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'white',
                          borderWidth: 2,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Fazer Login
                    </Button>
                  </MotionBox>
                </Stack>

                {/* Stats */}
                <Grid container spacing={3}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + stat.delay, duration: 0.6 }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            color: 'white',
                            fontWeight: 800,
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: 500,
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </MotionBox>
                    </Grid>
                  ))}
                </Grid>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                sx={{
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '500px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '32px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <ContentCut
                    sx={{
                      fontSize: '250px',
                      color: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />

                  {/* Elementos flutuantes */}
                  {[...Array(3)].map((_, i) => (
                    <MotionBox
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                      sx={{
                        position: 'absolute',
                        top: `${20 + i * 25}%`,
                        left: `${10 + i * 30}%`,
                        width: 60,
                        height: 60,
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </MotionBox>

      {/* Features Section */}
      <Box
        sx={{
          py: 15,
          background: colors.background.default,
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            sx={{ textAlign: 'center', mb: 10 }}
          >
            <MotionTypography
              variants={itemVariants}
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: '0.2em',
                fontSize: '0.9rem',
              }}
            >
              RECURSOS PODEROSOS
            </MotionTypography>

            <MotionTypography
              variants={itemVariants}
              variant="h2"
              sx={{ mt: 2, mb: 2, fontWeight: 800 }}
            >
              Tudo que você precisa em um só lugar
            </MotionTypography>

            <MotionTypography
              variants={itemVariants}
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.7 }}
            >
              Plataforma completa com todas as ferramentas para transformar
              a gestão da sua barbearia
            </MotionTypography>
          </MotionBox>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  }}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: '24px',
                    border: 'none',
                    background: 'white',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <MotionBox
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Avatar
                        sx={{
                          width: 90,
                          height: 90,
                          mx: 'auto',
                          mb: 3,
                          background: alpha(feature.color, 0.1),
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </MotionBox>

                    <Typography
                      variant="h5"
                      sx={{ mb: 2, fontWeight: 700 }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: 15,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: '0.2em',
              }}
            >
              DEPOIMENTOS
            </Typography>

            <Typography variant="h2" sx={{ mt: 2, mb: 2, fontWeight: 800 }}>
              O que nossos clientes dizem
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  sx={{
                    height: '100%',
                    borderRadius: '24px',
                    border: 'none',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: colors.warning[500], fontSize: 20 }} />
                      ))}
                    </Stack>

                    <Typography
                      variant="body1"
                      sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}
                    >
                      "{testimonial.comment}"
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          background: colors.gradients.barber,
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 15,
          background: colors.gradients.barber,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center' }}
          >
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 800 }}>
              Pronto para começar?
            </Typography>

            <Typography variant="h6" sx={{ mb: 5, opacity: 0.95, lineHeight: 1.7 }}>
              Junte-se a centenas de barbearias que já transformaram
              seu negócio com nossa plataforma.
            </Typography>

            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => router.push('/register')}
                sx={{
                  py: 2.5,
                  px: 6,
                  fontSize: '1.2rem',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: 'white',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
                  },
                }}
              >
                Criar Conta Grátis
              </Button>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 8,
          background: colors.gray[900],
          color: colors.gray[400],
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                Barber System
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
                A plataforma mais moderna para gestão de barbearias.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" sx={{ color: colors.gray[400] }}>
                  <Instagram />
                </IconButton>
                <IconButton size="small" sx={{ color: colors.gray[400] }}>
                  <Facebook />
                </IconButton>
                <IconButton size="small" sx={{ color: colors.gray[400] }}>
                  <Twitter />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                Contato
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone sx={{ fontSize: 18 }} />
                  <Typography variant="body2">(11) 99999-9999</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email sx={{ fontSize: 18 }} />
                  <Typography variant="body2">contato@barbersystem.com</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOn sx={{ fontSize: 18 }} />
                  <Typography variant="body2">São Paulo, SP</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>
                Links Rápidos
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Sobre Nós
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Recursos
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Preços
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Suporte
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${colors.gray[800]}`, textAlign: 'center' }}>
            <Typography variant="body2">
              © 2025 Barber System. Todos os direitos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
