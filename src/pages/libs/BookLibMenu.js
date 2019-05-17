import React, {Component} from 'react';
import {Button, Text, TouchableOpacity, View, Platform} from "react-native";
import {Actions} from "react-native-router-flux";
import Overlay from "teaset/components/Overlay/Overlay";
import Auth from "../../util/Auth";
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import Toast from "teaset/components/Toast/Toast";
import {BookData, UploadFile} from "../../util/Types";
import utils from "../../util/utils";
import SaveBookAlert from "../../component/SaveBookAlert";

export default class BookLibMenu extends Component {
    winKey;
    state = {
        btnH: 0,
        btnY: 0,
    };

    constructor(props) {
        super(props);
    }

    openMenuHandler = ({nativeEvent: {pageY, locationY}}) => {
        this.setState({
            btnY: pageY - locationY
        }, () => {
            const {renderMenu} = this;
            let overlayView = (
                <Overlay.View modal={false} overlayOpacity={0}>
                    {renderMenu()}
                </Overlay.View>
            );
            this.winKey = Overlay.show(overlayView);
        });
    };
    importFormLocal = () => {
        Auth.auth("storage").then(() => {
            DocumentPicker.show({
                filetype: [DocumentPickerUtil.images()],
            }, (error, res) => {
                if (error) {
                    Toast.fail(error);
                } else if (res == null) {
                    console.warn("取消选择");
                } else {
                    console.warn(res);

                    let file = new UploadFile();
                    file.book = new BookData();
                    file.book.orignType = "local_import";
                    file.book.id = utils.uuid();
                    file.book.name = res.fileName;
                    file.book.path = res.uri;
                    file.$ext = {checked: true};

                    new SaveBookAlert().show([file], (err) => {
                        if (err != null) Toast.fail(err);
                        else {
                            Toast.success("完成");
                        }
                    });

                }
            });
        });
    };
    renderMenu = () => {
        let menus = [
            {
                label: "WIFI传输", func: () => {
                    Actions.push("WifiSendPage");
                }
            }
        ];
        if (Platform.OS === "android") {
            menus = menus.concat([
                {
                    label: "本地扫描", func: () => {
                        Actions.push("LocalScanPage");
                    }
                },
                {label: "导入本地", func: this.importFormLocal}
            ]);
        }
        return (
            <View style={[{
                flexDirection: "column",
                position: "absolute",
                alignItems: "center",
                top: this.state.btnH + this.state.btnY,
                right: 0,
            }]}>
                {menus.map((item, index) => <Button onPress={() => {
                    item.func();
                    setTimeout(() => {
                        Overlay.hide(this.winKey);
                    }, 100);
                }} title={item.label} key={index}/>)}
            </View>
        );
    };
    btnLayOutHandler = ({nativeEvent: {layout: {height}}}) => {
        this.setState({btnH: height});
    };

    render() {
        return (
            <TouchableOpacity
                onPress={this.openMenuHandler}
                style={{marginRight: 10}}
                onLayout={this.btnLayOutHandler}
            >
                <Text style={{fontSize: 25}}>＋</Text>
            </TouchableOpacity>
        );
    }
}
