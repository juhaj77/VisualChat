# VisualChat - application

Each chat channel has its own note view. It is common to channel users. Channel members can arrange, create, edit, delete or change color of the notes. The note view is updated in real time. Png-images can be uploaded. Connected users and active channels are shown for application users. Google login is partially implemented.

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
1. create _.env_ file with content:
   ```
   REACT_APP_CLIENT_ID='client id from https://console.cloud.google.com app credentials'
   ```
    into folder `chat-client`
       
![Image for oauth credentials](https://github.com/juhaj77/VisualChat/blob/master/images/oauth.png)
## usage

____tested with Firefox and Chrome.____

1. `npm start` in **chat-server** folder.
1. `export NODE_OPTIONS=--openssl-legacy-provider` in **chat-client** folder.
1. `npm start` in **chat-client** folder.

### working scene for selected channel

![Image of note view](https://github.com/juhaj77/VisualChat/blob/master/images/UI.png)

