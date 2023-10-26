# VisualChat
Each chat channel has its own note view. It is common to channel users. Channel members can arrange, create, edit, delete or change color of the notes. The note view is updated in real time. Png-images can be uploaded. Workspace has draggable working area. The workspace opens when a channel is selected. Connected users and active channels are shown for application users. Google login.  
### try app
https://visualchat.onrender.com/ Test users: `username:testuser password:testuser` and `username:testuser2 password:testuser2`. Or You can create your own. Using Google login app creates user username from username@gmail.com. Firefox is slow with react-spring animations...   
![Image of note view](https://github.com/juhaj77/VisualChat/blob/master/images/UI_n.png)
## prerequisites

* MongoDB [installation](https://docs.mongodb.com/manual/installation/)
* npm [get npm](https://www.npmjs.com/get-npm)

## installation

1. run `npm install` in folder `chat-client`
1. run `npm install` in folder `chat-server`
1. create _.env_ file with content:
   ```
    MONGODB_URI=mongodb://127.0.0.1:27017
    PORT=3003
    NODE_ENV=test
    SECRET='mySecretStrimg'
   ```
    into folder `chat-server`
1. Create web app and get client id from https://console.cloud.google.com app credentials tabb for Google login.
2. 
   ![Image for oauth credentials](https://github.com/juhaj77/VisualChat/blob/master/images/oauth2.png)    
   cloud console credentials tab
   
   Update line 52 `CLIENT_ID=...` in chat-client/src/components/Login.js
1. Comment line 17 `app.use(express.static('build'))` in chat-server/app.js. (this is for Render cloud. It builds directly from github).
1. Fix line 26 `let socket = io('wss://visualchat.onrender.com')` to `let socket = io('ws://localhost:3003')`  in chat-client/src/index.js.   
   
## usage

____tested with Firefox, Chrome and Edge. React-spring is super slow in Firefox____

1. `npm start` in **chat-server** folder.
1. `export NODE_OPTIONS=--openssl-legacy-provider` in **chat-client** folder.
1. `npm start` in **chat-client** folder.



