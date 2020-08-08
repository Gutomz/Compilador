import React from 'react';

import { HashRouter as Router, Route } from 'react-router-dom';

function Routes() {
  return (
    <Router basename="/">
      <Route path="/" exact component={<></>} />
    </Router>
  );
}

export default Routes;
