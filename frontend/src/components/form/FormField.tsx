'use client';

import React from 'react';
import { Controller, ControllerProps, FieldValues, FieldPath } from 'react-hook-form';
import Input, { InputProps } from '@/components/base/Input';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  MenuItem,
  SelectProps,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Box,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

// ============================================================================
// FormField - Input com integração React Hook Form
// ============================================================================

interface FormFieldProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
  name: FieldPath<T>;
  control: any;
  label?: string;
  showValidationIcon?: boolean;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  showValidationIcon = true,
  ...inputProps
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Box>
          {label && (
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
              {label}
              {inputProps.required && <span style={{ color: 'red' }}> *</span>}
            </FormLabel>
          )}
          <Input
            {...field}
            {...inputProps}
            error={invalid}
            helperText={error?.message}
            showValidationIcon={showValidationIcon}
            success={!invalid && field.value && field.value.length > 0}
          />
        </Box>
      )}
    />
  );
}

// ============================================================================
// SelectField - Select com integração React Hook Form
// ============================================================================

interface SelectFieldProps<T extends FieldValues> extends Omit<SelectProps, 'name'> {
  name: FieldPath<T>;
  control: any;
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  helperText?: string;
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  helperText,
  ...selectProps
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          {label && (
            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
              {label}
              {selectProps.required && <span style={{ color: 'red' }}> *</span>}
            </FormLabel>
          )}
          <Select {...field} {...selectProps}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <AnimatePresence>
            {(error?.message || helperText) && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FormHelperText>{error?.message || helperText}</FormHelperText>
              </MotionBox>
            )}
          </AnimatePresence>
        </FormControl>
      )}
    />
  );
}

// ============================================================================
// CheckboxField - Checkbox com integração React Hook Form
// ============================================================================

interface CheckboxFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: any;
  label: string;
  helperText?: string;
}

export function CheckboxField<T extends FieldValues>({
  name,
  control,
  label,
  helperText,
}: CheckboxFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label={label}
          />
          <AnimatePresence>
            {(error?.message || helperText) && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FormHelperText>{error?.message || helperText}</FormHelperText>
              </MotionBox>
            )}
          </AnimatePresence>
        </FormControl>
      )}
    />
  );
}

// ============================================================================
// RadioField - Radio Group com integração React Hook Form
// ============================================================================

interface RadioFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: any;
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  row?: boolean;
}

export function RadioField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  row = false,
}: RadioFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          {label && <FormLabel sx={{ mb: 1, fontWeight: 600 }}>{label}</FormLabel>}
          <RadioGroup {...field} row={row}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          <AnimatePresence>
            {error?.message && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FormHelperText>{error.message}</FormHelperText>
              </MotionBox>
            )}
          </AnimatePresence>
        </FormControl>
      )}
    />
  );
}

// ============================================================================
// SwitchField - Switch com integração React Hook Form
// ============================================================================

interface SwitchFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: any;
  label: string;
  helperText?: string;
}

export function SwitchField<T extends FieldValues>({
  name,
  control,
  label,
  helperText,
}: SwitchFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormControlLabel
            control={<Switch {...field} checked={field.value} />}
            label={label}
          />
          <AnimatePresence>
            {(error?.message || helperText) && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FormHelperText>{error?.message || helperText}</FormHelperText>
              </MotionBox>
            )}
          </AnimatePresence>
        </FormControl>
      )}
    />
  );
}

// ============================================================================
// FormActions - Container para botões do formulário
// ============================================================================

interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'space-between';
}

export function FormActions({ children, align = 'right' }: FormActionsProps) {
  const justifyContent = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    'space-between': 'space-between',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: justifyContent[align],
        gap: 2,
        mt: 3,
      }}
    >
      {children}
    </Box>
  );
}
