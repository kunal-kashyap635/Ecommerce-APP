import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, DrawerLayoutAndroid } from 'react-native';
import cartlogo from '../../assets/images/logo.png';

const WelcomeScreen = ({ navigation }) => {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerRef = React.useRef(null);

    const navigationView = () => (
        <View style={[styles.drawerContainer, styles.navigationContainer]}>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                    navigation.navigate('adminLogin'); // Make sure you have this route
                    drawerRef.current?.closeDrawer();
                }}
            >
                <Text style={styles.drawerText}>Admin Login</Text>
            </TouchableOpacity>
        </View>
    );

    return (

        <DrawerLayoutAndroid ref={drawerRef} drawerWidth={300} drawerPosition="left" renderNavigationView={navigationView}
            onDrawerOpen={() => setDrawerOpen(true)}
            onDrawerClose={() => setDrawerOpen(false)}
        >
            <View style={styles.container}>

                <TouchableOpacity style={styles.menuButton} onPress={() => drawerRef.current?.openDrawer()}>
                    <Text style={styles.menuButtonText}>☰</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Welcome To Shipkart</Text>
                <View style={styles.logoout}>
                    <Image style={styles.logo} source={cartlogo} />
                </View>
                <View style={styles.hr80} />

                <Text style={styles.text}>
                    Your one-stop destination for everything you need...
                </Text>

                <View style={styles.hr80} />

                <View style={styles.btnout}>
                    <TouchableOpacity onPress={() => navigation.navigate('Signupscreen')}>
                        <Text style={styles.btn}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Loginscreen')}>
                        <Text style={styles.btn}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </DrawerLayoutAndroid>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'yellow',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButton: {
        position: 'absolute',
        top: 30,
        left: 15,
        zIndex: 1,
    },
    menuButtonText: {
        fontSize: 30,
        color: 'black',
    },
    drawerContainer: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    navigationContainer: {
        backgroundColor: '#f5f5f5',
    },
    drawerItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    drawerText: {
        fontSize: 18,
        color: 'black',
    },
    title: {
        fontSize: 50,
        color: 'black',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
    },
    logoout: {
        width: '92%',
        height: '30%',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    hr80: {
        width: '80%',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginVertical: 15,
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        width: '80%',
        fontWeight: 'bold',
    },
    btnout: {
        flexDirection: 'row',
    },
    btn: {
        fontSize: 30,
        color: 'red',
        textAlign: 'center',
        fontWeight: '700',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 15,
    },
});

export default WelcomeScreen;