TODO:
 - Memory Leak:
   - The first time a user logs in with discord and we write to database, 
     user is redirected to /dashboard but immediately kicked back to /login
       - I think this is bc authentication flow is badly written. 
   - When the user has already logged in, they get redirected to /dashboard,
      but there's a memory leak inside of LoginPage component in /login
      - 
   - Observations:
      - firebaseUser gets filled before userData, thus giving loading === false but logged in === false too
      - Why does it redirect if firebase has my user in auth?
      - isvalidUser is returning false when it should return true

AUTHENTICATION FLOW WITH DISCORD
 - Discord
   - Gets to discord auth page
     - Grants permission
       - 
     - Doesn't grant permission
 - Google








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