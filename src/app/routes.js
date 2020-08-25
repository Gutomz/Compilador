import React from 'react';

import { HashRouter as Router, Route } from 'react-router-dom';

import VM from './view/screens/VM';

function Routes() {
  return (
    <Router basename="/">
      <Route path="/" exact component={VM} />
    </Router>
  );
}

export default Routes;
