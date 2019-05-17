import React, {Component} from 'react';
import {View, Text, CheckBox} from "react-native";
import PropTypes from "prop-types";
import {UploadFile} from "../../util/Types";

export default class UploadFileMc extends Component {
    static propTypes = {
        info: PropTypes.instanceOf(UploadFile),
        checkChange: PropTypes.func,
        index: PropTypes.number,
    };
    checkChangeHandler = val => {
        const {checkChange} = this.props;
        const info: UploadFile = this.props.info;
        info.$ext.checked = val;
        if (checkChange) checkChange(this.props.index);
    };

    render() {
        const info: UploadFile = this.props.info;
        return (
            <View style={{borderColor: "black", borderRadius: 10}}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <CheckBox value={info.$ext.checked} onValueChange={this.checkChangeHandler}/>
                    <View>
                        <Text>{info.book.name}</Text>
                        <Text>{info.book.path}</Text>
                    </View>
                </View>
            </View>
        );
    }
}