export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  birth_date: string | null;
  role: 'CLIENT' | 'BARBER' | 'OWNER';
  is_active: boolean;
  receive_email_notifications: boolean;
  receive_sms_notifications: boolean;
  receive_whatsapp_notifications: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: string;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: number;
  client: number;
  client_name: string;
  barber: number;
  barber_name: string;
  service: number;
  service_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes: string;
  price_charged: string;
  confirmation_sent: boolean;
  reminder_sent: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
