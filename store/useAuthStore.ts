import { create } from 'zustand';
import supabase from '../lib/Supabase';
import { useProfileStore } from './profileStore';
// import { supabase } from '../lib/supabase';

type UserRole = 'passenger' | 'driver' | 'admin';

type AuthStore = {
  user: any;
  profile: { full_name: string; role: UserRole; is_verified: boolean } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, phone: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  loading: false,

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error(error);
    else set({ user: data?.user });
    set({ loading: false });
    console.log("User Signed-In :", data?.user);
  },

  signUp: async (name, email, password, phone, role) => {
    set({ loading: true });
    console.log('User Data to sign up is :', { name, email, phone, role });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('Error signing up:' + error.message);
      console.log('Sign Up error is :', error);
    }
    else {

      if (!data.user) {
        console.log("User not returned yet — maybe waiting on email confirmation.");
        return;
      }


      console.log("User before Insert:", data?.user);
      const id = data.user?.id;
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id,
          name,
          email,
          phone,
          role,
          is_verified: false,
          vehicle_info: null,
        });
      if (userError) console.log("Insert Error:", userError);
      else console.log('Insert Data:', userData);


      set({ user: data?.user });
      console.log("User Signed-Up:", userData);
      alert('Sign Up Successfull. Check email for verification')

    }
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
    useProfileStore.getState().clearProfile(); //Set Profile as Null in profileStore
  },

  fetchProfile: async () => {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;
    set({ user });


    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();
      if (data) {
        set({ profile: data });
        useProfileStore.getState().setProfile(data);
        console.log('Profile fetched:', data);
      }
      if (error) console.error(error);
    }
  },
}));
