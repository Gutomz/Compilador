import React from 'react';

class ConsoleItem extends React.PureComponent {
  render() {
    const { time, message } = this.props;

    return (
      <div className="console-item">
        <span className="console-item__time">{time}</span>
        <span className="console-item__divider">-</span>
        <span className="console-item__message">{message}</span>
      </div>
    );
  }
}

export default ConsoleItem;
