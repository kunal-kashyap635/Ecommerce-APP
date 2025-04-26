import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Customerdetails = ({ route }) => {

    const customer = route.params;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer Information</Text>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{customer.name}</Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{customer.email}</Text>

                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{customer.phone}</Text>

                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{customer.address}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order History ({customer.orders.length})</Text>
                {customer.orders.length > 0 ? (
                    customer.orders.map(order => (
                        <View key={order.id} style={styles.orderItem}>
                            <Text style={styles.orderId}>Order #{order.id}</Text>
                            <Text style={styles.orderDate}>{order.date}</Text>
                            <Text style={styles.orderTotal}>₹{order.total}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noOrders}>No orders found</Text>
                )}
            </View>
        </ScrollView>
    )
}

export default Customerdetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    label: {
        fontSize: 18,
        color: '#777',
        marginBottom: 3,
    },
    value: {
        fontSize: 20,
        marginBottom: 10,
        color: '#333',
    },
    orderItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    orderId: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    orderDate: {
        color: '#666',
        fontSize: 13,
    },
    orderTotal: {
        color: '#2ecc71',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
    },
    noOrders: {
        color: '#999',
        fontStyle: 'italic',
    },
})