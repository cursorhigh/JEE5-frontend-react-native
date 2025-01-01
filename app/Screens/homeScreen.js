import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../../config/colour';

function HomeScreen(props) {
  const navigation = useNavigation();
  const navigateToForms = () => {
    navigation.navigate('Help & Support');
  };
  const navigateToQuestion = () => {
    navigation.navigate('Question Post');
  };
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const currentTheme = isDarkMode ? darkTheme : lightTheme ;
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };
  const [isPressedJEE, setIsPressedJEE] = useState(true);
  const [isPressedAdvanced, setIsPressedAdvanced] = useState(false);
  const [isPressedPhysics, setIsPressedPhysics] = useState(true);
  const [isPressedChemistry, setIsPressedChemistry] = useState(false);
  const [isPressedMaths, setIsPressedMaths] = useState(false);

  const handlePressGroup1 = (stateUpdater1) => {
    if (isPressedJEE && !isPressedAdvanced) {
      stateUpdater1(true);
    } else if (isPressedAdvanced && !isPressedJEE) {
      stateUpdater1(true);
    } else {
      stateUpdater1(!isPressedJEE);
    }
  };
  const handlePressGroup2 = (stateUpdater,what) => {
    if (what === 'physics') {
      if (isPressedChemistry ||isPressedMaths) {
        stateUpdater(!isPressedPhysics);
      }
    } else if (what === 'chemistry') {
      if (isPressedPhysics || isPressedMaths) {
        stateUpdater(!isPressedChemistry);
      }
    } else if (what === 'maths') {
      if (isPressedPhysics || isPressedChemistry) {
        stateUpdater(!isPressedMaths);
      }
    }else {
      stateUpdater(true);
    }
  };
  const buttonStyle = (isPressed) => ({
    flex: 1,
    backgroundColor: isPressed ? currentTheme.secondary : currentTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
  });
  const buttonText = (isPressed) => ({
    color: isPressed ? 'white' : currentTheme.btxt,
    fontWeight: 'bold',
  });
  
const topstyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '6%',
    flexDirection: 'row',
    top: 4,
    width: '100%',
  },
});

const bottomstyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '9%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentTheme.background,
  },
});

  return (
    <View style={styles.container}>
      <View style={topstyles.container}>
        <TouchableOpacity
          style={buttonStyle(isPressedJEE)}
          onPress={() => handlePressGroup1(setIsPressedJEE)}
        >
          <Text style={buttonText(isPressedJEE)}>JEE Mains</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={buttonStyle(isPressedAdvanced)}
          onPress={() => handlePressGroup1(setIsPressedAdvanced)}
        >
          <Text style={buttonText(isPressedAdvanced)}>JEE Advanced</Text>
        </TouchableOpacity>
      </View>

      <View style={[topstyles.container, { top: 8, position: 'relative' }]}>
        <TouchableOpacity
          style={buttonStyle(isPressedPhysics)}
          onPress={() => handlePressGroup2(setIsPressedPhysics,'physics')}
        >
          <Text style={buttonText(isPressedPhysics)}>Physics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonStyle(isPressedChemistry)}
          onPress={() => handlePressGroup2(setIsPressedChemistry,'chemistry')}
        >
          <Text style={buttonText(isPressedChemistry)}>Chemistry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonStyle(isPressedMaths)}
          onPress={() => handlePressGroup2(setIsPressedMaths,'maths')}
        >
          <Text style={buttonText(isPressedMaths)}>Maths</Text>
        </TouchableOpacity>
      </View>

      <View style={bottomstyles.container}>
        <TouchableOpacity
          style={[buttonStyle(false), { backgroundColor: currentTheme.b1 }]}
          onPress={navigateToForms}
        >
          <Image source={require('../assets/help.png')} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[buttonStyle(false), { backgroundColor: currentTheme.b2 }]}
          onPress={navigateToQuestion}
        >
          <Image source={require('../assets/add.png')} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[buttonStyle(false), { backgroundColor: currentTheme.b1 }]}
          onPress={navigateToProfile}
        >
          <Image source={require('../assets/user.png')} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default HomeScreen;