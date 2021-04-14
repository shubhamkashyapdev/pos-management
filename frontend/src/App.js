import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// components //
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <h1>Header</h1>
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
      <h1>footer</h1>
    </Router>
  );
};

export default App;
