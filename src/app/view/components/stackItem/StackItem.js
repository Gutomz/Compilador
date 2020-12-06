import React from 'react';

class StackItem extends React.PureComponent {
  render() {
    const { index, value, current } = this.props;

    return (
      <div className={`stack-item ${current ? 'stack-item--active' : ''}`}>
        <div className="stack-item__index">
          <p className="stack-item__text stack-item__index__inner">{index}</p>
        </div>
        <p className="stack-item__text">{value}</p>
      </div>
    );
  }
}

export default StackItem;
