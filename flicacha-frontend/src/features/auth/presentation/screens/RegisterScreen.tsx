import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { useAuth } from '../hooks/useAuth';

interface Props {
  onNavigateLogin: () => void;
}

export function RegisterScreen({ onNavigateLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { register, error, pending } = useAuth();

  const handleRegister = () => {
    if (password !== confirm) return;
    register(name, email, password);
  };

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
          <View style={styles.header}>
            <TouchableOpacity onPress={onNavigateLogin} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Únete a Flicacha</Text>
          </View>

          <View style={styles.form}>
            {(
              [
                { label: 'Nombre de usuario', value: name, setter: setName, placeholder: '@tunombre', type: 'default' as const, secure: false },
                { label: 'Email', value: email, setter: setEmail, placeholder: 'tu@email.com', type: 'email-address' as const, secure: false },
                { label: 'Contraseña', value: password, setter: setPassword, placeholder: '••••••••', type: 'default' as const, secure: true },
                { label: 'Confirmar contraseña', value: confirm, setter: setConfirm, placeholder: '••••••••', type: 'default' as const, secure: true },
              ]
            ).map((field) => (
              <View key={field.label}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  keyboardType={field.type}
                  autoCapitalize="none"
                  secureTextEntry={field.secure}
                  placeholderTextColor={theme.colors.textMuted}
                  placeholder={field.placeholder}
                />
              </View>
            ))}

            {password !== confirm && confirm.length > 0 && (
              <Text style={styles.matchError}>Las contraseñas no coinciden</Text>
            )}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.btn, (pending || password !== confirm) && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={pending || password !== confirm}
              activeOpacity={0.85}
            >
              {pending ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Crear cuenta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onNavigateLogin} style={styles.loginLink}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?{' '}
                <Text style={styles.loginHighlight}>Inicia sesión</Text>
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
    paddingHorizontal: theme.spacing['6'],
    paddingTop: theme.spacing['12'],
    paddingBottom: theme.spacing['8'],
  },
  header: {
    marginBottom: theme.spacing['8'],
  },
  backBtn: {
    marginBottom: theme.spacing['4'],
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  title: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography['2xl'],
    color: theme.colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textMuted,
    marginTop: theme.spacing['1'],
  },
  form: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    padding: theme.spacing['6'],
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing['1'],
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
  matchError: {
    color: theme.colors.error,
    fontSize: theme.typography.xs,
    fontFamily: theme.typography.fontBody,
    marginTop: theme.spacing['1'],
  },
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
  btnDisabled: { opacity: 0.5 },
  btnText: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: theme.spacing['5'],
  },
  loginText: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
  },
  loginHighlight: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontBodyMedium,
  },
});
