// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './app/Screens/homeScreen';
import Forms from './app/Screens/forms';
import Login from './app/Screens/login';
import { StyleSheet, View, Image } from 'react-native';
import Profile from './app/Screens/profile';
import Questions from './app/Screens/questionforms';
import MyQuestions from './app/Screens/myquestions';
import { toggleTheme } from './config/theme';
import colour from './config/colour';
import {  useDispatch } from 'react-redux';


const Stack = createStackNavigator();

const AppWrapper = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme !== 'false') {
          dispatch(toggleTheme());
        }
        if (storedToken) {
          const apiUrl = 'https://jee5.pythonanywhere.com/api/users/verify/';
          const body = JSON.stringify({ token: storedToken });

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          });

          setIsLoggedIn(response.ok);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking for token:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colour.background}
        />
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'JEE5' : 'Login'}
          screenOptions={{
            headerStyle: {
              backgroundColor: colour.head,
              height: 50,
            },
            headerTintColor: '#E9E3E3',
            headerTitleStyle: {
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 24,
            },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="JEE5" component={HomeScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Question Post" component={Questions}/>
          <Stack.Screen name="Help & Support" component={Forms} />
          <Stack.Screen name="My Questions" component={MyQuestions}/>
        </Stack.Navigator>
      </NavigationContainer>

  );
};

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Image source={require('./app/assets/icon.png')} style={styles.loadingImage} />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#021433',
    alignItems: 'center',
  },
  loadingImage: {
    width: 64,
    height: 64,
  },
});

export default AppWrapper;
