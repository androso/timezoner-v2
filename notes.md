Problem: if i sign in with discord and then with google, it lets me do it.
Side effects:
 1. The provider info is filled with the google info.
 2. photoURL and username are the same as in discord.

 Observations:
  - on mobile: i need to put email and password in the browser, even though i have logged in with google in my phone (outside the browser)
    - Is it because i'm using redirect instead of popup?


TODO:
 X Refactor callback.ts, abstract requests into their own files/functions
 - Make Dashboard frontend
  - Fix responsiveness in less than 369px
 - We shouldn't request from the discord api, instead it should be from our own database
 - See the documentation from next js to handle typography