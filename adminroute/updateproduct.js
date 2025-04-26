import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { myip } from '../myip';
import axios from 'axios';
import { getAuthToken } from './usetoken';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';

const Updateproduct = ({ navigation }) => {

  // hook to store value received from backend server
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetching accesstkn to get started for it
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

  // condition for checking if admin logged or not and getting authorized token
  useEffect(() => {
    getAuthToken(SecureStore, navigation);
    Token();
  }, []);

  // once you get access token then my fetchproductdata function is called.
  useEffect(() => {
    if (accesstkn) {
      fetchproductdata();
    }
  }, [accesstkn]);

  // fetching product data for updating
  const fetchproductdata = () => {
    const api_url = `${myip}/fetchproduct.php`;

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
          setProduct(response.data.productdata);
        } else {
          console.log('failed to fetch product....');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }

  // Navigate to edit product screen
  const handleProductPress = (item) => {
    navigation.navigate('editproduct', {
      item,
      onGoBack: () => fetchproductdata() // Refresh list after update
    });
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Select Product to Update</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={product}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <MaterialIcons name="edit" size={24} color="#666" />
              </View>

              <Text style={styles.productCategory}>Category: {item.category}</Text>

              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>MRP:</Text>
                  <Text style={styles.mrpPrice}>₹{item.product_mrp}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Selling Price:</Text>
                  <Text style={styles.sellingPrice}>₹{item.product_rate}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Discount:</Text>
                  <Text style={styles.discountText}>{item.discount}%</Text>
                </View>
              </View>

              <Text style={styles.productDesc}>{item.product_desc}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      )}
    </View>
  )
}

export default Updateproduct

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  productCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: '#34495e',
  },
  mrpPrice: {
    fontSize: 14,
    color: '#7f8c8d',
    textDecorationLine: 'line-through',
  },
  sellingPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  discountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  productDesc: {
    fontSize: 14,
    color: '#34495e',
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
})
