import React from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
} from 'react-native';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        backgroundColor: '#1976D2',
        padding: 20,
    },
    placeListContainer: {
        marginBottom: 20,
        marginTop: -6,
    },
    placeListTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 10,
        color: '#fff'
    },
    placeItem: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 8,
        color: '#fff'
    },
});

export default function LeftMenu({ onPlacesSelected, places }) {
    return (
        <ScrollView scrollsToTop={false} style={styles.menu}>
            <View style={styles.placeListContainer}>
                <Text style={styles.placeListTitle}>Nearby Channels</Text>
                {places.map(place => {
                    return (
                        <View key={place.placeId} style={{flexDirection: 'row'}}>
                            <View style={{width: '10%'}}>
                                <Text style={styles.placeItem}>#</Text>
                            </View>
                            <View style={{width: '90%'}}>
                                <Text style={styles.placeItem}
                                      onPress={() => onPlacesSelected(place)}
                                >{place.placeName}</Text>
                            </View>
                        </View>
                    )}
                )}
            </View>
        </ScrollView>
    );
}

LeftMenu.propTypes = {
    onPlacesSelected: PropTypes.func.isRequired,
};