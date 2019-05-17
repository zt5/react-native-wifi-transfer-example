import React from 'react';
import {Alert} from "react-native";
import {BookData, UploadFile} from "../util/Types";
import BookUtils, {DefaultLibId, DefaultLibName} from "./BookUtils";

export default class SaveBookAlert {
    list: UploadFile[];
    completeFun: Function;
    show = (list: UploadFile[], completeFun: Function) => {
        this.list = list;
        this.completeFun = completeFun;

        let finalList: BookData[] = [];
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].$ext.checked) {
                finalList.push(this.list[i].book);
            }
        }
        Alert.alert("提示", `是否确定添加${finalList.length}个文件`, [
            {
                text: "确定", onPress: () => this.moveListToLibrary(finalList)
            },
            {
                text: "取消", style: "cancel", onPress: () => this.completeFun("取消添加")
            }
        ]);
    };

    /**@private*/
    moveListToLibrary = (finalList: BookData[]) => {
        BookUtils.instance.setLib(DefaultLibName,DefaultLibId);
        BookUtils.instance.addBook(finalList,DefaultLibId);
        this.completeFun();
    };
}
