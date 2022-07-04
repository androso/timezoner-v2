TODO:
- Add pagination to all events 
- check if we could use react-query for useAllEvents
- Start using react-query with firestore for keeping stale eventdata
- Add error boundary
- Replace React-select and React-datepicker w lightweight options
- Move the login (google + discord and leave some space for email and password) and logout to AuthProvider @ context.tsx2
- Change axios for fetch (only if you need it right now)

Components

 <!-- X Refactor callback.ts, abstract requests into their own files/functions
 X Make Dashboard frontend
  X Fix responsiveness in less than 369px
 X Connect to firestore emulator
 - We should start writing tests
  - The backend shouldn't allow me to login with another provider that uses an email already in the database
 - First time i get discord user in the backend, send to firestore, then pull from it in the frontend
 - Use References data types instead of writing the ids of users/events in a string field
 - We shouldn't request from the discord api, instead it should be from our own database
 - See the documentation from next js to handle typography -->

<!-- Problem: if i sign in with discord and then with google, it lets me do it.
Side effects:
 1. The provider info is filled with the google info.
 2. photoURL and username are the same as in discord.

 Observations:
  - on mobile: i need to put email and password in the browser, even though i have logged in with google in my phone (outside the browser)
    - Is it because i'm using redirect instead of popup?
  - Getting user info from database would take longer than just using info provided by the api
   - Maybe forcing to use info stored in db if the api didn't provide anything (worst-case scenario?)

working on right now: "getting user data from db only
when there's no data from the api" -->

<!--
- With discord we could store the user info from the backend and then
in the client, fetch the user profile from our database -->
