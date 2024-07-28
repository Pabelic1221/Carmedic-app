import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnNYYtllwo9dfOF636KcGXfNhiBC6EYQI",
  authDomain: "carmedicdb.firebaseapp.com",
  databaseURL: "https://carmedicdb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "carmedicdb",
  storageBucket: "carmedicdb.appspot.com",
  messagingSenderId: "873364370703",
  appId: "1:873364370703:web:dc2a463af427cd271d3a7a",
  measurementId: "G-G6WTDZB2Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const AuthScreen = ({
  firstName, setFirstName,
  middleName, setMiddleName,
  lastName, setLastName,
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  streetAddress, setStreetAddress,
  city, setCity,
  state, setState,
  zipCode, setZipCode,
  isLogin, setIsLogin,
  handleAuthentication,
  isLoading
}) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            style={styles.input}
            value={middleName}
            onChangeText={setMiddleName}
            placeholder="Middle Name"
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
          <TextInput
            style={styles.input}
            value={streetAddress}
            onChangeText={setStreetAddress}
            placeholder="Street Address"
          />
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="State"
          />
          <TextInput
            style={styles.input}
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="ZIP Code"
            keyboardType="numeric"
          />
        </>
      )}

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {!isLogin && (
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#3498db" />}
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
};

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthentication = async () => {
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        await signOut(auth);
        console.log('User logged out successfully!');
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
          if (!auth.currentUser.emailVerified) {
            Alert.alert('Email Verification', 'Please verify your email before logging in.');
            await signOut(auth);
            return;
          }
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
          await sendEmailVerification(auth.currentUser);
          Alert.alert('Email Verification', 'Verification email sent. Please check your inbox.');
          await signOut(auth);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      Alert.alert('Authentication Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      {user ? (
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        <AuthScreen
          firstName={firstName} setFirstName={setFirstName}
          middleName={middleName} setMiddleName={setMiddleName}
          lastName={lastName} setLastName={setLastName}
          streetAddress={streetAddress} setStreetAddress={setStreetAddress}
          city={city} setCity={setCity}
          state={state} setState={setState}
          zipCode={zipCode} setZipCode={setZipCode}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
          isLogin={isLogin} setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          isLoading={isLoading}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
