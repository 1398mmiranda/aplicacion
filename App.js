import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import uploadToAnonymousFilesAsync from "anonymous-files";

//import { useState } from "react/cjs/react.production.min";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("permission to access camera is required");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    if (Platform.OS === 'web'){
      const remoteUri=await uploadToAnonymousFilesAsync (pickerResult.uri)
      setSelectedImage ({localUri: pickerResult.uri, remoteUri})

    } else{
      setSelectedImage({ localUri: pickerResult.uri });
    }
    


  };
  const openSharesDilog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("the image is available for sharing at: ${selectedImage.remoteUri}");
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Pick an Image!!</Text>
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image
          source={{
            uri:
              selectedImage !== null
                ? selectedImage.localUri
                : "https://picsum.photos/200/300 ",
          }}
          style={styles.image}
        />
      </TouchableOpacity>
      {selectedImage ? (
        <TouchableOpacity style={styles.button} onPress={openSharesDilog}>
          <Text style={styles.buttonText}> Shared this image</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292929",
  },
  title: { fontSize: 30, color: "#fff" },
  image: { width: 200, height: 200, borderRadius: 100, resizeMode: "contain" },
  button: {
    marginTop: 20,
    backgroundColor: "deepskyblue",
    padding: 7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});

export default App;
