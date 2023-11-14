# VisualChat
Channel members can edit the shared view. Workspace has draggable working area. You can create moveable sticky notes, add HTML code to the selected location, or upload images to the background in the selected location. ___The workspace opens when a channel is selected___. Functionality can be found in context menus. Smooth animated user experience. Two themes: dark and light.    
## try app:
https://visualchat.onrender.com   
Test users are:    
___`username:testuser password:testuser`___ and ___`username:testuser2 password:testuser2`___   
Or You can create your own. Using Google login app creates username from gmail address. ___A new channel must be created for a new user in order to try out app features___. ___Firefox is slow___ with react-spring animations...   
![Image of note view](https://github.com/juhaj77/VisualChat/blob/master/images/UI.png)
## prerequisites

* MongoDB [installation](https://docs.mongodb.com/manual/installation/)
* npm [get npm](https://www.npmjs.com/get-npm)

## installation

1. run `npm install` in folder `chat-client`
1. run `npm install` in folder `chat-server`
1. Create web app and get client id from https://console.cloud.google.com app credentials tabb for Google login.
    
   ![Image for oauth credentials](https://github.com/juhaj77/VisualChat/blob/master/images/oauth2.png)    
   set correct URIs in cloud console credentials tab
   
   Update line 49 `CLIENT_ID=...` in chat-client/src/components/Login.js

1. Fix line 24 `let socket = io('wss://visualchat.onrender.com')` to `let socket = io('ws://localhost:3003')`  in chat-client/src/index.js.
1. Comment line 11 `app.use(express.static('build'))` in chat-server/app.js. (this is for Render cloud. It builds directly from github).
1. create _.env_ file with content:
   ```
    MONGODB_URI=mongodb://127.0.0.1:27017
    PORT=3003
    NODE_ENV=test
    SECRET=mySecretString
    CLIENT_ID=client-id.apps.googleusercontent.com
   ```
    into folder `chat-server`
   
## usage

____tested with Firefox, Chrome and Edge. React-spring is super slow in Firefox and OAuth2 didn't work in Edge in VM____

1. `npm start` in **chat-server** folder.
1. `export NODE_OPTIONS=--openssl-legacy-provider` in **chat-client** shell.
1. `npm start` in **chat-client** folder.



