import React, { useEffect, useState } from 'react';
import { TextInput as PaperTextInput, Button, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, StyleSheet, ScrollView,ActivityIndicator,Alert, View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../../config/colour';
import * as ImagePicker from 'expo-image-picker';

function Questions(props) {
  const navigation = useNavigation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const [processing, setProcessing] = useState(false);
  const [storedName, setStoredName] = useState('');
  const [storedToken, setStoredToken] = useState('');
  const [formData, setFormData] = useState({
    question: '',
    explaination: '',
    contentImage: null,
    tagsGroup1: ['jee mains'],
    tagsGroup2: ['physics'],
    createdBy: '',
  });

  useEffect(() => {
    const getStoredName = async () => {
      try {
        const name = await AsyncStorage.getItem('pfname');
        const token = await AsyncStorage.getItem('authToken');
        setStoredName(name);
        setStoredToken(token);
      } catch (error) {
        console.error('Error retrieving info :', error);
      }
    };
    getStoredName();
  }, []);
  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleTagPress = (tag, group) => {
    setFormData((prevFormData) => {
      const updatedTags = [...prevFormData[`tagsGroup${group}`]];
      if (updatedTags.length === 1 && updatedTags.includes(tag)) {
        return prevFormData;
      }
      if (updatedTags.includes(tag)) {
        const index = updatedTags.indexOf(tag);
        updatedTags.splice(index, 1);
      } else {
        updatedTags.push(tag);
      }

      return { ...prevFormData, [`tagsGroup${group}`]: updatedTags };
    });
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: undefined,
      quality: 0.6,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setFormData((prevFormData) => ({ ...prevFormData, createdBy: storedName }));
      setFormData((prevFormData) => ({ ...prevFormData, contentImage: selectedAsset.uri }));
    }
  };

  const handleCloseImage = () => {
    setFormData((prevFormData) => ({ ...prevFormData, contentImage: null }));
  };

  const handleCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: undefined,
      quality: 0.6,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setFormData((prevFormData) => ({ ...prevFormData, createdBy: storedName }));
      setFormData((prevFormData) => ({ ...prevFormData, contentImage: selectedAsset.uri }));
    }
  };

  const renderTags = (tags, group) => {
    return tags.map((tag) => (
      <TouchableOpacity
        key={tag}
        style={[styles.tag, { backgroundColor: formData[`tagsGroup${group}`].includes(tag) ? currentTheme.primary : currentTheme.background }]}
        onPress={() => handleTagPress(tag, group)}
      >
        <Text style={{ color: currentTheme.txt }}>{tag}</Text>
      </TouchableOpacity>
    ));
  };

  const handleSubmit = async () => {
    if (!formData.question || !formData.explaination || !formData.contentImage) {
      Alert.alert('Validation Error', 'Please provide all the necessary information (Question, Explanation, and Image).');
    } else if (formData.question.length <5 ) {
      Alert.alert('Validation Error', 'Question must be at least 5 characters long.');
    } else if (formData.explaination.length < 10) {
      Alert.alert('Validation Error', 'Explanation must be at least 10 characters long.');
    } else {
      setProcessing(true);
      try {
        const data = new FormData();
      const allTags = [...formData.tagsGroup1, ...formData.tagsGroup2];
      data.append('title', formData.question);
      data.append('content_description', formData.explaination);
      data.append('content', {
        uri: formData.contentImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      data.append('tags', allTags.join(','));
      data.append('created_By', formData.createdBy);
      const apiUrl = 'https://jee5.pythonanywhere.com/api/questions/';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Question Posted Successfully! ');
        navigation.reset({
          index: 0,
          routes: [{ name: 'JEE5' }],
        });
      } else {
        Alert.alert('Error', 'An error occurred while Posting the question try again later or repot this error message .',responseData.message);
      }
    } catch (error) {
      Alert.alert('Report this Error','An error occurred while Posting the question try again later or repot this error message :- '+ error.message);
    }finally {
      setProcessing(false);
    }
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
    input: {
      marginBottom: 16,
      backgroundColor: currentTheme.background,
      width: '80%',
      color: 'pink',
    },
    button: {
      borderRadius: 10,
      marginTop: 20,
      padding: 3,
      width: '60%',
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
      justifyContent: 'center',
    },
    tag: {
      margin: 4,
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentTheme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tagBox: {
      width: '80%',
      borderColor: currentTheme.primary,
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      marginBottom: 16,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'cover',
      borderRadius: 8,
    },
    imagePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      borderWidth: 1,
      borderColor: currentTheme.primary,
      borderRadius: 8,
      padding: 8,
      marginBottom: 15,
    },
    imagePickerTouchable: {
      width: 60,
      height: 60,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.background,
    },
    smallImage: {
      width: 60,
      height: 60,
      resizeMode: 'cover',
      borderWidth: 2,
      borderRadius: 8,
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: 'red',
      padding: 2,
      borderRadius: 10,
    },
  });

  return (
    <ScrollView style={{ backgroundColor: currentTheme.background }}>
      <View style={styles.container}>
        <TouchableOpacity>
          <Avatar.Image source={require('../assets/icon.png')} size={130} marginBottom={30} padding={'1%'} />
        </TouchableOpacity>
        <PaperTextInput
          label="Question"
          value={formData.question}
          onChangeText={(value) => handleChange('question', value)}
          theme={{ colors: { onSurfaceVariant: currentTheme.txt } }}
          style={styles.input}
          textColor={currentTheme.txt}
          mode="outlined"
        />
        <PaperTextInput
          label="Explain Question"
          value={formData.explaination}
          onChangeText={(value) => handleChange('explaination', value)}
          theme={{ colors: { onSurfaceVariant: currentTheme.txt } }}
          multiline
          style={styles.input}
          textColor={currentTheme.txt}
          mode="outlined"
        />
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imagePickerTouchable} onPress={handleCamera}>
            <Image source={require('../assets/camera.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
          {formData.contentImage ? (
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: formData.contentImage }} style={styles.smallImage} />
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseImage}>
                <Text style={{ color: 'black', fontSize: 15 }}>⨯</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ color: currentTheme.txt, marginTop: 10, textAlign: 'center', width: 150 }}>Pick Image of question </Text>
          )}
          <TouchableOpacity style={styles.imagePickerTouchable} onPress={handleImagePicker}>
            <Image source={require('../assets/file.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.tagBox}>
          <Text style={{ color: currentTheme.txt, marginBottom: 0, textAlign: 'center' }}>Tags </Text>
          <View style={styles.tagContainer}>
            {renderTags(['jee mains', 'jee advanced'], 1)}
            {renderTags(['physics', 'chemistry', 'maths'], 2)}
          </View>
        </View>
        <PaperTextInput
          label="Created By"
          value={storedName}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { onSurfaceVariant: currentTheme.txt } }}
          textColor={currentTheme.txt}
          editable={false}
        />
        {processing ? (
        <ActivityIndicator size="large" color="#009600" style={styles.loader} />
      ) : (
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      )}
      </View>
    </ScrollView>
  );
}

export default Questions;
