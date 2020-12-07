import React from 'react';

class InstructionLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeBreakpoint: false,
    };
  }

  renderIndex = (index) => {
    console.log(typeof index);
    if (index < 10) return `   ${index}`;
    if (index < 100) return `  ${index}`;
    if (index < 1000) return ` ${index}`;
    return `${index}`;
  };

  render() {
    const { activeBreakpoint } = this.state;
    const { index, instruction, current, onBreakpointPress } = this.props;

    return (
      <div
        className={`instruction-line ${
          current ? 'instruction-line--active' : ''
        }`}
      >
        <button
          className={`instruction-line__breakpoint ${
            activeBreakpoint ? 'instruction-line__breakpoint--active' : ''
          } disable-outlines`}
          type="button"
          onClick={() =>
            this.setState({ activeBreakpoint: !activeBreakpoint }, () => {
              if (
                onBreakpointPress &&
                typeof onBreakpointPress === 'function'
              ) {
                onBreakpointPress(!activeBreakpoint);
              }
            })
          }
        >
          {activeBreakpoint ? '•' : ''}
        </button>
        <p className="instruction-line__text instruction-line__index">
          {index}
        </p>
        <p className="instruction-line__text">{instruction}</p>
      </div>
    );
  }
}

export default InstructionLine;
