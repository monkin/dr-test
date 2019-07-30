# Test Task / Slot Machine
A simple slot machine made with TypeScript, BabylonJS, Redux, React and MaterialUI.

Working example could be found there:
https://dr-test-task.s3-eu-west-1.amazonaws.com/index.html

To start the application locally do the folowing steps:
1. Clone the repository
2. Run `npm i` command
3. Run `npm start` command
4. Open `http://localhost:1234/` in your browser

Several assumption were made during implementation:
* If there are more than one winning combination on the reels, only the best of them matters. All other combinations are ignored.
* If there are two equal combinations on the reels, topmost of them wins.
* User can't play with zero balance.

Sorry for slow loading and absence of unit tests.
Thanks.
