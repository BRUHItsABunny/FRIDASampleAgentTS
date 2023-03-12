# FRIDA Sample Agent TypeScript
An example with step-by-step instructions on how to write a FRIDA agent in TypeScript

## Motivation
I make some FRIDA scripts from time to time, but it can be quite a hassle to set this up for the first time in TypeScript.

You can find the documentation around the FRIDA JS/TS API over [here](https://frida.re/docs/javascript-api/).

This tutorial assumes you are using Intellij IDEA (tested on 2022.1.2).

## Before getting started
Before you get started in this tutorial you want to install [NodeJS](https://nodejs.dev/en/learn/how-to-install-nodejs/) and [Intellij IDEA](https://www.jetbrains.com/idea/).

For the Android specific part about this tutorial (FRIDA can target more platforms than just Android), you will need to have adb installed and added to your environment PATH.

## Project set-up

If you look at the commit history you can see the changes that occurred upon each step to follow along.

### 1. Create the project in Intellij IDEA
This step is pretty easy.
Fire up Intellij IDEA, click on 'Create Project' and start populating the fields.

The screenshot below will show you what the settings are that I went with to get the project as it shows in the initial commit.

* Language: JavaScript

![Intellij Settings](https://raw.githubusercontent.com/BRUHItsABunny/FRIDASampleAgentTS/master/_resources/media/1_create_project.png)

### 2. Initialize a NodeJS project
Run the following command in your terminal:
```sh
npm init
```

It will ask you for more information in the terminal, fill it in as needed:

![npm init](https://raw.githubusercontent.com/BRUHItsABunny/FRIDASampleAgentTS/master/_resources/media/2_npm_init.png)

### 3. Install TypeScript
Run the following command in your terminal:
```sh
npm install typescript --save-dev
```

### 4. Initialize a TypeScript project
Run the following command in your terminal:
```sh
tsc --init
```

### 5. Install dependencies
Run the following command in your terminal:
```sh
npm install @types/node frida-compile @types/frida-gum --save-dev
```

### 6. Configure TypeScript
You basically want your [tsconfig.json]() to look like mine.
Alternatively there is a more compact way of achieving the same thing, just copy-paste the following:
```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020"],
    "allowJs": true,
    "noEmit": true,
    "strict": true,
    "esModuleInterop": true
  }
}
```

### 7. Setup project structure and compilation settings
You want to create a directory called `src` and inside you want to create a file called `index.ts`.

This is the entrypoint of your FRIDA agent.

After creating the file you want to make sure that you point NodeJS to it, otherwise nothing will get compiled.

In `package.json` change `"main": "index.js",` to `"main": "src/index.ts",`.

Next you want to add the following actions.

In `package.json` change:
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

to 

```json
"scripts": {
    "prepare": "npm run build",
    "build": "frida-compile src/index.ts -o index.js -c",
    "watch": "frida-compile src/index.ts -o index.js -w"
  },
```

You want to finish it off by creating a `.gitignore` in the root directory of your project with at least the following content:
```
/index.js
/node_modules
```
This will prevent the vendor directory (the directory with all the dependencies) and the compiled code from being uploaded to GitHub.

### 8. Add some code
Next you add some code into the `index.ts`, I suggest starting off with something similar to this:

```typescript
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
```

The key takeaways from the snippet above should be:
* We check if a java environment is available in our target using `Java.available` (because I am targeting Android in this example)
* We use `setTimeout` to embed our code.
* We use `Java.perform` to actually execute our code. (because I am targeting Android in this example)

### 9. Making sure all dependencies are installed
If you were to run the code inside this repository you would have to clone the repository and start from this step.

Run the following command in your terminal:
```sh
npm install
```

### 10. Make sure ADB is connected to your Android environment (since I target Android in this example)
Run the following command in your terminal:
```sh
adb devices
```

If it says `unauthorized` you will need to authorize the ADB connection on the phone/emulator.

It should look like this:

![ADB devices](https://raw.githubusercontent.com/BRUHItsABunny/FRIDASampleAgentTS/master/_resources/media/10_adb_devices.png)

### 11. Compile the code
Run the following command in your terminal:
```sh
npm run prepare
```

This should create a file called `index.js` in the root directory of your project.

### 12. Run the agent
Run the following command in your terminal:
```sh
frida -l index.js -U --pause -f com.android.chrome
```

Once it loads it will tell you to resume the application

Run the following command in your terminal:
```sh
%resume
```

Finally, you should be left with a terminal that looks like this:

![frida run](https://raw.githubusercontent.com/BRUHItsABunny/FRIDASampleAgentTS/master/_resources/media/12_frida_run.png)
