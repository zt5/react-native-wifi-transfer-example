import AsyncStorage from "@react-native-community/async-storage";
import utils from "./utils";

let dataKey = "data";
export default class LocalData {

    /**
     * 保存
     * @param key 唯一标识
     * @param data 数据 注意 值里面的undefined NaN 会转换成null
     * @param mode 模式 cover 覆盖保存 merge 合并保存
     * */
    static setData(key: string | string[], data: any | any[], mode?: "cover" | "merge" = "cover"): Promise {
        if (Array.isArray(key)) {
            return this._setDatas(key, data, mode);
        } else {
            return this._setData(key, data, mode);
        }
    }

    /**
     * 获取数据
     * @param key 唯一标识 可以是数组 返回的结果也是数组
     * @param defaultObj 如果取不到 返回的默认数据 如何key是数组 他也需要是数组
     * */
    static getData(key: string | string[], defaultObj?: any | any[] = null): Promise {
        if (Array.isArray(key)) {
            return LocalData._getDatas(key, defaultObj);
        } else {
            return LocalData._getData(key, defaultObj);
        }
    }

    /**
     * 删除
     * @param key 唯一标识
     * */
    static removeData(key: string | string[]): Promise {
        if (Array.isArray(key)) {
            return AsyncStorage.multiRemove(key);
        } else {
            return AsyncStorage.removeItem(key);
        }
    }

    /**
     * 清理所有数据
     * */
    static clearData(): Promise {
        return AsyncStorage.clear();
    }

    /**
     * 获取所有的key
     * */
    static getAllKeys(): Promise<string[]> {
        return AsyncStorage.getAllKeys();
    }

    /**
     * 设置多个数据
     * @private
     * */
    static _setDatas(keys: string[], datas: any[], mode) {
        if (this._testIsEmpty(datas)) datas = [];
        let arrs: [][] = keys.map((item, index) => [item, this._valToJsonStr(datas[index])]);
        switch (mode) {
            case "cover":
                return AsyncStorage.multiSet(arrs);
            case "merge":
                return AsyncStorage.multiMerge(arrs)
        }
        return Promise.reject("mode invalid");
    }

    /**
     * 设置单个数据
     * @private
     * */
    static _setData(key: string, data: any, mode) {
        let dataToSave = this._valToJsonStr(data);
        switch (mode) {
            case "cover":
                return AsyncStorage.setItem(key, dataToSave);
            case "merge":
                return AsyncStorage.mergeItem(key, dataToSave)
        }
        return Promise.reject(`mode 错误(${mode})`);
    }


    /**
     * 获取多个数据
     * @private
     * */
    static _getDatas(keys, defaultObjs) {
        return AsyncStorage.multiGet(keys).then((results) => {
            if (results) {
                return results.map((item, index) => {

                    let oneObj = this._jsonStrToVal(item[1]);

                    if (oneObj === null) return defaultObjs[index];
                    else return oneObj;
                });
            } else {
                return defaultObjs;
            }
        }).catch(err => {
            console.error(err);
            return defaultObjs;
        });
    }

    /**
     * 获取单个数据
     * @private
     * */
    static _getData(key, defaultObj) {
        return AsyncStorage.getItem(key).then(result => {
            let oneObj = this._jsonStrToVal(result);
            if (oneObj === null) return defaultObj;
            else return oneObj;
        }).catch(err => {
            console.error(err);
            return defaultObj;
        });
    }

    /**
     * key和value转成json字符串
     * @private
     * */
    static _valToJsonStr(value) {
        return JSON.stringify({[dataKey]: value}, (onekey, onevalue) => {
            if (onevalue === undefined) return null;//替换成null不然json会忽略这个属性
            else return onevalue;
        });
    }

    /**
     * json字符串转成object
     * @private
     * */
    static _jsonStrToVal(result: string) {
        if (this._testIsEmpty(result)) return null;

        let oneObj = null;
        try {
            let obj = JSON.parse(result);
            if (obj && obj.hasOwnProperty(dataKey)) obj = obj[dataKey];
            oneObj = obj;
        } catch (e) {
            console.error(e);
        }

        if (this._testIsEmpty(oneObj)) return null;

        return oneObj;
    }

    /**
     * 判断是否为空(不包括"" false)
     * @private
     * */
    static _testIsEmpty(testobj) {
        return testobj === null || testobj === undefined || Number.isNaN(testobj);
    }
}
//-------------
//测试
//-------------

const timeStamp = new Date().getTime();
const testHeader = "$test_";


function expect(val1) {
    return {
        toBe: (val2) => {
            if (!utils.equal(val1, val2)) {
                throw new Error(val1 + "不等于" + val2);
            }
        },
        toBeNull: () => {
            if (val1) {
                throw new Error(val1 + "应该为空");
            }
        }
    }
}

export class TestLocalData {
    test = () => {
        let fun = async () => {
            await this.testStr();
            await this.testArray();
            await this.testEmpty();
            await this.testMult();
            await this.testNum();
            await this.testObject();
        };
        fun().then(() => {
            console.warn("success");
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            LocalData.getAllKeys().then(result => {
                for (let i = result.length - 1; i >= 0; i--) {
                    if (!(result[i] + "").startsWith(testHeader)) {
                        result.splice(i, 1);
                    }
                }
                LocalData.removeData(result);
            });
        })
    };

