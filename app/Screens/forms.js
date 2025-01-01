import React, { useEffect,useState } from 'react';
import { View, TouchableOpacity,StyleSheet, ActivityIndicator,Alert,ScrollView } from 'react-native';
import { Avatar,Title,TextInput as PaperTextInput, Button } from 'react-native-paper';
import { useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../../config/colour';
import emailjs from 'emailjs-com';

const Form = () => {
  const [processing, setProcessing] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const [storedName, setStoredName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
  });
  const sendEmail = async (formData) => {
    const { name, email, title, description } = formData;
  
    const service_id = 'service_t212pdq';
    const template_id = 'template_bnft6un';
    const user_id = "CsxFDbe_SySFHK3C2";
  
    const template_params = {
      name,
      email,
      title,
      description,
    };
    setProcessing(true);
    try {
      await emailjs.send(service_id,template_id,template_params,user_id);
      Alert.alert('Success', 'Forms Posted Successfully! ');
    } catch (error) {
      Alert.alert('Report this Error','An error occurred while submiting forms, Try again later.');
      console.error('Error sending email:', error);
    }finally {
      setProcessing(false);
    }
  };

  const [validation, setValidation] = useState({
    name: true,
    email: true,
    title: true,
    description: true,
  });
  useEffect(() => {
    const getStoredName = async () => {
      try {
        const name = await AsyncStorage.getItem('pfname');
        setStoredName(name);
      } catch (error) {
        console.error('Error retrieving info :', error);
      }
    };
    getStoredName();
  }, []);
  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setValidation((prevValidation) => ({ ...prevValidation, [name]: true }));
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = () => {
    setTimeout(() => {
      setFormData((prevFormData) => ({ ...prevFormData, name: storedName }));
      setValidation((prevValidation) => ({ ...prevValidation, name: true }));
    }, 500);
    const isFormValid = Object.values(formData).every((value) => value.trim() !== '');
    if (isFormValid) {
      if (formData.title.length < 8) {
        setValidation((prevValidation) => ({ ...prevValidation, title: false }));
        Alert.alert('Invalid Input', 'Title should be at least 10 characters.');
        return;
      }
      if (formData.description.length < 15) {
        setValidation((prevValidation) => ({ ...prevValidation, description: false }));
        Alert.alert('Invalid Input', 'Description should be at least 15 characters.');
        return;
      }
      if (!isValidEmail(formData.email)) {
        setValidation((prevValidation) => ({ ...prevValidation, email: false }));
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
      sendEmail(formData);
    } else {
      const updatedValidation = {};
      for (const key in formData) {
        updatedValidation[key] = formData[key].trim() !== '';
      }
      setValidation(updatedValidation);
      Alert.alert('Incomplete Form', 'Please fill in all the required fields.');
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.background,
      padding: 30,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: currentTheme.txt,
      marginBottom: 20,
    },
    input: {
    marginBottom: 16,
    backgroundColor: currentTheme.background,
    width:'90%',
    },
    inputError: {
      borderColor: 'red',
    },
    textArea: {
      textAlignVertical: 'top',
      height:100,
    },
    button: {
      borderRadius: 10,
      marginTop: 20,
      padding: 3,
      width: '60%',
    },
    buttonText: {
      color: 'white',
      fontSize: 12,
    },
  });

  return (
    <ScrollView  style={{ backgroundColor: currentTheme.background }}>
      <View style={styles.container}>
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
          style={[styles.input, !validation.name && styles.inputError]}
          label="Name"
          value={storedName}
          mode="outlined"
          textColor={currentTheme.txt}
          theme={{ colors: { onSurfaceVariant: currentTheme.txt} }}
          onChangeText={(value) => handleChange('name', value)}
          editable={false}
        />
        <PaperTextInput
          style={[styles.input, !validation.email && styles.inputError]}
          label="Email"
          textColor={currentTheme.txt}
          value={formData.email}
          mode="outlined"
          theme={{ colors: { onSurfaceVariant: currentTheme.txt} }}
          onChangeText={(value) => handleChange('email', value)}
        />
        <PaperTextInput
          style={[styles.input, !validation.title && styles.inputError]}
          label="Title"
          mode="outlined"
          textColor={currentTheme.txt}
          theme={{ colors: { onSurfaceVariant: currentTheme.txt} }}
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
        />
        <PaperTextInput
          style={[styles.input, styles.textArea, !validation.description && styles.inputError]}
          label="Description"
          textColor={currentTheme.txt}
          mode="outlined"
          theme={{ colors: { onSurfaceVariant:currentTheme.txt} }}
          multiline
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
        />
        {processing ? (
        <ActivityIndicator size="large" color="#009600" style={styles.loader} />
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          SUBMIT
        </Button>)}
      </View>
    </ScrollView>
  );
};



export default Form;