import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { myip } from '@/myip';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Orderpage = ({ route }) => {

    // fetching orderid through route
    const order_id = route?.params?.orderid;

    // function saving order id in secure store
    const saveOrderid = async (orderid) => {
        try {
            await SecureStore.setItemAsync('order_id', orderid);
        } catch (error) {
            console.error('Error saving order data:', error);
        }
    }
    useEffect(()=>{
        saveOrderid(order_id)
    },[order_id])

    // hook to store value received from server
    const [orderid, setOrderid] = useState('');
    const [orderamt, setOrderamt] = useState('');
    const [edd, setEdd] = useState('');
    const [email, setEmail] = useState('');

    // function called in useeffect to load data
    useEffect(() => {
        const orderdata = () => {
            const api_url = `${myip}/orderdata.php`;

            const fromdata = new FormData();
            fromdata.append('oid', order_id);

            axios.post(`${api_url}`, fromdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status === 'success') {
                        setOrderid(response.data.orderdata.oid);
                        setOrderamt(response.data.orderdata.oamt);
                        setEdd(response.data.orderdata.edd);
                        setEmail(response.data.orderdata.email);
                    } else {
                        Alert.alert("Message", "Invalid data");
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        orderdata();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thank You for Your Order!</Text>
            <View style={styles.detailBox}>
                <Text style={styles.detail}>Order ID: {orderid}</Text>
                <Text style={styles.detail}>Paid Amount: ₹{orderamt}</Text>
                <Text style={styles.detail}>Expected Delivery: {edd}</Text>
                <Text style={styles.message}>A confirmation email has been sent to {email}.</Text>
            </View>
        </View>
    )
}

export default Orderpage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ff6f61',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'left',
        marginBottom: 20,
    },
    detailBox: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 15,
    },
    detail: {
        fontSize: 16,
        fontWeight: '900',
        color: '#333',
        textAlign: 'left',
    },
    message: {
        fontSize: 16,
        marginTop: 20,
        color: '#4CAF50',
        fontStyle: 'italic',
        textAlign: 'left',
    },
})