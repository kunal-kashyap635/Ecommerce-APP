import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { myip } from '../myip';
import axios from 'axios';

const Editproduct = ({ route }) => {

    // product data received from backend
    const product = route.params;
    // console.log(product);

    // other hook that are necessary for working
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // hook to store value
    const [name, setName] = useState(product.item.product_name);
    const [description, setDescription] = useState(product.item.product_desc);
    const [mrp, setMrp] = useState(product.item.product_mrp);
    const [rate, setRate] = useState(product.item.product_rate);
    const [discount, setDiscount] = useState(product.item.discount);

    // automatically calculated the rate
    useEffect(() => {
        if (mrp && discount) {
            const calculatedRate = mrp - (mrp * (discount / 100));
            setRate(calculatedRate.toFixed(2).toString()); // Limit to 2 decimal places
        } else {
            setRate(""); // Clear rate if input is invalid
        }
    }, [mrp, discount]);

    // function for updating product
    handleSubmit = () => {
        setLoading(true);

        const api_url = `${myip}/updateproduct.php`;

        const formdata = new FormData();

        formdata.append('pid', product.item.id);
        formdata.append('name', name);
        formdata.append('desc', description);
        formdata.append('mrp', mrp);
        formdata.append('rate', rate);
        formdata.append('discount', discount);

        axios.post(`${api_url}`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response.data);
            if (response.data.status === 'success') {
                Alert.alert('Message', "Product Updated successfully...!");
                setName("");
                setDescription("");
                setMrp("");
                setDiscount("");
                setRate("");
            } else {
                alert("Error updating product item...!");
            }
            setLoading(false)
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
        });
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    editable={isEditing}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    editable={isEditing}
                    multiline
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>MRP</Text>
                <TextInput
                    style={styles.input}
                    value={mrp}
                    onChangeText={(text) => setMrp(text)}
                    editable={isEditing}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Discount (%)</Text>
                <TextInput
                    style={styles.input}
                    value={discount}
                    onChangeText={(text) => setDiscount(text)}
                    editable={isEditing}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Selling Price</Text>
                <TextInput
                    style={styles.input}
                    value={rate}
                    editable={isEditing}
                    keyboardType="numeric"
                />
            </View>

            {!isEditing ? (
                <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText}>Edit Product</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={() => handleSubmit()} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Update Product</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    )
}

export default Editproduct

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    button: {
        padding: 15,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    editButton: {
        backgroundColor: '#3498db',
    },
    updateButton: {
        backgroundColor: '#2ecc71',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})