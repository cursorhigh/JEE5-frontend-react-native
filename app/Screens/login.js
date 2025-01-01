import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Checkbox, Button, Title, TextInput as PaperTextInput, IconButton } from 'react-native-paper';
import colour from '../../config/colour';
const Login = () => {
  const navigation = useNavigation();


  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [saveToken, setSaveToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleChange = (name, value) => {
    setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }));
  };

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      Alert.alert('Incomplete Credentials', 'Please enter both username and password.');
      return;
    }

    setProcessing(true);

    const apiUrl = 'https://jee5.pythonanywhere.com/api/users/login/';
    const body = JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();
      if (response.ok) {
        const token = data;
        if (saveToken) {
          const tokenString = JSON.stringify(token);
          try {
            await AsyncStorage.setItem('authToken', tokenString);
            await AsyncStorage.setItem('pfname',credentials.username);
          } catch (error) {
            console.error('Error saving token:', error);
            Alert.alert('Error', 'An error occurred while saving LoginInfo.');
          }
        }
        navigation.replace('JEE5');
      } else {
        Alert.alert('Login Failed', data.message || 'An error occurred.');
      }
    } catch (error) {
      console.log('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor:  colour.background  }]}>
      <TouchableOpacity>
        <Avatar.Image
          source={require('../assets/icon.png')}
          size={150}
          marginBottom={50}
          padding={'1%'}
        />
      </TouchableOpacity>
      <Title style={styles.title}>JEE5</Title>
      <PaperTextInput
        style={styles.input}
        placeholder="Username"
        value={credentials.username}
        onChangeText={(value) => handleChange('username', value)}
      />
      <View style={styles.passwordInputContainer}>
        <PaperTextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={credentials.password}
          onChangeText={(value) => handleChange('password', value)}
        />
        <IconButton
          icon={showPassword ? 'eye-off' : 'eye'}
          color="#009600"
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox.Android
          status={saveToken ? 'checked' : 'unchecked'}
          onPress={() => setSaveToken(!saveToken)}
          color={colour.switch}
        />
        <Text style={styles.label}>SAVE LOGIN</Text>
      </View>
      {processing ? (
        <ActivityIndicator size="large" color="#009600" style={styles.loader} />
      ) : (
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
        >
          LOGIN
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colour.txt,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'lightgray',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  label: {
    color: colour.txt,
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    marginTop: 20,
    padding: 3,
    width: '60%',
    backgroundColor: colour.primary,
  },
  loader: {
    marginTop: 20,
  },
});

export default Login;
