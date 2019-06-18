import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, ScrollView, Image, Dimensions } from 'react-native'
import { Container, Content } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons'

export class MediaScreen extends Component {

    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content>
                        <View>
                            <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'right', padding: 10 }}>
                                Media
                        </Text>
                        </View>
                        <View style={styles.container}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View>
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/1.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/2.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/3.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/4.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/5.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/6.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/7.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.images}
                                        source={require('../../../../images/8.jpg')}
                                        resizeMode={'stretch'}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </Content>
                </Container>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    images: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
})

export default MediaScreen
