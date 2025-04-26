import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { myip } from '../myip';
import { getAuthToken } from './usetoken';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Seeorder = ({ navigation }) => {

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

  // hook to store fetch order data
  const [fetchdata, setFetchdata] = useState([]);
  const [error, setError] = useState(null);

  // Group products by order ID and calculate total
  const groupOrders = (orderData) => {
    const grouped = {};

    orderData.forEach((item) => {
      if (!grouped[item.oid]) {
        grouped[item.oid] = {
          oid: item.oid,
          customerName: item.name,
          customerId: item.id,
          totalAmount: item.payamt,
          status: item.status,
          orderDate: item.odate,
          products: []
        };
      }
      grouped[item.oid].products.push({
        productId: item.pid,
        pname: item.pname,
        qty: item.qty,
        rate: item.rate,
        productTotal: item.amt
      });
    });

    return Object.values(grouped);
  };

  // function that takes orderdetails from database
  const fetchorders = () => {
    const api_url = `${myip}/fetchorderdetails.php`;

    const formData = new FormData();
    formData.append('tkn', accesstkn)

    axios.post(`${api_url}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response.data);
        if (response.data.status === 'success') {
          setFetchdata(groupOrders(response.data.orderdata));
        } else {
          setError('Failed to fetch orders');
        }
      })
      .catch(error => {
        console.error(error);
        setError(error);
      });
  }

  // condition for checking if admin logged or not and getting authorized token
  useEffect(() => {
    getAuthToken(SecureStore, navigation);
    Token();
  }, []);

  // once you get access token then my fetchorders function is called.
  useEffect(() => {
    if (accesstkn) {
      fetchorders();
    }
  }, [accesstkn]);
  
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const senorderdata = (item) => {
    navigation.navigate('orderdetails', item);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary Of ShipKart</Text>
      <FlatList
        data={fetchdata}
        keyExtractor={(item) => item.oid.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => senorderdata(item)}>
            <Card containerStyle={styles.card}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.oid}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer:</Text>
                <Text style={styles.detailValue}>{item.customerName} (ID: {item.customerId})</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{item.orderDate}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.totalAmount}>₹{item.totalAmount}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

export default Seeorder

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: 'red',
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: 'gray',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
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
  listContainer: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
  },
})