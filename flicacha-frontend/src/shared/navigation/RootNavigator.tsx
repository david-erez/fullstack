import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from '@shared/theme';
import { useAuthStore } from '@features/auth/presentation/hooks/useAuthStore';
import { configureApiClient } from '@core/infrastructure/api/apiClient';

// Screens
import { LoginScreen } from '@features/auth/presentation/screens/LoginScreen';
import { RegisterScreen } from '@features/auth/presentation/screens/RegisterScreen';
import { FeedScreen } from '@features/feed/presentation/screens/FeedScreen';
import { PostDetailScreen } from '@features/post/presentation/screens/PostDetailScreen';
import { CreatePostScreen } from '@features/post/presentation/screens/CreatePostScreen';
import { ProfileScreen } from '@features/profile/presentation/screens/ProfileScreen';
import { EditProfileScreen } from '@features/profile/presentation/screens/EditProfileScreen';
import { NotificationsScreen } from '@features/notifications/presentation/screens/NotificationsScreen';
import { SearchScreen } from '@features/search/presentation/screens/SearchScreen';

import type { Post } from '@core/domain/entities';

// ─── Stack param types ────────────────────────────────────────────────────────
export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  FeedTab: undefined;
  SearchTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

export type FeedStackParamList = {
  Feed: undefined;
  PostDetail: { post: Post };
  CreatePost: undefined;
  UserProfile: { userId: number };
  HashtagFeed: { tag: string };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  UserProfile: { userId: number };
};

const Root = createNativeStackNavigator<RootStackParamList>();
const AuthNav = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// ─── Auth stack ───────────────────────────────────────────────────────────────
function AuthNavigator() {
  return (
    <AuthNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthNav.Screen name="Login" component={LoginWrapper} />
      <AuthNav.Screen name="Register" component={RegisterWrapper} />
    </AuthNav.Navigator>
  );
}

function LoginWrapper({ navigation }: any) {
  return <LoginScreen onNavigateRegister={() => navigation.navigate('Register')} />;
}
function RegisterWrapper({ navigation }: any) {
  return <RegisterScreen onNavigateLogin={() => navigation.navigate('Login')} />;
}

// ─── Feed Stack ───────────────────────────────────────────────────────────────
function FeedNavigator() {
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="Feed" component={FeedWrapper} />
      <FeedStack.Screen name="PostDetail" component={PostDetailWrapper} />
      <FeedStack.Screen name="CreatePost" component={CreatePostWrapper} />
      <FeedStack.Screen name="UserProfile" component={UserProfileWrapper} />
    </FeedStack.Navigator>
  );
}

function FeedWrapper({ navigation }: any) {
  return (
    <FeedScreen
      onNavigatePost={(post) => navigation.navigate('PostDetail', { post })}
      onNavigateProfile={(userId) => navigation.navigate('UserProfile', { userId })}
      onNavigateHashtag={(tag) => {}}
      onNavigateComments={(post) => navigation.navigate('PostDetail', { post })}
      onNavigateCreatePost={() => navigation.navigate('CreatePost')}
    />
  );
}

function PostDetailWrapper({ navigation, route }: any) {
  return (
    <PostDetailScreen
      post={route.params.post}
      onBack={() => navigation.goBack()}
      onProfile={(userId) => navigation.navigate('UserProfile', { userId })}
      onHashtag={() => {}}
    />
  );
}

function CreatePostWrapper({ navigation }: any) {
  return (
    <CreatePostScreen
      onBack={() => navigation.goBack()}
      onSuccess={() => navigation.goBack()}
    />
  );
}

function UserProfileWrapper({ navigation, route }: any) {
  return (
    <ProfileScreen
      userId={route.params.userId}
      onBack={() => navigation.goBack()}
      onNavigatePost={(post) => navigation.navigate('PostDetail', { post })}
      onNavigateHashtag={() => {}}
      onNavigateComments={(post) => navigation.navigate('PostDetail', { post })}
    />
  );
}

// ─── Search Stack ─────────────────────────────────────────────────────────────
function SearchWrapper({ navigation }: any) {
  return (
    <SearchScreen
      onNavigateProfile={(userId) => {}}
      onNavigatePost={(post) => {}}
      onNavigateHashtag={(tag) => {}}
      onNavigateComments={(post) => {}}
    />
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function NotifWrapper({ navigation }: any) {
  return (
    <NotificationsScreen
      onNavigateProfile={(userId) => {}}
      onNavigatePost={(postId) => {}}
    />
  );
}

// ─── Profile Stack ────────────────────────────────────────────────────────────
function ProfileNavigator() {
  const user = useAuthStore((s) => s.user);
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="MyProfile" component={MyProfileWrapper} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileWrapper} />
    </ProfileStack.Navigator>
  );
}

function MyProfileWrapper({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  return (
    <ProfileScreen
      userId={user.userId}
      onNavigatePost={(post) => {}}
      onNavigateHashtag={() => {}}
      onNavigateComments={(post) => {}}
      onNavigateEditProfile={() => navigation.navigate('EditProfile')}
    />
  );
}

function EditProfileWrapper({ navigation }: any) {
  return <EditProfileScreen onBack={() => navigation.goBack()} />;
}

// ─── Tab icon helper ──────────────────────────────────────────────────────────
const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  FeedTab:          { active: '🏠', inactive: '🏠' },
  SearchTab:        { active: '🔍', inactive: '🔍' },
  NotificationsTab: { active: '🔔', inactive: '🔔' },
  ProfileTab:       { active: '👤', inactive: '👤' },
};

// ─── Main Tabs ────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={focused ? {
                  backgroundColor: theme.colors.primaryGlow,
                  borderRadius: theme.radii.md,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                } : {}}
              >
                <Text style={{ fontSize: 22 }}>{icons.active}</Text>
              </View>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="FeedTab" component={FeedNavigator} />
      <Tab.Screen name="SearchTab" component={SearchWrapper} />
      <Tab.Screen name="NotificationsTab" component={NotifWrapper} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────
export function RootNavigator() {
  const { isAuthenticated, isLoading, tokens, clearSession } = useAuthStore();

  useEffect(() => {
    // Configure API client once we have store access
    configureApiClient({
      getToken: () => useAuthStore.getState().tokens?.accessToken ?? null,
      onUnauthorized: () => useAuthStore.getState().clearSession(),
    });
    // Load stored session
    useAuthStore.getState().loadStoredSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.textPrimary,
            border: theme.colors.border,
            notification: theme.colors.primary,
          },
        }}
      >
        <Root.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Root.Screen name="MainTabs" component={MainTabs} />
          ) : (
            <Root.Screen name="AuthStack" component={AuthNavigator} />
          )}
        </Root.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
