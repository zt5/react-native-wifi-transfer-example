import {FlatList, View, Image, Text} from 'react-native';
import React, {Component} from 'react';
import PropTypes from "prop-types";
import LoadingMore from "./LoadingMore";

export default class FlatListMc extends Component {
    static propTypes = {
        data: PropTypes.array,
        renderItem: PropTypes.func,//单个条渲染
        refreshing: PropTypes.bool,//是否刷新状态
        isLoading: PropTypes.bool,//是否加载新数据状态
        onEndReached: PropTypes.func,
        onRefresh: PropTypes.func,
        setFlatListRef: PropTypes.func,//flatlist的引用
        setViewRef: PropTypes.func,//跟容器的引用
        hasMore: PropTypes.bool,//是否有更多数据;
    };
    static defaultProps = {
        refreshing: false,
        isLoading: false,
        hasMore: false,
    };

    constructor(props) {
        super(props);
    }

    keyExtractorHandler = (item, index) => index.toString();
    onEndReached = () => {
        if (this.props.isLoading || this.props.refreshing) return;
        if (this.props.hasMore) {
            this.props.onEndReached("auto");
        }
    };
    onRefresh = () => {
        if (this.props.isLoading || this.props.refreshing) return;
        this.props.onRefresh("auto");
    };

    render() {
        const {isLoading, setFlatListRef, setViewRef, hasMore, onEndReached, onRefresh, ...others} = this.props;
        const {data} = this.props;
        const isEmpty = (data == null || data.length === 0);
        const showLoadingMore = onEndReached && !isEmpty;
        return (
            <View style={{flex: 1}} ref={setViewRef}>
                {isEmpty &&
                <View style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Image source={require("../assets/image/empty.png")} style={{width: 30, height: 30}}/>
                    <Text style={{alignSelf: "center", color: "#545864", fontSize: 14, marginTop: 4}}>无记录</Text>
                </View>}
                <FlatList
                    ref={setFlatListRef}
                    initialNumToRender={30}
                    keyExtractor={this.keyExtractorHandler}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    initialListSize={15}
                    pageSize={15}
                    onEndReached={onEndReached ? this.onEndReached : null}
                    onRefresh={onRefresh ? this.onRefresh : null}
                    keyboardDismissMode={'on-drag'}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={showLoadingMore ? <LoadingMore hasMore={hasMore}/> : null}
                    {...others}
                />
            </View>
        );
    }
}