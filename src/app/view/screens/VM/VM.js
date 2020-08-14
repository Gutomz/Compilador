import React from 'react';

import { Input, Button } from 'antd';

class VM extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="vm">
        <div className="vm__inner-view vm__inner-view--first">
          <div className="vm__console-view">
            <div className="vm__console-view__inner" />
          </div>
          <div className="vm__input-view">
            <Input className="vm__input-view__input" />
            <div className="vm__input-view__button">
              <Button>RUN</Button>
              <Button className="vm__input-view__button--margin-left">
                DEBUG
              </Button>
            </div>
          </div>
        </div>
        <div className="vm__inner-view vm__inner-view--second">
          <div className="vm__code-view">
            <div className="vm__code-view__inner">
              <p className="vm__code-view__inner__text">Código</p>
            </div>
          </div>
          <div className="vm__input-view" />
        </div>
      </div>
    );
  }
}

export default VM;
