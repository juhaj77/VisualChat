# chat & brainstorming - application

[app in Heroku](https://dry-dusk-03720.herokuapp.com/)

Each chat channel has its own note view. It is common to channel users. Channel members can arrange, create, edit, delete or change color of the notes. The note view is updated in real time. Connected users and active channels are shown for application users.

## prerequisites

* MongoDB [installation](https://docs.mongodb.com/manual/installation/)
  * In Windows environment it's easiest to install signed version:
  * 1. download [installer](https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.6-signed.msi)
    1. run `msiexec.exe /l*v mdbinstall.log  /qb /i mongodb-win32-x86_64-2012plus-4.2.6-signed.msi`
* npm [get npm](https://www.npmjs.com/get-npm)

## installation

1. run `npm install` in folder `chat-client`
1. run `npm install` in folder `chat-server`
1. create _.env_ file with content:
   ```
    MONGODB_URI=mongodb://localhost/chat
    PORT=3003
    NODE_ENV=test
    SECRET='mySecretStrimg'
   ```
    into folder `chat-server`

## usage

____Application doesn't work in Edge browser! For testing purpose needs to have own browser per session with one pc. for example Chrome for user1 and Firefox for user2. Browser's local storage doesn't handle multiple sessions correctly in this solution.____

1. `npm start` in **chat-server** folder.
1. `npm start` in **chat-client** folder.

### working scene for selected channel

![Image of note view](https://github.com/altrangaj/Chat-Brainstorm/blob/master/images/UI.png)

* yellow border (type hover) restricts working area for the notes. The working area is draggable because it covers bigger area than browser window has. On that area you can add note with the right mouse button (does not work with Apple mouse)
* right upper corner has the chat window with the channel selection list and button for creating new channel
* ![Image of UI](https://github.com/altrangaj/Chat-Brainstorm/blob/master/images/note.jpg)
  * over the area marked with red, the right mouse button opens a menu for editing the note. Text content update occurs for other users and the database when focus get out from the text area.
