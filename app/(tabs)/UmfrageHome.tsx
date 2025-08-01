import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const UmfrageHome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/CHi UP2.png')}
        style={styles.mainImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>나는 어떤 사람일까?</Text>
      <Text style={styles.subtitle}>설문조사를 통해 저희에게 알려주세요!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Company')}
      >
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>

      <Image source={require('../../assets/images/image 65.png')} style={styles.image65} />
      <Image source={require('../../assets/images/image 66.png')} style={styles.image66} />
      <Image source={require('../../assets/images/image 67.png')} style={styles.image67} />
      <Image source={require('../../assets/images/image 68.png')} style={styles.image68} />
      <Image source={require('../../assets/images/image 69.png')} style={styles.image69} />
      <Image source={require('../../assets/images/image 71.png')} style={styles.image70} />
    </View>
  );
};

export default UmfrageHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.08,
  },
  mainImage: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    marginBottom: height * 0.015,
  },
  subtitle: {
    fontSize: width * 0.038,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  button: {
    width: width * 0.85,
    height: height * 0.065,
    backgroundColor: '#0077FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: height * 0.05,
  },
  buttonText: {
    fontSize: width * 0.05,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  image65: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    left: width * 0.6,
    top: height * 0.75,
  },
  image66: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    left: width * -0.02,
    top: height * 0.74,
    transform: [{ rotate: '1deg' }],
  },
  image67: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.25,
    left: width * 0.08,
    top: height * 0.83,
  },
  image68: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    left: width * 0.28,
    top: height * 0.79,
  },
  image69: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.4,
    left: width * 0.38,
    top: height * 0.77,
  },
  image70: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    left: width * 0.75,
    top: height * 0.79,
  },
});
