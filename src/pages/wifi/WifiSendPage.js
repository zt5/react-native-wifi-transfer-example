import React, {Component} from 'react';
import {Button, Text, View} from "react-native";
import Spinkit from "react-native-spinkit";
import type {INavigation} from "../../interface/INavigation";
import utils from "../../util/utils";
import {HttpServer} from "../../bridge/Bridge";
import FlatListMc from "../../component/FlatListMc";
import {withNavigationFocus} from "react-navigation";
import UploadFileMc from "./UploadFileMc";
import {BookData, UploadFile} from "../../util/Types";
import * as RNFS from "react-native-fs";
import SaveBookAlert from "../../component/SaveBookAlert";
import Toast from "teaset/components/Toast/Toast";

class WifiSendPage extends Component implements INavigation {

    state = {
        ip: null,
        list: [],
    };

    constructor(props) {
        super(props);

        utils.addNvHandler(this);
    }

    port = 10000;
    didFocus = () => {
        this.openConnect();
    };
    openConnect = () => {
        console.warn("开启端口" + this.port);
        HttpServer.start(this.port).then((ip) => {
            console.warn("开启成功" + ip);
            this.setState({ip});
        }).catch(err => {
            if (err.code === HttpServer.ERROR_PORT_ALREADY_BIND) {
                const newPort = this.port + 1;
                console.warn("端口" + this.port + "被占用,尝试" + newPort);
                this.port = newPort;
                //端口被占用了
                setTimeout(this.openConnect, 300);
            } else {
                console.error(err);
            }
        });
    };

    willBlur = () => {
    };

    didBlur = () => {
    };

    willFocus = () => {
    };


    componentWillMount(): void {
        HttpServer.Emitter.addListener(HttpServer.FILE_UPLOAD_NEW, this.getNewUpladFile);
    }

    componentWillUnmount() {
        HttpServer.close();
        utils.removeNvHandler(this);
        HttpServer.Emitter.removeListener(HttpServer.FILE_UPLOAD_NEW, this.getNewUpladFile);
    }

    getNewUpladFile = (list: UploadFile[]) => {
        list = list.map(item => {
            let file = new UploadFile();
            file.book=new BookData(item);
            file.book.id=utils.uuid();
            file.book.orignType="wifi";
            file.$ext = {checked: true};
            return file;
        });
        list = this.state.list.concat(list);
        this.setState({
            list
        })
    };
    itemCheckChangeHandler = (index) => {
        this.setState({
            list: this.state.list
        })
    };
    addSelectBook = () => {
        const list: UploadFile[] = this.state.list;

        new SaveBookAlert().show(list, (err) => {
            if (err != null) Toast.fail(err);
            else {
                Toast.success("完成");
                list
                    .filter((item: UploadFile) => !item.$ext.checked)
                    .forEach((item: UploadFile) => RNFS.unlink(item.book.path));

                this.setState({
                    list: []
                })
            }
        }, true);
    };


    renderItem = (args: { item: UploadFile, index: number }) => {
        return (
            <UploadFileMc info={args.item} checkChange={this.itemCheckChangeHandler} index={args.index}/>
        )
    };

    render() {
        const {ip, list} = this.state;
        if (!ip) {
            return (
                <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
                    <Text>连接中...</Text>
                    <Spinkit
                        size={30}
                        type={"9CubeGrid"}
                    />
                </View>
            )
        }
        return (
            <View style={{flex: 1}}>
                <Text>确保手机开启wifi 并在同一wifi下的其他设备中 登录{ip}</Text>
                <FlatListMc
                    style={{flex: 1}}
                    data={list}
                    renderItem={this.renderItem}
                />
                <Button title={"添加"} onPress={this.addSelectBook} disabled={list.length <= 0}/>
            </View>
        );
    }
}

WifiSendPage = withNavigationFocus(WifiSendPage);
export default WifiSendPage;