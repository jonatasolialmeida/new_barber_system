'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

/**
 * PageTransition - Componente para animações de transição entre páginas
 *
 * Fornece animações suaves de entrada/saída ao navegar entre rotas
 * usando Framer Motion e Next.js App Router.
 */

// Variantes de animação para diferentes tipos de transição
export const pageVariants = {
  // Fade simples
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Slide da direita
  slideRight: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  },

  // Slide da esquerda
  slideLeft: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },

  // Slide de baixo (padrão para páginas)
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },

  // Scale com fade
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.05, opacity: 0 },
  },

  // Blur e fade (glassmorphism)
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
  },

  // Rotação 3D
  rotate3D: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
};

// Configurações de transição
export const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: keyof typeof pageVariants;
  className?: string;
}

/**
 * Componente de transição padrão para páginas
 */
export function PageTransition({
  children,
  variant = 'slideUp',
  className,
}: PageTransitionProps) {
  const pathname = usePathname();
  const selectedVariant = pageVariants[variant];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={selectedVariant}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Transição com stagger para children (útil para listas)
 */
interface StaggerTransitionProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerTransition({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Item para usar dentro de StaggerTransition
 */
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Transição com reveal lateral (para cards, modais)
 */
interface RevealTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  className?: string;
}

export function RevealTransition({
  children,
  direction = 'bottom',
  delay = 0,
  className,
}: RevealTransitionProps) {
  const directionOffset = {
    left: { x: -100 },
    right: { x: 100 },
    top: { y: -100 },
    bottom: { y: 100 },
  };

  return (
    <motion.div
      initial={{ ...directionOffset[direction], opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animação de contador (para números)
 */
interface CounterAnimationProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function CounterAnimation({
  from,
  to,
  duration = 2,
  suffix = '',
  className,
}: CounterAnimationProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      <motion.span
        initial={{ count: from }}
        whileInView={{ count: to }}
        viewport={{ once: true }}
        transition={{ duration, ease: 'easeOut' }}
        onUpdate={(latest: any) => {
          if (typeof latest.count === 'number') {
            const element = document.getElementById(`counter-${to}`);
            if (element) {
              element.textContent = Math.floor(latest.count) + suffix;
            }
          }
        }}
      >
        <span id={`counter-${to}`}>{from + suffix}</span>
      </motion.span>
    </motion.span>
  );
}

/**
 * Loading Transition (para estados de loading)
 */
interface LoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  className?: string;
}

export function LoadingTransition({
  isLoading,
  children,
  loader,
  className,
}: LoadingTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          {loader}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Scroll Progress Bar
 */
export function ScrollProgress() {
  const { scrollYProgress } = require('framer-motion').useScroll();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #1976D2 0%, #9C27B0 100%)',
        transformOrigin: '0%',
        zIndex: 9999,
      }}
    />
  );
}

/**
 * Parallax Box - Para efeitos parallax em scroll
 */
interface ParallaxBoxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxBox({ children, offset = 50, className }: ParallaxBoxProps) {
  const { scrollY } = require('framer-motion').useScroll();
  const y = require('framer-motion').useTransform(scrollY, [0, 1000], [0, offset]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export default PageTransition;
