import React from 'react';
import { connect } from 'react-redux';

import MainStackNavigator from '../navigation/stack';
import AuthenticationStackNavigator from '../sections/authentication/navigation/stack';
import { QuietConsumer, QuietProvider } from '../context/Audioguide';

function MainComponent({
  authenticated,
}) {

  if (!authenticated && false) {
    return (
      <AuthenticationStackNavigator />
    )
  } else {
    return (
      <QuietProvider>
        <QuietConsumer>
          {context => {
            console.log(`===== GUIDE INDEX ${context.lastMessage} / ${context.count}`);
            return (
              <MainStackNavigator />
            )
          }}
        </QuietConsumer>
      </QuietProvider>
    )
  }

}

export default connect(
  (state, ownProps) => ({ ...state.User, ...ownProps })
)(MainComponent)