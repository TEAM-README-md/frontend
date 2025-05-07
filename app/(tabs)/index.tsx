import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>안녕</Text>
      <Button title="눌러봐" onPress={() => router.push('/SecondScreen')} />
    </View>
  );
}
