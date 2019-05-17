import {NativeModules,NativeEventEmitter} from "react-native";

let HttpServerModule = NativeModules["HttpServerModule"];
export const HttpServer = {
    ERROR_WIFI_NOT_OPEN: HttpServerModule.ERROR_WIFI_NOT_OPEN,
    ERROR_CONNECT_OPEN: HttpServerModule.ERROR_CONNECT_OPEN,
    ERROR_PORT_ALREADY_BIND: HttpServerModule.ERROR_PORT_ALREADY_BIND,
    FILE_UPLOAD_NEW: HttpServerModule.FILE_UPLOAD_NEW,
    Emitter: new NativeEventEmitter(HttpServerModule),
    close: () => {
        HttpServerModule.close();
    },
    start: (port: number): Promise<string> => {
        return HttpServerModule.start(port);
    },
};