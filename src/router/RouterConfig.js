import React, {Component} from 'react';
import {Router, Scene, Stack} from "react-native-router-flux";
import {Platform} from "react-native";
import BookLib from "../pages/libs/BookLib";
import WifiSendPage from "../pages/wifi/WifiSendPage";
import LocalScanPage from "../pages/local/LocalScanPage";
import LookBook from "../pages/reader/LookBook";

export default class RouterConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    stateHandler = (prevState, newState, action) => {
    };

    // on Android, the URI prefix typically contains a host in addition to scheme
    prefix = Platform.OS === 'android' ? 'mychat://mychat/' : 'mychat://';

    render() {
        return (
            <Router onStateChange={this.stateHandler} uriPrefix={this.prefix}>
                {/*<Drawer*/}
                {/*    contentComponent={Docker}*/}
                {/*>*/}
                <Stack key="home">
                    <Scene key="BookLib" component={BookLib} title="主页"/>
                    <Scene key="WifiSendPage" component={WifiSendPage} title="WIFI传书"/>
                    <Scene key="LocalScanPage" component={LocalScanPage} title="本地导入"/>
                    <Scene key="LookBook" component={LookBook}/>
                </Stack>
                {/*</Drawer>*/}
            </Router>
        );
    }
}