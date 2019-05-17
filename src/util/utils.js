import type {INavigation} from "../interface/INavigation";
import uuidv4 from "uuid/v4";

export default class utils {
    static equal(a, b) {
        if (a === b) {
            return true;
        } else if ((a && !b) || (!a && b)) {
            return false;
        }
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);
        if (aProps.length !== bProps.length) {
            return false;
        }
        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            let propA = a[propName];
            let propB = b[propName];
            if (propA !== propB) {
                if (typeof propA === 'object') {
                    if (!utils.equal(propA, propB)) {
                        return false
                    }
                } else {
                    return false
                }
            }
        }
        return true;
    }

    static addNvHandler(target: INavigation) {
        if (!target || !target.props || !target.props.navigation) {
            console.warn("必须有navigation");
            return;
        }
        if (!target._$regNvEvents) {
            target._$regNvEvents = {};
        } else {
            console.warn("已经添加了");
            return;
        }
        let arr = ["didFocus", "willFocus", "didBlur", "willBlur"];
        for (let i = 0; i < arr.length; i++) {
            const key = arr[i];
            if (target[key]) {
                target._$regNvEvents[key] = target.props.navigation.addListener(key, target[key]);
            }
        }
    }

    static removeNvHandler(target: INavigation) {
        if (!target || !target.props || !target.props.navigation) {
            console.warn("removeNvHandler必须有navigation");
            return;
        }
        if (!target._$regNvEvents) {
            console.warn("removeNvHandler空的侦听器列表 跳过");
            return;
        }
        let arr = ["didFocus", "willFocus", "didBlur", "willBlur"];
        for (let i = 0; i < arr.length; i++) {
            const key = arr[i];
            if (target._$regNvEvents[key]) {
                target._$regNvEvents[key].remove();
            }
        }
        delete target._$regNvEvents;
    }

    static uuid(): string {
        return uuidv4();
    }
    static randomColor() {
        let str = Math.trunc(Math.random() * 0xffffff).toString(16);
        while (str.length < 6) {
            str = "0" + str;
        }
        return "#" + str;
    }

}