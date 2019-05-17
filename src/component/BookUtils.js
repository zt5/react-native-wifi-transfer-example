import {BookData, LibraryData} from "../util/Types";
import LocalDB from "../component/LocalDB";
import React from "react";
import utils from "../util/utils";

export const DefaultLibName = "默认";
export const DefaultLibId = "default_lib_id";

export default class BookUtils {
    static instance: BookUtils = new BookUtils();
    /**
     * 设置书籍
     * @param book 要添加的书籍 相同id会删除 如果相同 覆盖老的数据 否则添加到末尾
     * @param libId 要是不传 添加到默认书架
     * */
    addBook = (book: BookData | BookData[], libId: string = DefaultLibId) => {
        if (!libId) return;
        let libs = LocalDB.instance.booklibs;
        if (!libs) return;
        if (!Array.isArray(book)) book = [book];
        else book = [...book];

        let tarLib = libs.find(item => item.id === libId);
        if (!tarLib) return;
        tarLib.books = tarLib.books.map(item => {
            for (let i = book.length - 1; i >= 0; i--) {
                if (book[i].id === item.id) {
                    return book.splice(i, 1)[0];
                }
            }
            return item;
        }).concat(book);

        LocalDB.instance.booklibs = libs;
    };
    /**
     * 删除书籍
     * @param book 要添加的书籍
     * @param libId 如果不传 默认删除所有书架中相同id的书籍 否则删除对应书架id中相同id的书籍
     * */
    removeBook = (book: BookData | BookData[], libId: string = null) => {
        if (!book) return;
        let libs = LocalDB.instance.booklibs;
        if (!libs) return;
        if (!Array.isArray(book)) book = [book];
        for (let oneBook: BookData of book) {
            for (let oneLib: LibraryData of libs) {
                if (libId !== null && libId !== oneLib.id) continue;
                for (let i = oneLib.books.length - 1; i >= 0; i--) {
                    if (oneLib.books[i].id === oneBook.id) {
                        oneLib.books.splice(i, 1);
                    }
                }
            }
        }
        LocalDB.instance.booklibs = libs;
    };
    /**
     * 设置书库
     * @param libName 书库名 可以重复
     * @param libId 书库唯一id 如果不传 自动生成唯一id 如果发现已经存在相同id的书架 会更新属性
     * */
    setLib = (libName: string, libId: string = null) => {
        let libs = LocalDB.instance.booklibs;
        if (!libs) libs = [];

        if (libId === null) libId = utils.uuid();
        let tarLib = libs.find(item => item.id === libId);
        if (!tarLib) {
            tarLib = new LibraryData();
            tarLib.id = libId;
            tarLib.books = [];
            libs.push(tarLib);
        }
        tarLib.libName = libName;

        LocalDB.instance.booklibs = libs;
    };

    /**
     * 删除库
     * @param libId 书库id
     * */
    removeLib(libId: string) {
        let libs = LocalDB.instance.booklibs;
        if (!libs) return;
        for (let i = libs.length - 1; i >= 0; i--) {
            if (libs[i].id === libId) {
                libs.splice(i, 1);
            }
        }
        LocalDB.instance.booklibs = libs;
    }

    /**
     * 获取所有库
     * */
    getAllLibs(): LibraryData[] {
        return LocalDB.instance.booklibs;
    }
    /**
     * 获取库
     * */
    getLibById(libId: string): LibraryData {
        return this.getAllLibs().find(item => item.id === libId);
    }
}