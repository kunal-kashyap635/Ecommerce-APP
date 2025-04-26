import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Button } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from 'expo-secure-store';
import { getAuthToken } from './usetoken';
import axios from 'axios';
import { myip } from '../myip';

const Category = ({ navigation }) => {

    // getting authorized token
    const [accesstkn, setAccesstkn] = useState('');

    // getting accesstoken
    async function Token() {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                setAccesstkn(token);
            } else {
                console.log("No Token found");
            }
        } catch (error) {
            console.error('Error retrieving token', error);
        }
    }

    // condition for checking if admin logged or not
    useEffect(() => {
        getAuthToken(SecureStore, navigation);
        Token()
    }, []);

    // hook to store data
    const [categoryname, setCategoryname] = useState('');

    // Stores the selected image URI
    const [file, setFile] = useState(null);
    const [filetype, setFiletype] = useState(null);
    const [fname, setFname] = useState(null);
    // Stores any error message
    const [error, setError] = useState(null);

    // Function to pick an image from the device's media library
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            // If permission is denied, show an alert
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera 
                 roll permission to upload images.`
            );
        } else {
            // Launch the image library and get
            // the selected image
            const result = await ImagePicker.launchImageLibraryAsync();
            console.log(result);

            if (!result.canceled) {
                // If an image is selected (not cancelled), 
                // update the file state variable
                setFile(result.assets[0].uri);
                setFiletype(result.assets[0].mimeType);
                setFname(result.assets[0].fileName)
                // Clear any previous errors
                setError(null);
            }
        }
    };

    const handleSubmit = () => {
        const api_url = `${myip}/addcategory.php`;

        const formData = new FormData();
        formData.append('cname', categoryname);
        formData.append('tkn', accesstkn)
        formData.append('file', {
            uri: file,
            type: filetype,
            name: fname,
        })

        axios.post(`${api_url}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'success') {
                    alert("Category added successfully...!");
                    setCategoryname("");
                    setFile("");
                    setFiletype("");
                    setFname("");
                } else {
                    alert("Error adding in category...!");
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Product Category</Text>

            <Text style={styles.title}>accesstkn : {accesstkn}</Text>

            <Text style={styles.text}>Category Name :</Text>
            <TextInput style={styles.input} placeholder="Enter Category..." onChangeText={(text) => setCategoryname(text)} value={categoryname} />

            <View style={styles.imgcontainer}>
                <Text style={styles.header}>
                    Product Image:
                </Text>

                {/* Button to choose an image */}
                <TouchableOpacity style={styles.button}
                    onPress={() => pickImage()}>
                    <Text style={styles.buttonText}>
                        Choose Image
                    </Text>
                </TouchableOpacity>

                {/* Conditionally render the image or error message */}
                {file ? (
                    // Display the selected image
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: file }} style={styles.image} />
                    </View>
                ) : (
                    // Display an error message if there's 
                    // an error or no image selected
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </View>
            <Button title="Add Category" onPress={() => handleSubmit()} />
        </View>
    )
}

export default Category

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: 'blue',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        marginLeft: 5,
    },
    input: {
        margin: 10,
        width: '90%',
        height: 50,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 10,
    },
    imgcontainer: {
        flex: 1,
        alignItems: "center",
        padding: 16,
    },
    header: {
        fontSize: 20,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    imageContainer: {
        borderRadius: 8,
        marginBottom: 16,
        elevation: 5,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    errorText: {
        color: "red",
        marginTop: 16,
    },
})