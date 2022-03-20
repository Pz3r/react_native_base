import React from 'react';
import { connect } from 'react-redux';

import MainDrawerNavigator from '../navigation/drawer';
import AuthenticationStackNavigator from '../sections/authentication/navigation/stack';

function MainComponent({
  authenticated,
}) {

  if (!authenticated) {
    return (
      <AuthenticationStackNavigator />
    )
  } else {
    return (
      <MainDrawerNavigator />
    )
  }

}

export default connect(
  (state, ownProps) => ({ ...state.User, ...ownProps })
)(MainComponent)