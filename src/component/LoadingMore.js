import React from 'react'
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native'
import PropTypes from 'prop-types'
import Spinkit from 'react-native-spinkit'
import {Theme} from "teaset";

export default class LoadingMore extends React.Component {
    static propTypes = {
        hasMore: PropTypes.bool,
        showText: PropTypes.bool,
        showSimple: PropTypes.bool,
        text: PropTypes.string,
        type: PropTypes.string,
    };

    static defaultProps = {
        hasMore: true,
        showText: true,
        text: '——  我是有底线的  ——',
        type: 'Wave',
        showSimple: false
    };

    render() {
        let {hasMore, showText, text} = this.props;
        if (hasMore) {
            return (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {!this.props.showSimple ? <Spinkit
                        type={this.props.type}
                        color={Theme.defaultColor}
                    /> : <ActivityIndicator
                        color={Theme.defaultColor}
                        style={styles.loadingMore}
                        size="small"
                        {...this.props}
                    />}

                </View>
            )
        }
        if (!hasMore && showText) {
            return <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10
            }}>
                <Text style={{fontSize: 14, color: Theme.defaultColor}}>{text}</Text>
            </View>
        }
        return <View/>;
    }
}

const styles = StyleSheet.create({
    loadingMore: {
        marginVertical: 10
    },
});
