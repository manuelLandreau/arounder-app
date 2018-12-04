import React from 'react';
import PropTypes from 'prop-types';
import {
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';

export default function RightMenu({onLogout}) {
    return (
        <ScrollView scrollsToTop={false} style={styles.menu}>
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={{ uri }}
                />
                <Text style={styles.name}>Your name</Text>
            </View>
            <TouchableOpacity onPress={onLogout}>
                <Text style={{padding: 5}}><Icon name="md-build" style={styles.actionButtonIcon}/> Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout}>
                <Text style={{padding: 5}}><Icon name="md-log-out" style={styles.actionButtonIcon}/> Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

RightMenu.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor: '#1976D2',
        padding: 20,
    },
    avatarContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    avatar: {
        height: 47,
        width: 47,
        borderRadius: 3,
        flex: 1,
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20,
        fontSize: 16,
        color: '#fff'
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 5,
        color: '#fff'
    },
});