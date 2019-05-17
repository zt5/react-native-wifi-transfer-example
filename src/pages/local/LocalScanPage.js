import React, {Component} from 'react';
import {Button, Text, View} from "react-native";
import Spinkit from "react-native-spinkit";
import type {INavigation} from "../../interface/INavigation";
import utils from "../../util/utils";
import FlatListMc from "../../component/FlatListMc";
import {withNavigationFocus} from "react-navigation";
import * as RNFS from "react-native-fs";
import {ReadDirItem} from "react-native-fs";
import {BookData, UploadFile} from "../../util/Types";
import Auth from "../../util/Auth";
import SaveBookAlert from "../../component/SaveBookAlert";
import UploadFileMc from "../wifi/UploadFileMc";
import Toast from "teaset/components/Toast/Toast";

class LocalScanPage extends Component implements INavigation {

    state = {
        list: [],
        currentFile: "",
        scaning: false,
    };

    constructor(props) {
        super(props);

        utils.addNvHandler(this);
    }

    didFocus = () => {
        this.startScanHandler();
    };

    willBlur = () => {
        this.stopScanHandler();
    };

    componentWillMount(): void {
    }

    componentWillUnmount() {
        utils.removeNvHandler(this);
    }

    stopScanHandler = () => {
        if (this.state.scaning) {
            Toast.stop("取消扫描");
            this.setState({
                scaning: false
            });
        }
    };

    startScanHandler = () => {
        Auth.auth("storage").then(this.doStartScanHandler).catch((err) => Toast.fail(err));
    };
    doStartScanHandler = () => {
        this.setState({
            list: [],
            scaning: true,
        });

        this.loopFoldier(RNFS.ExternalStorageDirectoryPath).then(() => {
            Toast.success("共扫描到" + this.state.list.length + "个文件");
        }).catch(err => {
            Toast.fail("扫描出错" + err);
        }).finally(() => {
            this.setState({
                scaning: false
            })
        });
    };
    loopFoldier = async (path) => {
        await RNFS.readDir(path).then(async (vals: ReadDirItem[]) => {
            for (let val of vals) {
                if (!this.state.scaning) return;
                if (val.isDirectory()) {
                    await this.loopFoldier(val.path);
                } else if (val.path.endsWith(".txt") && val.path.indexOf("log") === -1) {
                    const list = this.state.list.concat();

                    let item: UploadFile = new UploadFile();
                    item.book = new BookData();
                    item.book.id = utils.uuid();
                    item.book.name = val.name;
                    item.book.path = val.path;
                    item.book.orignType = "local_scan";
                    item.$ext = {checked: true};

                    list.push(item);
                    this.setState({
                        list,
                        currentFile: val.path
                    })
                }
            }
        });
    };


    itemCheckChangeHandler = () => {
        this.setState({
            list: this.state.list.concat()
        })
    };

    addSelectBook = () => {
        new SaveBookAlert().show(this.state.list, (err) => {
            if (err != null) Toast.fail(err);
            else {
                Toast.success("完成");
                this.setState({
                    list: []
                })
            }
        });
    };

    renderScaning = () => {
        const {currentFile} = this.state;
        return (
            <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
                <Text>扫描中...</Text>
                <Text>{currentFile}</Text>
                <Spinkit
                    size={30}
                    type={"9CubeGrid"}
                />
            </View>
        )
    };

    renderItem = (args: { item: UploadFile, index: number }) => {
        return (
            <UploadFileMc info={args.item} checkChange={this.itemCheckChangeHandler} index={args.index}/>
        )
    };
    renderLocalList = () => {
        return (
            <View style={{flex: 1}}>
                <FlatListMc
                    data={this.state.list}
                    renderItem={this.renderItem}
                />
            </View>
        )
    };
    renderBtn = () => {
        const {scaning} = this.state;
        if (scaning) {
            return <Button title={"取消"} onPress={this.stopScanHandler}/>
        } else {
            return <Button title={"扫描"} onPress={this.startScanHandler}/>
        }
    };

    render() {
        const {scaning, list} = this.state;
        const {renderBtn, renderScaning, renderLocalList} = this;
        return (
            <View style={{flex: 1}}>
                {renderBtn()}
                {scaning ? renderScaning() : renderLocalList()}
                {list.length > 0 ? <Button title={"添加"} onPress={this.addSelectBook}/> : null}
            </View>
        );
    }
}

LocalScanPage = withNavigationFocus(LocalScanPage);
export default LocalScanPage;