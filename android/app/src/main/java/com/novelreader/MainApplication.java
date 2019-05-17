package com.novelreader;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import org.capslock.RNDeviceBrightness.RNDeviceBrightness;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.novelreader.httpserver.HttpServerPackage;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new HttpServerPackage(),
                    new MainReactPackage(),
            new ReactNativeDocumentPicker(),
            new RNDeviceBrightness(),
                    new RNGestureHandlerPackage(),
                    new RNSpinkitPackage(),
                    new RNFSPackage(),
                    new AsyncStoragePackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
