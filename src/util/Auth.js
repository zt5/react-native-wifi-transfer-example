import {Alert, Platform} from "react-native";
import Permissions from "react-native-permissions";

type AuthType =
    /**PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION*/
    "location" |
    /**PermissionsAndroid.PERMISSIONS.CAMERA*/
    "camera" |
    /**PermissionsAndroid.PERMISSIONS.RECORD_AUDIO*/
    "microphone" |
    /**PermissionsAndroid.PERMISSIONS.READ_CONTACTS*/
    "contacts" |
    /**PermissionsAndroid.PERMISSIONS.READ_CALENDAR*/
    "event" |
    /**PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE*/
    "storage" |
    /**PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE*/
    "photo" |
    /**PermissionsAndroid.PERMISSIONS.CALL_PHONE*/
    "callPhone" |
    /**PermissionsAndroid.PERMISSIONS.READ_SMS*/
    "readSms" |
    /**PermissionsAndroid.PERMISSIONS.RECEIVE_SMS*/
    "receiveSms";
type AuthStatus =
    /**已授权*/
    'authorized' |
    /**拒绝*/
    'denied' |
    /**ios 家长监管 或者不支持的设备 android 不在提示 彻底拒绝*/
    'restricted' |
    /**需要申请*/
    'undetermined'

export default class Auth {
    static auth(name: AuthType): Promise {
        return Permissions.check(name)
            .then((result: AuthStatus) => Auth.authSelect(result, name));
    }

    /**@private*/
    static authSelect(result: AuthStatus, name: AuthType): Promise {
        switch (result) {
            case "authorized":
                //已授权 无视
                return Promise.resolve();
            case "denied":
                return Auth.rejectAuth();
            case "undetermined":
                return Auth.askAuth(name);
            case "restricted":
                switch (Platform.OS) {
                    case "android":
                        //点击了不在提示 彻底拒绝
                        return Auth.rejectAuth();
                    case "ios":
                        //家长监管 或者不支持的设备
                        return Auth.badAuth();
                }
                return Auth.rejectAuth();

        }
    }

    /**
     * @private
     * 不支持的设备 或者 已经被家长监管
     * */
    static badAuth() {
        return new Promise((resolve, reject) => {
            //家长监管 或者不支持的设备
            Alert.alert(
                '错误',
                '不支持的设备 或者 已经被家长监管',
                [{
                    text: '确定',
                    onPress: () => reject("不支持 或 已被监管"),
                    style: 'cancel',
                }]
            );
            return Promise.reject("已被家长监管");
        });
    }

    /**
     * @private
     * 申请授权
     * */
    static askAuth(name: AuthType) {
        return new Promise((resolve, reject) => {
            Alert.alert(
                '权限申请',
                '扫描需要文件权限>_<',
                [
                    {
                        text: '取消',
                        onPress: () => reject("已取消"),
                        style: 'cancel',
                    },
                    {
                        text: '确定', onPress: () => {
                            Permissions.request(name).then((result: AuthStatus) => {
                                if (result === "authorized") {
                                    resolve();
                                } else {
                                    reject("申请失败");
                                }
                            }).catch((err) => reject(err));
                        }
                    }
                ],
            );
        });
    }

    /**
     * @private
     * 授权被拒绝
     * */
    static rejectAuth(): Promise {
        return new Promise((resolve, reject) => {
            Alert.alert(
                '权限设置',
                '请点击 打开设置 打开 文件读取权限',
                [
                    {
                        text: '取消',
                        onPress: () => reject("已取消!"),
                        style: 'cancel',
                    },
                    {
                        text: '打开设置', onPress: () => {
                            Permissions.openSettings().catch((err) => reject(err));
                        }
                    },
                ],
            );
        });
    }
}