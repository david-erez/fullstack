import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // En producción, aquí se enviaría a un servicio de logging (Sentry, etc.)
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  reset = () => this.setState({ hasError: false, errorMessage: null });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Algo salió mal</Text>
          <Text style={styles.message}>
            {this.state.errorMessage ?? 'Ocurrió un error inesperado'}
          </Text>
          <TouchableOpacity style={styles.btn} onPress={this.reset}>
            <Text style={styles.btnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['8'],
  },
  emoji: { fontSize: 48, marginBottom: theme.spacing['4'] },
  title: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.lg,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing['2'],
  },
  message: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing['6'],
  },
  btn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing['6'],
    paddingVertical: theme.spacing['3'],
  },
  btnText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.base,
  },
});
