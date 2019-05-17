/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View} from "react-native";
import RouterConfig from "./src/router/RouterConfig";
import Spinkit from "react-native-spinkit";
import LocalDB from "./src/component/LocalDB";
import {Theme} from "teaset";
import BookUtils, {DefaultLibId, DefaultLibName} from "./src/component/BookUtils";

// if (__DEV__) {
//     require("./src/TestList");
// }

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getCacheOk: false,
        };
        LocalDB.instance.init().then(() => {
            if (!BookUtils.instance.getAllLibs()) {
                BookUtils.instance.setLib(DefaultLibName, DefaultLibId);
            }
            this.setState({getCacheOk: true})
        });
    }

    render() {
        if (!this.state.getCacheOk) {
            return (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Spinkit
                        type={"wave"}
                        color={Theme.defaultColor}
                    />
                </View>
            )
        }
        return (
            <RouterConfig/>
        );
    }
}
