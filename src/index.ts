// Startup
const version = "v1.0.0"
console.log(`Launching script ${version} on FRIDA ${Frida.version}`)

// Check your environment is ready
if(Java.available){
    setTimeout(function (){
        // Execute FRIDA code here
        Java.perform(function (){
            // FRIDA code here
        });
    }, 0);
}

// Exit
console.log("Finished running script");