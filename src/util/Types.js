import React from "react";

export class BookData {
    name: string;
    path: string;
    id: number;
    orignType: "wifi" | "local_scan" | "local_import";

    constructor(props) {
        if (props) {
            for (let key in props) {
                if (props.hasOwnProperty(key)) {
                    this[key] = props[key];
                }
            }
        }
    }
}

export class UploadFile {
    book: BookData;
    $ext: { checked: boolean };

    constructor(props) {
        if (props) {
            for (let key in props) {
                if (props.hasOwnProperty(key)) {
                    if (key === "book") {
                        this[key] = new BookData(props[key]);
                    } else {
                        this[key] = props[key];
                    }
                }
            }
        }
    }
}

export class LibraryData {
    libName: string;
    id: number;
    books: BookData[];

    constructor(props) {
        if (props) {
            for (let key in props) {
                if (props.hasOwnProperty(key)) {
                    if (key === "books") {
                        this[key] = props[key].map((item) => new BookData(item));
                    } else {
                        this[key] = props[key];
                    }

                }
            }
        }
    }
}