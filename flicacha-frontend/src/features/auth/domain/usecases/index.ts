import type { IAuthRepository } from '@core/domain/repositories';
import type { AuthSession } from '@core/domain/entities';

export class LoginUseCase {
  constructor(private repo: IAuthRepository) {}
  async execute(email: string, password: string): Promise<AuthSession> {
    if (!email.trim() || !password.trim()) throw new Error('Email y contraseña requeridos');
    return this.repo.login(email.trim().toLowerCase(), password);
  }
}

export class RegisterUseCase {
  constructor(private repo: IAuthRepository) {}
  async execute(name: string, email: string, password: string): Promise<AuthSession> {
    if (name.trim().length < 3) throw new Error('El nombre debe tener al menos 3 caracteres');
    if (!email.includes('@')) throw new Error('Email inválido');
    if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');
    return this.repo.register(name.trim(), email.trim().toLowerCase(), password);
  }
}

export class LogoutUseCase {
  constructor(private repo: IAuthRepository) {}
  async execute(): Promise<void> {
    await this.repo.logout();
    await this.repo.clearSession();
  }
}
