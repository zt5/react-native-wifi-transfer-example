import {Button, View, Text} from 'react-native';
import React, {Component} from 'react';
import DeviceBrightness from 'react-native-device-brightness';
import LocalDB from "../../component/LocalDB";
import BookLibMenu from "./BookLibMenu";
import utils from "../../util/utils";
import type {INavigation} from "../../interface/INavigation";
import {BookData, LibraryData} from "../../util/Types";
import FlatListMc from "../../component/FlatListMc";
import Select from "teaset/components/Select/Select";
import BookUtils, {DefaultLibId} from "../../component/BookUtils";
import {Actions} from "react-native-router-flux";

export default class BookLib extends Component implements INavigation {

    static navigationOptions = ({navigation}) => ({
        headerRight: <BookLibMenu/>,
    });


    constructor(props) {
        super(props);
        this.state = {
            selLibId: DefaultLibId,
            libArrs: [],
        };
        utils.addNvHandler(this);
    }

    didFocus = () => {
        let libs: LibraryData[] = BookUtils.instance.getAllLibs();
        let libArrs: LibraryData[] = libs.map(item => ({text: item.libName, value: item.id}));
        this.setState({
            libArrs
        })
    };

    // lookBookInfo = () => {
    //     for (let i = 0; i < LocalDB.instance.booklibs.length; i++) {
    //         for (let j = 0; j < LocalDB.instance.booklibs[i].books.length; j++) {
    //             console.warn(LocalDB.instance.booklibs[i].books[j]);
    //         }
    //     }
    // };
    // randomLight = () => {
    //     let light = Math.random();
    //     DeviceBrightness.setBrightnessLevel(Math.random(light))
    // };
    openTxtHandler = (item: BookData) => {
        Actions.push("LookBook", {book: item});
    };

    renderOneBook = (args: { item: BookData, index: number }) => {
        return (
            <Text onPress={() => this.openTxtHandler(args.item)}>{args.item.name}</Text>
        )
    };

    render() {
        let list = BookUtils.instance.getLibById(this.state.selLibId).books;
        return (
            <View style={{flex: 1}}>

                <Select
                    value={this.state.selLibId}
                    items={this.state.libArrs}
                    getItemValue={(item, index) => item.value}
                    getItemText={(item, index) => item.text}
                    placeholder={"选择书库"}
                    pickerTitle={"选择书库"}
                    onSelected={(item, index) => this.setState({selLibId: item.value})}
                />

                <FlatListMc
                    data={list}
                    renderItem={this.renderOneBook}
                />
            </View>
        );
    }

}