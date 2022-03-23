import React from 'react';
import { connect } from 'react-redux';

import MainStackNavigator from '../navigation/stack';
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
      <MainStackNavigator />
    )
  }

}

export default connect(
  (state, ownProps) => ({ ...state.User, ...ownProps })
)(MainComponent)