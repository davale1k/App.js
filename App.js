import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase/app';
import 'firebase/database';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',
    background: '#f0f0f0',
    text: 'black',
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
};

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdnno_9yRsomtuWaRrpIJivnqgd02GCDs",
  authDomain: "allergen-product-database.firebaseapp.com",
  databaseURL: "https://allergen-product-database-default-rtdb.firebaseio.com",
  projectId: "allergen-product-database-default-rtdb",
  storageBucket: "allergen-product-database.appspot.com",
  messagingSenderId: "845583553352",
  appId: "1:845583553352:web:58ab38a02c02fd75b0597d",
  measurementId: "G-LCL1F6YVPM"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Tab = createBottomTabNavigator();

function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Allergen App</Text>
    </View>
  );
}

function BrowseProductPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Product Page</Text>
      <Text style={styles.text}>
        This page shows a list of products that are safe for people with
        allergies.
      </Text>
    </View>
  );
}

function ScanBarcodePage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

const handleBarCodeScanned = async ({ type, data }) => {
  setScanned(true);
  const productRef = firebase.database().ref('products/' + data);
  const snapshot = await productRef.once('value');
  if (snapshot.exists()) {
    const product = snapshot.val();
    navigation.navigate('ProductPage', { product });
  } else {
    alert(`Sorry, the product with barcode ${data} is not in our database.`);
  }
};

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

function ProductPage({ route }) {
  const { product } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.text}>Allergen information:</Text>
      <Text style={styles.text}>{product.allergens}</Text>
    </View>
  );
}

function SavedProductPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Product Page</Text>
      <Text style={styles.text}>
        This page shows a list of products that you have saved for future
        reference.
      </Text>
    </View>
  );
}

function ProfilePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Text style={styles.text}>
        This page shows your user profile information.
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'red',
        }}>
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./assets/bakery.png')}
                style={{ width: 25, height: 25, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Browse Products"
          component={BrowseProductPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./assets/bakery.png')}
                style={{ width: 25, height: 25, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Scan Barcode"
          component={ScanBarcodePage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./assets/bakery.png')}
                style={{ width: 25, height: 25, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Saved Products"
          component={SavedProductPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./assets/bakery.png')}
                style={{ width: 25, height: 25, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./assets/bakery.png')}
                style={{ width: 25, height: 25, tintColor: color }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gainsboro',
  },
  title: {
    top: -200,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

