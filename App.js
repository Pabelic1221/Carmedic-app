import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
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
const db = getFirestore(app);

const AuthScreen = ({
  setRegistrationType,
  setIsRegistering,
  isLogin,
  setIsLogin,
  handleAuthentication,
  isLoading,
}) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      {isLogin ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
          <View style={styles.buttonContainer}>
            <Button title="Sign In" onPress={handleAuthentication} color="#3498db" />
          </View>
        </>
      ) : (
        <>
          <View style={styles.verticalButtonContainer}>
            <View style={styles.buttonContainer}>
              <Button title="Sign Up as User" onPress={() => { setRegistrationType('User'); setIsRegistering(true); }} color="#3498db" />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Sign Up as Auto Repair Shop" onPress={() => { setRegistrationType('Shop'); setIsRegistering(true); }} color="#3498db" />
            </View>
          </View>
        </>
      )}
      {isLoading && <ActivityIndicator size="large" color="#3498db" />}
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
};

const UserRegistrationForm = ({
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
  phoneNumber, setPhoneNumber,
  handleAuthentication,
  isLoading,
  passwordsMatch,
  goBack
}) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Sign Up as User</Text>
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
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
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
      <TextInput
        style={[styles.input, !passwordsMatch && styles.inputError]}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleAuthentication} color="#3498db" />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#3498db" />}
      <Button title="Back" onPress={goBack} color="#3498db" />
    </View>
  );
};

const ShopRegistrationForm = ({
  firstName, setFirstName,
  middleName, setMiddleName,
  lastName, setLastName,
  shopName, setShopName,
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  streetAddress, setStreetAddress,
  city, setCity,
  state, setState,
  zipCode, setZipCode,
  phoneNumber, setPhoneNumber,
  handleAuthentication,
  isLoading,
  passwordsMatch,
  goBack
}) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Sign Up as Auto Repair Shop</Text>
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
        value={shopName}
        onChangeText={setShopName}
        placeholder="Name of Shop"
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
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
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
      <TextInput
        style={[styles.input, !passwordsMatch && styles.inputError]}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleAuthentication} color="#3498db" />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#3498db" />}
      <Button title="Back" onPress={goBack} color="#3498db" />
    </View>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registrationType, setRegistrationType] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAuthentication = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please make sure your passwords match.');
      return;
    }

    setIsLoading(true);

    try {
      let userCredential;

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await sendEmailVerification(userCredential.user);

        const userData = {
          firstName,
          middleName,
          lastName,
          email,
          streetAddress,
          city,
          state,
          zipCode,
          phoneNumber,
          role: registrationType,
          shopName: registrationType === 'Shop' ? shopName : null,
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      }

      setUser(userCredential.user);
    } catch (error) {
      console.error('Error during authentication', error);
      Alert.alert('Authentication Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword;

  const goBack = () => {
    setIsRegistering(false);
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setShopName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setStreetAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setPhoneNumber('');
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text>Welcome, {user.email}</Text>
        <Button title="Sign Out" onPress={() => signOut(auth)} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (isRegistering) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {registrationType === 'User' ? (
          <UserRegistrationForm
            firstName={firstName}
            setFirstName={setFirstName}
            middleName={middleName}
            setMiddleName={setMiddleName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            streetAddress={streetAddress}
            setStreetAddress={setStreetAddress}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            zipCode={zipCode}
            setZipCode={setZipCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handleAuthentication={handleAuthentication}
            isLoading={isLoading}
            passwordsMatch={passwordsMatch}
            goBack={goBack}
          />
        ) : (
          <ShopRegistrationForm
            firstName={firstName}
            setFirstName={setFirstName}
            middleName={middleName}
            setMiddleName={setMiddleName}
            lastName={lastName}
            setLastName={setLastName}
            shopName={shopName}
            setShopName={setShopName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            streetAddress={streetAddress}
            setStreetAddress={setStreetAddress}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            zipCode={zipCode}
            setZipCode={setZipCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handleAuthentication={handleAuthentication}
            isLoading={isLoading}
            passwordsMatch={passwordsMatch}
            goBack={goBack}
          />
        )}
      </ScrollView>
    );
  }

  return (
    <AuthScreen
      setRegistrationType={setRegistrationType}
      setIsRegistering={setIsRegistering}
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      handleAuthentication={handleAuthentication}
      isLoading={isLoading}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 200,
  },
});
