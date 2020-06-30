import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import TestPage from './container/testPage/testPage';

class App extends React.Component {

  render() {
    return (<>
      <Switch>
        <Route path='/' exact={true} component={TestPage} />
        <Route path='/:terms?/:styles?/:brandsTerms?' exact={true} component={TestPage} />
      </Switch>
    </>
    )
  }
}

export default App;
