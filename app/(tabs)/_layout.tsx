import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'home', // 원하는 파일명으로 변경 가능
};

export default function TabGroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 또는 true로 하고 title 지정도 가능
      }}
    />
  );
}