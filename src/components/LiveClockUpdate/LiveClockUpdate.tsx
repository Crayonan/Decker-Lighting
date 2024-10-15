import { Component } from "react";

interface LiveClockUpdateState {
  date: Date;
}

class LiveClockUpdate extends Component<{}, LiveClockUpdateState> {
  private timerID: number | undefined;

  constructor(props: {}) {
    super(props);

    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = window.setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <p>{this.state.date.toLocaleTimeString()}</p>
      </div>
    );
  }
}

export default LiveClockUpdate;