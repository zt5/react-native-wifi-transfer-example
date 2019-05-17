import React, {PureComponent} from 'react';
import {Text, View, ScrollView} from "react-native";
import type {INavigation} from "../../interface/INavigation";
import utils from "../../util/utils";
import {withNavigationFocus} from "react-navigation";
import PropTypes from "prop-types";
import Spinkit from "react-native-spinkit";
import {Buffer} from "buffer";
import {BookData} from "../../util/Types";
import * as RNFS from "react-native-fs";

class LookBook extends PureComponent implements INavigation {

    static navigationOptions = ({navigation}) => ({
        tabBarVisible: false,
    });
    static propTypes = {
        book: PropTypes.any,
    };


    state = {
        content: null,
    };

    constructor(props) {
        super(props);
        utils.addNvHandler(this);
    }

    didFocus = () => {
        const book: BookData = this.props.book;
        RNFS.read(book.path, 8000, 0, "base64").then((content) => {
            let b = new Buffer(content, 'base64');
            this.setState({content:b.toString()})
        });
    };

    willBlur = () => {
    };

    componentWillMount(): void {
    }

    componentWillUnmount() {
        utils.removeNvHandler(this);
    }

    nextPageHandler = () => {
    };
    renderTxt = () => {
        const {content} = this.state;

        if (!content) {
            return <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
                <Text>读取中...</Text>
                <Spinkit
                    size={30}
                    type={"9CubeGrid"}
                />
            </View>
        }

        return (
            <Text style={{flex: 1}}
                  onPress={this.nextPageHandler}>
                {content}
            </Text>
        )
    };
    containerLayout = ({nativeEvent: {layout: {width, height}}}) => {
        console.warn(width,height);
    };

    render() {
        return (
            <View style={{flex: 1,padding:15}} onLayout={this.containerLayout}>
                {this.renderTxt()}
            </View>
        );
    }
}

LookBook = withNavigationFocus(LookBook);
export default LookBook;