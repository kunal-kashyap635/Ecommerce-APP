import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { myip } from '../myip';

const Orderdetails = ({ navigation, route }) => {

    const order = route?.params;
    console.log(order);

    // hook to store values for dynamic status changes and updation 
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [isUpdating, setIsUpdating] = useState(false); // Tracks if the update is in progress

    // Status options with corresponding codes
    const statusOptions = [
        { label: 'Under Process', value: 'UNDER PROCESS', code: 1 },
        { label: 'Transited', value: 'TRANSITED', code: 2 },
        { label: 'Delivered', value: 'DELIVERED', code: 3 },
        { label: 'Canceled', value: 'CANCELED', code: 4 },
    ];

    // function that handles update
    const handleUpdateStatus = () => {
        setIsUpdating(true);
        try {
            // get the selected status code
            const selectedCode = statusOptions.find((opt) => opt.value === selectedStatus)?.code;

            // In a real app, you would call your API here
            const api_url = `${myip}/updateorders.php`;

            const formData = new FormData();
            formData.append('id', order.oid)
            formData.append('status', selectedStatus)
            formData.append('scode', selectedCode)

            axios.post(`${api_url}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log(response.data);
                    if (response.data.status === 'success') {
                        Alert.alert('Success', 'Order status updated successfully!');
                        navigation.goBack();
                    } else {
                        Alert.alert('Error', 'Failed to update order status');
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'An error occurred while updating the status');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.orderCard}>
                <Text style={styles.orderTitle}>Order #{order.oid}</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Customer:</Text>
                    <Text style={styles.detailValue}>{order.customerName} (ID: {order.customerId})</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order Date:</Text>
                    <Text style={styles.detailValue}>{order.orderDate}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order Total:</Text>
                    <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
                </View>
            </Card>

            <Text style={styles.productsTitle}>Products ({order.products.length})</Text>

            <FlatList
                data={order.products}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => `${order.oid}-${item.productId}`}
                renderItem={({ item }) => (
                    <Card containerStyle={styles.productCard}>
                        <Text style={styles.productName}>{item.pname}</Text>
                        <View style={styles.productDetailRow}>
                            <Text style={styles.detailLabel}>Quantity:</Text>
                            <Text style={styles.detailValue}>{item.qty}</Text>
                        </View>
                        <View style={styles.productDetailRow}>
                            <Text style={styles.detailLabel}>Rate:</Text>
                            <Text style={styles.detailValue}>₹{item.rate}</Text>
                        </View>
                        <View style={styles.productDetailRow}>
                            <Text style={styles.detailLabel}>Total:</Text>
                            <Text style={styles.productTotal}>₹{item.productTotal}</Text>
                        </View>
                    </Card>

                )}
            />
            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedStatus}
                        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#333"
                    >
                        {statusOptions.map((option) => (
                            <Picker.Item
                                key={option.value}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateStatus()}
                disabled={isUpdating || selectedStatus === order.status} >
                <Text style={styles.buttonText}>
                    {isUpdating ? 'Updating...' : 'Update Status'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Orderdetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 10,
    },
    orderCard: {
        borderRadius: 10,
        marginBottom: 15,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    detailValue: {
        fontSize: 14,
        color: '#34495e',
        fontWeight: '500',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    productsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#2c3e50',
    },
    productCard: {
        borderRadius: 8,
        marginBottom: 10,
        padding: 12,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#2c3e50',
    },
    productDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    productTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    statusContainer: {
        marginTop: 20,
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#2c3e50',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
