import React from 'react';

class InstructionLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeBreakpoint: false,
    };
  }

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
