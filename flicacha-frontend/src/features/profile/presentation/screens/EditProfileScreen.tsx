import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '@shared/theme';
import { userRepository } from '../../data/repositories/UserRepository';
import { useAuthStore } from '@features/auth/presentation/hooks/useAuthStore';
import { Avatar } from '@shared/components/ui/Avatar';

interface Props {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: Props) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState(user?.name ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null);
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (name.trim().length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
      return;
    }
    setLoading(true);
    try {
      const updated = await userRepository.updateProfile(user.userId, {
        name: name.trim(),
        avatarUrl: avatarUri ?? undefined,
      });
      setUser(updated);
      onBack();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cancel}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar perfil</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color={theme.colors.primary} />
            : <Text style={styles.save}>Guardar</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={styles.avatarSection}>
        {avatarUri
          ? <Image source={{ uri: avatarUri }} style={styles.avatarPreview} />
          : <Avatar uri={user?.avatarUrl} name={user?.name} size={80} />
        }
        <TouchableOpacity onPress={pickAvatar} style={styles.changeAvatarBtn}>
          <Text style={styles.changeAvatarText}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.textMuted}
          placeholder="tunombre"
          maxLength={30}
        />
        <Text style={styles.hint}>{name.length}/30 caracteres</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancel: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
  },
  title: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.lg,
    color: theme.colors.textPrimary,
  },
  save: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
    color: theme.colors.primary,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing['8'],
    gap: theme.spacing['3'],
  },
  avatarPreview: {
    width: 80,
    height: 80,
    borderRadius: theme.radii.full,
  },
  changeAvatarBtn: {},
  changeAvatarText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
  },
  form: {
    paddingHorizontal: theme.spacing['4'],
  },
  label: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['2'],
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  hint: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing['2'],
  },
});
