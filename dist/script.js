//dependencies
const { Provider } = ReactRedux;

//main clock component
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      secondsOfTime: 1500,
      displayedTime: "25:00",
      timerRunning: false,
      timerType: 'SESSION' };

    this.sessionHandler = this.sessionHandler.bind(this);
    this.breakHandler = this.breakHandler.bind(this);
    this.clockCounter = this.clockCounter.bind(this);
    this.myStartInterval = this.myStartInterval.bind(this);
    this.myStopInterval = this.myStopInterval.bind(this);
    this.reset = this.reset.bind(this);
    this.formatTime = this.formatTime.bind(this);
  }

  //increment the session up or down based on what button is pressed, then update the state for seconds of time and displayed time
  sessionHandler(event) {
    //check which button was pressed via id, and make sure it's not trying to increment over the 60 minute max length
    if (event.target.id == "session-increment" && this.state.sessionLength < 60) {
      //increment the session length string by one
      let currentSessionLength = this.state.sessionLength + 1;
      //increment the seconds of time string by 60 seconds before updating it's format for display
      let currentTime = this.state.secondsOfTime + 60;
      let currentDisplayedTime = this.formatTime(currentTime);
      //update the app state with new values
      this.setState({ sessionLength: currentSessionLength,
        secondsOfTime: currentTime,
        displayedTime: currentDisplayedTime });

    }
    //check which button was pressed via id, and make sure it's not trying to decrement under the 1 minute min length
    else if (event.target.id == "session-decrement" && this.state.sessionLength > 1) {
        //decrement the session length string by one
        let currentSessionLength = this.state.sessionLength - 1;
        //decrement the seconds of time string by 60 seconds before updating it's format for display
        let currentTime = this.state.secondsOfTime - 60;
        let currentDisplayedTime = this.formatTime(currentTime);
        //update the app state with incremented values
        this.setState({ sessionLength: currentSessionLength,
          secondsOfTime: currentTime,
          displayedTime: currentDisplayedTime });

      }
  }

  //increment the break up or down based on what button is pressed, then update the state for seconds of time and displayed time
  breakHandler(event) {
    //check which button was pressed via id, and make sure it's not trying to increment over the 60 minute max length
    if (event.target.id == "break-increment" && this.state.breakLength < 60) {
      //increment the break length string by one
      let currentBreakLength = this.state.breakLength + 1;
      //update the app state with new values
      this.setState({ breakLength: currentBreakLength });
    }
    //check which button was pressed via id, and make sure it's not trying to decrement under the 1 minute min length
    else if (event.target.id == "break-decrement" && this.state.breakLength > 1) {
        //decrement the break length string by one
        let currentBreakLength = this.state.breakLength - 1;
        //update the app state with new values
        this.setState({ breakLength: currentBreakLength });
      }
  }

  //reset the clock back to it's default values
  reset() {
    //stop the clock from running
    this.myStopInterval();
    //find the audio element by id and pause/reset it
    let buzz = document.querySelector('#beep');
    buzz.pause();
    buzz.currentTime = 0;
    //set app state back to inital values
    this.setState({ breakLength: 5,
      sessionLength: 25,
      secondsOfTime: 1500,
      displayedTime: "25:00",
      timerType: "SESSION" });

    //find the timer display by id and stop it from blinking if it is (starts blinking when < 60secs)
    const blink = document.querySelector('#time-left');
    blink.classList.remove('blink');
    //find the play/pause button by id and switch it back to the play icon
    const activeButton = document.querySelector('#start_stop');
    activeButton.classList.replace('fa-pause-circle', 'fa-play-circle');
  }

  //logic that starts the timer
  myStartInterval() {
    if (this.state.timerRunning == false) {
      //start an interval that runs every second (1000ms), the interval runs the method to update the displayed timer. Also creates a variable that tracks the counter id for using when stopping it.
      this.timer = setInterval(this.clockCounter, 1000);
      //set the timer state to running to handle logic flows in the future
      this.setState({ timerRunning: true });
      //update icon to display from play to pause
      const activeButton = document.querySelector('#start_stop');
      activeButton.classList.replace('fa-play-circle', 'fa-pause-circle');
    } else
    {
      //run the method that stops the timer
      this.myStopInterval();
      //update icon to display from pause to play
      const activeButton = document.querySelector('#start_stop');
      activeButton.classList.replace('fa-pause-circle', 'fa-play-circle');
    }

  }

  //stop the interval using the variable set when it was created
  myStopInterval() {
    clearInterval(this.timer);
    //set the timer state to  not running to handle logic flows in the future
    this.setState({ timerRunning: false });
  }

  //math and formatting for changing the time in seconds counter to the clock display 
  formatTime(currentTime) {
    //do the math to figure out how many minutes/seconds remain
    let minutes = parseInt(currentTime / 60, 10);
    let seconds = parseInt(currentTime % 60, 10);
    //if the minutes/seconds are single digit then add a 0 to the front, otherwise just display them
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    //update the string that displays the time as a clock
    let currentDisplayedTime = `${minutes}:${seconds}`;
    return currentDisplayedTime;
  }

  //main method that is ran every second
  clockCounter() {
    //check if the clock has gotten to the end, depending on which counter was last ongoing (session vs break) update the clock and labels accordingly
    if (this.state.secondsOfTime == 0) {
      //logic from switching from break to session timer
      if (this.state.timerType == "BREAK") {
        //update seconds based on session timer  
        let currentTime = this.state.sessionLength * 60;
        //get the math and do formatting for clock display
        let currentDisplayedTime = this.formatTime(currentTime);
        //update the state of the seconds counter, display timer, and type
        this.setState({ displayedTime: currentDisplayedTime,
          secondsOfTime: currentTime,
          timerType: "SESSION" });

        //play the timer sound
        let buzz = document.querySelector('#beep');
        buzz.play();
      }
      //logic from switching from session to break timer
      else {
          //update seconds based on break timer
          let currentTime = this.state.breakLength * 60;
          let currentDisplayedTime = this.formatTime(currentTime);
          //update the state of both the seconds timer and display timer
          this.setState({ displayedTime: currentDisplayedTime,
            secondsOfTime: currentTime,
            timerType: "BREAK" });

          //play the timer sound
          let buzz = document.querySelector('#beep');
          buzz.play();
        }
      //top the timer from blinking once if the timer gets to 0
      const blink = document.querySelector('#time-left');
      blink.classList.remove('blink');
    }
    //logic for any time the clock has not reached 0
    else {
        //decriment the counter that tracks the seconds of time  
        let currentTime = this.state.secondsOfTime - 1;
        //get the new time which is formatted  
        let currentDisplayedTime = this.formatTime(currentTime);
        //update the state of both the seconds timer and display timer
        this.setState({ displayedTime: currentDisplayedTime,
          secondsOfTime: currentTime });

        //start making the timer blink as a warning for 60 seconds left
        if (this.state.secondsOfTime <= 60) {
          const blink = document.querySelector('#time-left');
          blink.classList.add('blink');
        }
      }
  }

  render() {
    return (
      React.createElement("div", { id: "main-section" },
      React.createElement("h1", { id: "project-header" }, "Pomodoro Clock"),
      React.createElement("div", { class: "section" },
      React.createElement("h2", { id: "break-label" }, "Break Length"),
      React.createElement("h2", { id: "break-length" }, this.state.breakLength),
      React.createElement("button", { type: "button", class: "fas fa-caret-square-up", id: "break-increment", onClick: this.breakHandler }),
      React.createElement("button", { type: "button", class: "fas fa-caret-square-down", id: "break-decrement", onClick: this.breakHandler })),

      React.createElement("div", { class: "section" },
      React.createElement("h2", { id: "session-label" }, "Session Length"),
      React.createElement("h2", { id: "session-length" }, this.state.sessionLength),
      React.createElement("button", { type: "button", class: "fas fa-caret-square-up", id: "session-increment", onClick: this.sessionHandler }),
      React.createElement("button", { type: "button", class: "fas fa-caret-square-down", id: "session-decrement", onClick: this.sessionHandler })),

      React.createElement("div", { id: "last-section", class: "section" },
      React.createElement("h2", { id: "timer-label" }, this.state.timerType),
      React.createElement("h2", { id: "time-left" }, this.state.displayedTime),
      React.createElement("button", { type: "button", class: "fas fa-play-circle", id: "start_stop", onClick: this.myStartInterval }),
      React.createElement("button", { type: "button", class: "fas fa-undo-alt", id: "reset", onClick: this.reset }),
      React.createElement("audio", { id: "beep", src: "https://goo.gl/65cBl1" }))));


  }}


//app container
class App extends React.Component {
  render() {
    return (
      React.createElement(Clock, null));
  }}


//render to DOM
ReactDOM.render(
React.createElement(Provider, null,
React.createElement(App, null)),
document.getElementById('root'));