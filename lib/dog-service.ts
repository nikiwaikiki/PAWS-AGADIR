import { supabase } from './supabase-client';
import { Dog, DogInsert, DogUpdate, FilterOptions, DogWithReporter } from './types';
import { handleSupabaseError } from './error-handler';

export async function fetchDogs(filters?: FilterOptions) {
  try {
    let query = supabase
      .from('dogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,ear_tag.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
      );
    }

    if (filters?.report_type) {
      query = query.eq('report_type', filters.report_type);
    }

    if (filters?.urgency_level) {
      query = query.eq('urgency_level', filters.urgency_level);
    }

    if (filters?.is_vaccinated !== undefined) {
      query = query.eq('is_vaccinated', filters.is_vaccinated);
    }

    if (filters?.is_approved !== undefined) {
      query = query.eq('is_approved', filters.is_approved);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as any, error: null };
  } catch (error: any) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

export async function fetchDogById(id: string) {
  try {
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return { data: data as any, error: null };
  } catch (error: any) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

export async function createDog(dog: DogInsert) {
  try {
    const { data, error } = await supabase.from('dogs').insert(dog).select().single();

    if (error) throw error;

    return { data: data as Dog, error: null };
  } catch (error: any) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

export async function updateDog(id: string, updates: DogUpdate) {
  try {
    const { data, error } = await supabase
      .from('dogs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data: data as Dog, error: null };
  } catch (error: any) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

export async function deleteDog(id: string) {
  try {
    const { error } = await supabase.from('dogs').delete().eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: handleSupabaseError(error) };
  }
}

export async function approveDog(id: string) {
  return updateDog(id, { is_approved: true });
}

export async function fetchAdoptionDogs() {
  return fetchDogs({
    is_approved: true,
    is_vaccinated: true,
  });
}

export async function fetchSOSDogs() {
  return fetchDogs({
    report_type: 'sos',
    is_approved: false,
  });
}

export async function fetchPendingDogs() {
  return fetchDogs({
    is_approved: false,
  });
}
