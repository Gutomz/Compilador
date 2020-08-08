import React from 'react';

import { Layout } from 'antd';

const { Sider } = Layout;

class Panel extends React.PureComponent {
  render() {
    return (
      <Layout className="panel__layout" hasSider>
        <Sider
          width="300"
          theme="dark"
          trigger={null}
          className="panel__sider"
          breakpoint="lg"
        />
      </Layout>
    );
  }
}

export default Panel;
