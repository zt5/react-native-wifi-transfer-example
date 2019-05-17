import LocalData from "../util/LocalData";
import {LibraryData} from "../util/Types";
import Toast from "teaset/components/Toast/Toast";

const BOOK_LIBS_KEY = "booklibs";
const APP_CACHE_HEADER = "app_cache_data_";
let cacheDatas = {};

function setData(key, val) {
    key = APP_CACHE_HEADER + key;
    cacheDatas[key] = val;
    LocalData.setData(key, val).then(() => {
        console.warn("保存成功", key, val)
    }).catch(error => Toast.fail(error));
}

function clearByKey(key) {
    key = APP_CACHE_HEADER + key;
    cacheDatas[key] = null;
    LocalData.removeData(key).then(() => {
        console.warn("删除成功", key)
    }).catch(error => Toast.fail(error));
}

function getData(key) {
    key = APP_CACHE_HEADER + key;
    return cacheDatas[key];
}

export default class LocalDB {
    static instance: LocalDB = new LocalDB();

    /**获取所有缓存数据*/
    init() {
        return LocalData.getAllKeys().then((keys: string[]) => {
            return LocalData.getData(keys).then((result: []) => {
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        cacheDatas[keys[i]] = result[i];
                    }
                }
            });
        });
    };

    /**清理所有缓存*/
    clear() {
        for (let key in cacheDatas) {
            if (cacheDatas.hasOwnProperty(key)) {
                clearByKey(key);
            }
        }
    };

    /**书库*/
    get booklibs(): LibraryData[] {
        return getData(BOOK_LIBS_KEY);
    }

    /**书库*/
    set booklibs(value: LibraryData[]) {
        setData(BOOK_LIBS_KEY, value);
    }
}