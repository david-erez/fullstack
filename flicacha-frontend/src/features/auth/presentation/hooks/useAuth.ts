import { useState } from 'react';
import { useAuthStore } from './useAuthStore';
import { authRepository } from '../../data/repositories/AuthRepository';
import { LoginUseCase, RegisterUseCase, LogoutUseCase } from '../../domain/usecases';

const loginUC = new LoginUseCase(authRepository);
const registerUC = new RegisterUseCase(authRepository);
const logoutUC = new LogoutUseCase(authRepository);

export function useAuth() {
  const { user, isAuthenticated, isLoading, setSession, clearSession } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const login = async (email: string, password: string) => {
    setPending(true);
    setError(null);
    try {
      const session = await loginUC.execute(email, password);
      setSession(session);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Error al iniciar sesión');
    } finally {
      setPending(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setPending(true);
    setError(null);
    try {
      const session = await registerUC.execute(name, email, password);
      setSession(session);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Error al registrarse');
    } finally {
      setPending(false);
    }
  };

  const logout = async () => {
    setPending(true);
    try {
      await logoutUC.execute();
      clearSession();
    } catch {
      clearSession();
    } finally {
      setPending(false);
    }
  };

  return { user, isAuthenticated, isLoading, error, pending, login, register, logout };
}
