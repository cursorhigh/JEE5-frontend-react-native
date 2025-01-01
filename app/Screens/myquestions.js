import React, { useEffect, useState } from 'react';
import { View,Alert, Text, Image, ActivityIndicator,Dimensions, TouchableWithoutFeedback, StyleSheet, ScrollView, Modal, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, FAB, Portal, Provider } from 'react-native-paper';
import Lightbox from 'react-native-lightbox-v2';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../../config/colour';

function MyQuestions(props) {
const isDarkMode = useSelector((state) => state.theme.isDarkMode);
const currentTheme = isDarkMode ? darkTheme : lightTheme;
const [data, setData] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);
const [processing, setProcessing] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const baseUrl = 'https://jee5.pythonanywhere.com'; 
const upvoteImage = require('../assets/up.png');  
const downvoteImage = require('../assets/down.png');  
const onRefresh = async () => {
    setRefreshing(true);
    try {
      const name = await AsyncStorage.getItem('pfname');
      const response = await fetch(`https://jee5.pythonanywhere.com/api/questions/?created_by=${name}`);
      const result = await response.json();

      const updatedData = result.map((item) => ({
        ...item,
        imageUrl: `${baseUrl}${item.content}`,
      }));

      setData(updatedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    onRefresh(); 
  }, []); 
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeAndResetModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };
  const deleteQuestion = async () => {
    setProcessing(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this question?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setProcessing(false),
          },
          {
            text: 'Delete',
            onPress: async () => {
              const response = await fetch(`https://jee5.pythonanywhere.com/api/questions/delete/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  question_id: selectedItem.id,
                  action: 'delete',
                  token: token,
                }),
              });
  
              if (response.ok) {
                setProcessing(false);
                onRefresh();
                closeAndResetModal();
              } else {
                console.error('Error deleting question:', response.statusText);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };
  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <Image source={require('../assets/icon.png')} style={styles.loadingImage} />
      <Title style={{color:currentTheme.txt}}>Loading...</Title>
    </View>
  );
  const MtScreen = () => (
    <View style={styles.loadingContainer}>
      <Image source={require('../assets/icon.png')} style={styles.loadingImage} />
      <Title style={{color:currentTheme.txt}}>Nothing Here : (</Title>
      <Title style={{color:currentTheme.txt}}>Please post some questions first !</Title>
    </View>
  );
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme.background,
        padding: 10,
    },
    card: {
      marginBottom: 20,
      borderRadius: 10,
      backgroundColor: currentTheme.head,
      
    },
    questionImage: {
      width: '100%',
      height: Dimensions.get('window').width * 9 / 16,
      resizeMode:'cover',
      borderRadius: 10,
      borderWidth:3,
      borderCurve:'circular',
      backgroundColor:currentTheme.background,
      borderColor:currentTheme.txt,
      padding: 1 , 
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 13,
    },
    voteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
        color:'white',
        width:'85%',
      },
    voteText: {
      color:'white',
    },
    line: {
        borderBottomColor: currentTheme.txt,
        borderBottomWidth: 1,
        marginVertical: 10,
      },
    voteImage: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: -3,
      bottom: 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: currentTheme.background,
      alignItems: 'center',
    },
    loadingImage: {
      width: 64,
      height: 64,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContainer: {
      width: '91%',
      padding: 20,
      backgroundColor: currentTheme.background,
      borderTopLeftRadius: 15,
      borderTopRightRadius:15,
      borderColor:currentTheme.txt,
      borderTopWidth:2,
      borderRightWidth:2,
      borderLeftWidth:2,
      elevation: 5,
    },
    modalContent: {
      padding: 10,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color:currentTheme.txt,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 10,
      color:currentTheme.txt,
    },
    deleteButton: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      width:'50%',
      marginTop: 10,
      alignItems: 'center',
      alignSelf:'center',
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  if (data === null) {
    return <LoadingScreen />;
  } else if (data && data.length === 0) {
    return <MtScreen />;
  }

  return (
    <Provider>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data ? (
          data.map((item) => (
            <Card key={item.id} style={styles.card}>
              <Lightbox>
                <Card.Cover source={{ uri: item.imageUrl }} style={styles.questionImage} />
              </Lightbox>
              <Card.Content>
                <Title numberOfLines={1} style={styles.titleText}>{item.title}</Title>
                <View style={styles.infoContainer}>
                  <View style={styles.voteContainer}>
                    <Image source={upvoteImage} style={styles.voteImage} />
                    <Text style={styles.voteText}>{item.question_upvotes}</Text>
                    <Image source={downvoteImage} style={styles.voteImage} />
                    <Text style={styles.voteText}>{item.question_downvotes}</Text>
                  </View>
                </View>
              </Card.Content>
              <FAB
                style={styles.fab}
                icon="dots-vertical"
                onPress={() => openModal(item)}
              />
            </Card>
          ))
        ) : null}
        <Portal>
          <Modal visible={modalVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={closeAndResetModal}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <ScrollView>
                    <View style={styles.modalContent}>
                      <Title style={styles.modalTitle}>{selectedItem?.title}</Title>
                      <View style={styles.line}></View>
                      <Paragraph style={styles.modalText}>Explanation: {selectedItem?.content_description}</Paragraph>
                      <Paragraph style={styles.modalText}>Posted by: {selectedItem?.created_by} (you)</Paragraph>
                      <Paragraph style={styles.modalText}>Tags: {selectedItem?.tags}</Paragraph>
                                  {processing ? (
                    <ActivityIndicator size="large" color="red" style={styles.loader} />
                  ) : (<TouchableOpacity onPress={deleteQuestion} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>)}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </Portal>
      </ScrollView>
    </Provider>
  );
}

export default MyQuestions;