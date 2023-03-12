// Startup
const version = "v1.0.0"
console.log(`Launching script ${version} on FRIDA ${Frida.version}`)

// Check your environment is ready
if(Java.available){
    // Java.deoptimizeEverything(); // if your hook doesn't work, try this function before your hook
    setTimeout(function (){
        // Execute FRIDA code here
        Java.perform(function (){
            console.log(`Running on Android ${Java.androidVersion}`); // returns version string not SDK int
            // FRIDA code here
            let Activity = Java.use('android.app.Activity');
            Activity.onCreate.overload('android.os.Bundle').implementation = function (bundle: any) { // hook onCreate to prevent race condition
                this.onCreate(bundle);
                let ActivityThread = Java.use('android.app.ActivityThread');
                let currentApplication = ActivityThread.currentApplication();
                let context = currentApplication.getApplicationContext();
                let pkgManager = context.getPackageManager();
                let pkgInfo = pkgManager.getPackageInfo(context.getPackageName(), 0);
                let appVersionName = pkgInfo.getClass().getField('versionName').get(pkgInfo);
                let appName = pkgInfo.getClass().getField('packageName').get(pkgInfo);
                console.log(`Running on app ${appName} with version ${appVersionName} and build number ${pkgInfo.getLongVersionCode()}`);
            };
        });
    }, 0);
}

// Exit
console.log("Finished running script");