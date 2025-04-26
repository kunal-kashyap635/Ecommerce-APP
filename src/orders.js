import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { myip } from '@/myip';
import * as SecureStore from 'expo-secure-store';

const Orders = () => {

    // hook to store data
    const [ono, setOno] = useState(0);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    // function getting orderid which is saved in my expo secure store
    useEffect(() => {
        const loadorderid = async () => {
            try {
                const storedorderid = await SecureStore.getItemAsync('order_id');
                if (storedorderid) {
                    setOno(storedorderid);
                }
            } catch (error) {
                console.error('Error loading orderid:', error);
                setLoading(false);
            }
        };
        loadorderid();
    }, []);

    // Load orders from SecureStore when component mounts
    useEffect(() => {
        const loadOrders = async () => {
            try {
                // First try to load from local storage
                const storedOrders = await SecureStore.getItemAsync('order_key');
                if (storedOrders) {
                    setOrder(JSON.parse(storedOrders));
                }
                // Then fetch from server to get latest data
                handleorders();
            } catch (error) {
                console.error('Error loading orders:', error);
                setLoading(false);
            }
        };
        loadOrders();
    }, [ono]);

    // Save order data to SecureStore
    const saveOrderData = async (orderData) => {
        try {
            await SecureStore.setItemAsync('order_key', JSON.stringify(orderData));
        } catch (error) {
            console.error('Error saving order data:', error);
        }
    }

    // getting the data from the backend server of ono
    const handleorders = () => {
        try {
            const api_url = `${myip}/ordersummary.php`;
            const formData = new FormData();
            formData.append('id', ono);

            axios.post(api_url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status === 'success') {
                        setOrder(response.data.orderdata);
                        saveOrderData(response.data.orderdata);
                        setLoading(false);
                    } else {
                        console.log("Message", "no data received grom Api");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                })

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to load order details');
            setLoading(false);
        }
    };

    // format the amount
    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                {order.length > 0 && (
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Order Summary</Text>
                        <View style={styles.orderIdContainer}>
                            <Text style={styles.orderIdText}>Order #{order[0].oid}</Text>
                        </View>
                    </View>
                )}

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading order details...</Text>
                    </View>
                ) : order.length > 0 ? (
                    order.map((item, index) => (
                        <View key={index} style={styles.productCard}>
                            <View style={styles.productHeader}>
                                <Text style={styles.productName}>{item.pname}</Text>
                                <View style={[styles.statusBadge,
                                {
                                    backgroundColor: item.status === 'DELIVERED' ? '#4CAF50' :
                                        item.status === 'TRANSITED' ? '#FFC107' :
                                            item.status === 'CANCELED' ? '#F44336' : '#2196F3'
                                }]}>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Quantity:</Text>
                                <Text style={styles.detailValue}>{item.qty}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Rate:</Text>
                                <Text style={styles.detailValue}>{formatCurrency(item.rate)}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Total:</Text>
                                <Text style={[styles.detailValue, styles.totalAmount]}>{formatCurrency(item.oamt)}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No order details found</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default Orders;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2c3e50',
    },
    orderIdContainer: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    orderIdText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976d2',
    },
    productCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 16,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#4e73df',
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 15,
        color: '#495057',
        fontWeight: '500',
    },
    totalAmount: {
        color: '#2e59d9',
        fontWeight: '700',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6c757d',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
    },
});