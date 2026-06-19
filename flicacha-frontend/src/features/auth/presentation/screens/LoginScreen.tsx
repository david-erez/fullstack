import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { useAuth } from '../hooks/useAuth';

interface Props {
  onNavigateRegister: () => void;
}

export function LoginScreen({ onNavigateRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, pending } = useAuth();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoMark}>
              <Text style={styles.logoChar}>F</Text>
            </View>
            <Text style={styles.appName}>flicacha</Text>
            <Text style={styles.tagline}>Tu voz. Sin filtros.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor={theme.colors.textMuted}
              placeholder="tu@email.com"
            />

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.flex]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                placeholderTextColor={theme.colors.textMuted}
                placeholder="••••••••"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.btn, pending && styles.btnDisabled]}
              onPress={() => login(email, password)}
              disabled={pending}
              activeOpacity={0.85}
            >
              {pending ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onNavigateRegister} style={styles.registerLink}>
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{' '}
                <Text style={styles.registerHighlight}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing['6'],
    paddingVertical: theme.spacing['12'],
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: theme.spacing['10'],
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: theme.radii.xl,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing['3'],
    ...theme.shadows.glow,
  },
  logoChar: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography['3xl'],
    color: theme.colors.textPrimary,
  },
  appName: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography['2xl'],
    color: theme.colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing['1'],
  },
  form: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    padding: theme.spacing['6'],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['2'],
    marginTop: theme.spacing['3'],
  },
  input: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['2'],
  },
  eyeBtn: {
    padding: theme.spacing['3'],
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eyeIcon: { fontSize: 16 },
  errorBox: {
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderRadius: theme.radii.md,
    padding: theme.spacing['3'],
    marginTop: theme.spacing['4'],
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.sm,
  },
  btn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing['4'],
    alignItems: 'center',
    marginTop: theme.spacing['6'],
    ...theme.shadows.glow,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: theme.spacing['5'],
  },
  registerText: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
  },
  registerHighlight: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontBodyMedium,
  },
});
