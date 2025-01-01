import React, { useEffect, useState } from 'react';
import { View, Text,Alert,TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Divider, Switch as PaperSwitch, Button as PaperButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { lightTheme, darkTheme } from '../../config/colour';
import { toggleTheme } from '../../config/theme';
const Profile = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const handleAvatarTap = () => {
    setImageIndex((imageIndex + 1) % imagePaths.length);
  };  
  const imagePaths = [
    require('../assets/p1.png'),
    require('../assets/p2.png'),  
    require('../assets/p3.png'),
    require('../assets/p4.png'),
    require('../assets/p5.png'),
  ];
  const [storedName, setStoredName] = useState('');
  useEffect(() => {
    const getStoredName = async () => {
      try {
        const name = await AsyncStorage.getItem('pfname');

        setStoredName(name);
      } catch (error) {
        console.error('Error retrieving pfname:', error);
      }
    };
    getStoredName();
  }, []);
  const [imageIndex, setImageIndex] = useState(Math.floor(Math.random() * imagePaths.length));
  const toggleDarkMode = async () => {
    dispatch(toggleTheme());
    await AsyncStorage.setItem('theme',JSON.stringify(!isDarkMode));
  };

  const removeAuthToken = async () => {
    try {
      // Show a confirmation alert
      Alert.alert(
        'Logout Confirmation',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              // User confirmed, remove authToken
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('pfname');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error removing authToken:', error);
      // Navigate to Login screen even if there is an error
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };
  const handleCredits = () => {
    // Implement credits logic
  };
  const handleMyquestion = () => {
    navigation.navigate('My Questions');
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.background,
      paddingHorizontal: 20,
    },
    profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: currentTheme.txt,
      marginVertical: 20,
    },
    themetxt: {
      fontSize: 25,
      fontWeight: 'bold',
      color: currentTheme.txt,
    },
    divider: {
      height: 5,
      width: '100%',
      backgroundColor: currentTheme.line,
      marginVertical: 10,
    },
    themeSwitchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      color:'white',
    },
    label: {
      fontSize: 18,
      marginRight: 10,
      color: currentTheme.txt,
    },
    button: {
      marginVertical: 10,
      width: '60%',
    },
    buttonText: {
      color: currentTheme.txt,
      fontSize: 16
    },
  });
  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={handleAvatarTap}>
        <Avatar.Image
          source={imagePaths[imageIndex]}
          size={150}
        />
      </TouchableOpacity>
      <Text style={styles.profileName}>{storedName || "You didn't saved your login"}</Text>

      <Divider style={styles.divider} />

      <View style={styles.themeSwitchContainer}>
      <Text style={styles.themetxt }>Theme: {isDarkMode ? 'Dark' : 'Light'}</Text>
        <PaperSwitch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          color= {currentTheme.switch}
        />
      </View>

      <Divider style={styles.divider} />
      <PaperButton
        mode="outlined"
        onPress={handleMyquestion}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        My Questions
      </PaperButton>
      <Divider style={styles.divider} />
      <PaperButton
        mode="contained"
        onPress={removeAuthToken}
        style={styles.button}
        labelStyle={{ ...styles.buttonText, color: 'white' }}
      >
        Logout
      </PaperButton>
      <Divider style={styles.divider} />

      <PaperButton
        mode="outlined"
        onPress={handleCredits}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Credits
      </PaperButton>

      <Divider style={styles.divider} />
    </View>
  );
};



export default Profile;