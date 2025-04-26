import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { getAuthToken } from './usetoken';
import { myip } from '../myip';
import axios from 'axios';

const Addproduct = ({ navigation }) => {

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

    // hook for dynamic categories
    const [categories, setCategories] = useState([])

    // load data that we want to change dynamically in category
    const fetchCategories = () => {
        const api_url = `${myip}/getcategory.php`;

        axios.post(`${api_url}`)
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'success') {
                    setCategories(response.data.categories);
                } else {
                    alert("No item found...!");
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    // condition for checking if admin logged or not and load dynamic category
    useEffect(() => {
        getAuthToken(SecureStore, navigation);
        fetchCategories();
        Token();
    }, []);


    //hook to store data
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [mrp, setMrp] = useState("");
    const [rate, setRate] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");

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

    // automatically calculated the rate
    useEffect(() => {
        if (mrp && discount) {
            const calculatedRate = mrp - (mrp * (discount / 100));
            setRate(calculatedRate.toFixed(2).toString()); // Limit to 2 decimal places
        } else {
            setRate(""); // Clear rate if input is invalid
        }
    }, [mrp, discount]);

    const handleSubmit = () => {

        const api_url = `${myip}/productdata.php`;

        if (!category || !category.cname || !category.cid) {
            alert("Please select a valid category!");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category.cname);
        formData.append('category_id', category.cid);
        formData.append('mrp', mrp);
        formData.append('rate', rate);
        formData.append('description', description);
        formData.append('discount', discount);
        formData.append('tkn', accesstkn);
        formData.append('file', {
            uri: file,
            type: filetype,
            name: fname,
        })

        console.log(JSON.stringify(formData));

        axios.post(`${api_url}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'success') {
                    Alert.alert('Message', "Product added successfully...!");
                    setName("");
                    setCategory("");
                    setDescription("");
                    setMrp("");
                    setDiscount("");
                    setRate("");
                } else {
                    alert("Error adding product item...!");
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Add Product Item</Text>

                <Text style={styles.title}>accesstkn : {accesstkn}</Text>

                <Text style={styles.text}>Product Name :</Text>
                <TextInput style={styles.input} placeholder="Enter Product name..." onChangeText={(text) => setName(text)} value={name} />

                <Text style={styles.text}>Product Category :</Text>
                <Picker selectedValue={category} onValueChange={(item) => setCategory(item)}>
                    {categories.map((item, index) => (
                        <Picker.Item label={item.cname} value={item} key={index} />
                    ))}
                </Picker>

                <Text style={styles.text}>Product Description:</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]} // Adjust height for large text input
                    placeholder="Enter Product description..."
                    multiline={true}
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                />

                <Text style={styles.text}>Product MRP :</Text>
                <TextInput style={styles.input} placeholder="Enter MRP of Product....." keyboardType="numeric" onChangeText={(text) => setMrp(text)} value={mrp} />

                <Text style={styles.text}>Discount (%):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Discount percentage..."
                    keyboardType="numeric"
                    onChangeText={(text) => setDiscount(text)}
                    value={discount}
                />

                <Text style={styles.text}>Product Rate :</Text>
                <TextInput style={styles.input} placeholder="Enter Rate of Product....." keyboardType="numeric" value={rate} editable={false} />

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

                <Button title="Add Product" onPress={() => handleSubmit()} />
            </View>
        </ScrollView>
    );
};

export default Addproduct;

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
        justifyContent: "center",
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
