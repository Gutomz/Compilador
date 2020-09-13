import React from 'react';

import { HashRouter as Router, Route } from 'react-router-dom';

import CompiladorEditor from './view/screens/Compilador';
import VM from './view/screens/VM';

function Routes() {
  return (
    <Router basename="/">
      <Route path="/" exact component={CompiladorEditor} />
      <Route path="/vm" exact component={VM} />
    </Router>
  );
}

export default Routes;
