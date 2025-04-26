import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { myip } from '../myip';

const Dashboard = ({ navigation }) => {

    const [accesstkn, setAccesstkn] = useState("");

    const getAuthToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                Alert.alert('Token', token);
                setAccesstkn(token);
            } else {
                // Alert.alert('No Token', 'No authentication token found');
                navigation.navigate('adminlogin');
            }
        } catch (error) {
            console.error('Error retrieving token', error);
            Alert.alert('Error', 'Failed to retrieve authentication token');
        }
    }

    useEffect(() => {
        getAuthToken();
    }, [])

    handlelogout = () => {
        const api_url = `${myip}/adminlogout.php`;

        const formdata = new FormData();
        formdata.append('atkn', accesstkn);
        formdata.append('logout', true);

        axios.post(`${api_url}`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log(response.data);
                if (response.data.status === 'success') {
                    Alert.alert("Message", "Logout successfully....");
                    SecureStore.deleteItemAsync('authToken');
                    SecureStore.deleteItemAsync('adminid');
                    navigation.navigate('adminlogin');
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.tokenText}>Token: {accesstkn}</Text>

            <View style={styles.buttonGrid}>
                {/* Row 1 */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.btn, styles.addProductBtn]} onPress={() => navigation.navigate('viewproduct')}>
                        <Text style={styles.btnText}>Add Product</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn, styles.addCategoryBtn]} onPress={() => navigation.navigate('category')}>
                        <Text style={styles.btnText}>Add Category</Text>
                    </TouchableOpacity>
                </View>

                {/* Row 2 */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.btn, styles.updateProductBtn]} onPress={() => navigation.navigate('updateproduct')}>
                        <Text style={styles.btnText}>Update Product</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn, styles.deleteProductBtn]} onPress={() => navigation.navigate('deleteproduct')}>
                        <Text style={styles.btnText}>Delete Product</Text>
                    </TouchableOpacity>
                </View>

                {/* Row 3 */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.btn, styles.ordersBtn]} onPress={() => navigation.navigate('seeorder')}>
                        <Text style={styles.btnText}>View Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn, styles.customersBtn]} onPress={() => navigation.navigate('customer')}>
                        <Text style={styles.btnText}>Manage Customers</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => handlelogout()}>
                <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    tokenText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    buttonGrid: {
        width: '100%',
        maxWidth: 500,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    btn: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addProductBtn: {
        backgroundColor: '#4CAF50', // Green
    },
    addCategoryBtn: {
        backgroundColor: '#2196F3', // Blue
    },
    updateProductBtn: {
        backgroundColor: '#FF9800', // Orange
    },
    deleteProductBtn: {
        backgroundColor: '#F44336', // Red
    },
    ordersBtn: {
        backgroundColor: '#9C27B0', // Purple
    },
    customersBtn: {
        backgroundColor: '#607D8B', // Blue Grey
    },
    logoutBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#F44336',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
})