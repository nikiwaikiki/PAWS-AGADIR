import { supabase } from './supabase-client';
import { AuthUser, AppRole } from './types';
import { getAuthErrorMessage } from './error-handler';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: getAuthErrorMessage(error) };
  }
}

export async function signUp(email: string, password: string, displayName?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;

    if (data.user && displayName) {
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        display_name: displayName,
      });
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: getAuthErrorMessage(error) };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error) };
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: helperApp } = await supabase
      .from('helper_applications')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    const role = roleData?.role as AppRole | undefined;
    const is_helper = helperApp?.status === 'approved' || role === 'moderator';
    const is_admin = role === 'admin';

    return {
      id: user.id,
      email: user.email!,
      display_name: profile?.display_name || user.user_metadata?.display_name,
      role,
      is_helper,
      is_admin,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error) };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error) };
  }
}
