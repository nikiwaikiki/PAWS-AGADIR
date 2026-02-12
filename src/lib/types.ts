import { Database } from './database.types';

export type Dog = Database['public']['Tables']['dogs']['Row'];
export type DogInsert = Database['public']['Tables']['dogs']['Insert'];
export type DogUpdate = Database['public']['Tables']['dogs']['Update'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

export type Facility = Database['public']['Tables']['facilities']['Row'];
export type FacilityInsert = Database['public']['Tables']['facilities']['Insert'];

export type HelperApplication = Database['public']['Tables']['helper_applications']['Row'];
export type HelperApplicationInsert =
  Database['public']['Tables']['helper_applications']['Insert'];

export type DogRemark = Database['public']['Tables']['dog_remarks']['Row'];
export type DogRemarkInsert = Database['public']['Tables']['dog_remarks']['Insert'];

export type ReportType = 'save' | 'sos' | 'stray' | 'vaccination_wish';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type AppRole = 'admin' | 'moderator';

export interface DogWithReporter extends Dog {
  reporter?: {
    display_name: string | null;
    id: string;
  };
}

export interface DogFormData {
  name: string;
  ear_tag: string;
  location: string;
  latitude: number;
  longitude: number;
  report_type: ReportType;
  urgency_level: UrgencyLevel;
  is_vaccinated: boolean;
  vaccination1_date?: string;
  vaccination2_date?: string;
  additional_info?: string;
  sponsor_name?: string;
  photo?: File;
}

export interface AuthUser {
  id: string;
  email: string;
  display_name?: string;
  role?: AppRole;
  is_helper: boolean;
  is_admin: boolean;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
}

export interface FilterOptions {
  search?: string;
  report_type?: ReportType;
  urgency_level?: UrgencyLevel;
  is_vaccinated?: boolean;
  is_approved?: boolean;
}