    testStr = async () => {
        let testStr;
        let defStr = "string";

        //测试使用默认值
        testStr = null;
        await LocalData.setData(testHeader + timeStamp, testStr);
        let result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(defStr);

        //测试正常使用
        testStr = "挂的是公仆";
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(testStr);

        //测试有默认值是否正常
        testStr = "gadetqwet";
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(testStr);

        //测试空字符串
        testStr = "";
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(testStr);

        //测试false字符串
        testStr = "false";
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(testStr);

        //测试数字字符串
        testStr = "0";
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(testStr);

    };

    testNum = async () => {
        let testStr;
        let defStr = 512512;

        //测试正常使用
        testStr = 552523;
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(testStr);

        //测试有默认值是否正常
        testStr = 1421412;
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(testStr);

        //测试使用默认值
        testStr = null;
        await LocalData.setData(testHeader + timeStamp, testStr);
        let result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(defStr);

        //测试数字0
        testStr = 0;
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp, defStr);
        expect(result).toBe(testStr);
    };

    testEmpty = async () => {
        let testStr;

        //测试null
        testStr = null;
        await LocalData.setData(testHeader + timeStamp, testStr);
        let result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBeNull();

        //测试undefined
        testStr = undefined;
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBeNull();

        //测试NaN
        testStr = NaN;
        await LocalData.setData(testHeader + timeStamp, testStr);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBeNull();
    };
    testObject = async () => {
        let testObj;

        let defObj = {ceshi: "ceshivalue"};

        //测试正常使用
        testObj = {name: "woshi"};
        await LocalData.setData(testHeader + timeStamp, testObj);
        let result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(testObj);

        //测试默认值
        testObj = null;
        await LocalData.setData(testHeader + timeStamp, testObj);
        result = await LocalData.getData(testHeader + timeStamp, defObj);
        expect(result).toBe(defObj);

        //测试值为null
        testObj = {name: null};
        await LocalData.setData(testHeader + timeStamp, testObj);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(testObj);

        //测试值为undefined
        testObj = {name: undefined};
        await LocalData.setData(testHeader + timeStamp, testObj);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe({name: null});

        //测试值为undefined
        testObj = {name: NaN};
        await LocalData.setData(testHeader + timeStamp, testObj);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe({name: null});

        //测试空对象
        testObj = {};
        await LocalData.setData(testHeader + timeStamp, testObj);
        result = await LocalData.getData(testHeader + timeStamp, defObj);
        expect(result).toBe({});
    };
    testArray = async () => {
        let testArray: number[];
        const defArray = [6, 345, 3463];
        //测试正常使用
        testArray = [1, 2, 3];
        await LocalData.setData(testHeader + timeStamp, testArray);
        let result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(testArray);

        //测试默认值
        testArray = null;
        await LocalData.setData(testHeader + timeStamp, testArray);
        result = await LocalData.getData(testHeader + timeStamp, defArray);
        expect(result).toBe(defArray);

        //测试空数组
        testArray = [];
        await LocalData.setData(testHeader + timeStamp, testArray);
        result = await LocalData.getData(testHeader + timeStamp, defArray);
        expect(result).toBe(result);

        //测试有元素为null
        const finalArr = [1, null, 2];
        testArray = [1, null, 2];
        await LocalData.setData(testHeader + timeStamp, testArray);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(finalArr);

        //测试有元素为undefined
        testArray = [1, undefined, 2];
        await LocalData.setData(testHeader + timeStamp, testArray);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(finalArr);

        //测试有元素为NaN
        testArray = [1, NaN, 2];
        await LocalData.setData(testHeader + timeStamp, testArray);
        result = await LocalData.getData(testHeader + timeStamp);
        expect(result).toBe(finalArr);
    };

    testMult = async () => {
        let keys: string[];
        let values: string[];
        let defvalues: string[] = ["defaval", "defbval", "defcval"];

        //正常测试
        keys = ["a", "b", "c"];
        values = ["aval", "bval", "cval"];
        await LocalData.setData(keys, values);
        let result = await LocalData.getData(keys);
        expect(result).toBe(values);

        //测试默认值
        keys = ["a", "b", "c"];
        values = null;
        await LocalData.setData(keys, values);
        result = await LocalData.getData(keys, defvalues);
        expect(result).toBe(defvalues);

        //测试默认值
        keys = ["a", "b", "c", "d", "e"];
        values = ["avalue", null, undefined, "", NaN];
        defvalues = ["defaval", "defbval", "defcval", "defdval", "defeval"];
        await LocalData.setData(keys, values);
        result = await LocalData.getData(keys, defvalues);
        expect(result).toBe(["avalue", "defbval", "defcval", "", "defeval"]);


        //测试数组空值
        keys = ["a", "b", "c", "d"];
        values = [{aobjkey: "aobjvalue"}, {bobjkey: null}, {cobjkey: undefined}, {dobjkey: NaN}];
        await LocalData.setData(keys, values);
        result = await LocalData.getData(keys);
        expect(result).toBe([{aobjkey: "aobjvalue"}, {bobjkey: null}, {cobjkey: null}, {dobjkey: null}]);
    };
}