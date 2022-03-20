import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Flex, Text, Button } from 'native-base';

import { USER_LOGIN } from '../../../store/actions/user';

function AuthenticationScreen({ loginUser }) {

  return (
    <Flex flex="1" style={styles.container}>
      <Flex flex="2" alignItems="center" justifyContent="center">
      <Text>
        AuthenticationScreen
      </Text>
      </Flex>
      <Flex flex="1" alignItems="center" justifyContent="center">
        <Button
          variant="link"
          onPress={() => loginUser()}>
          Continuar sin registro
        </Button>
      </Flex>
    </Flex>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default connect(
  (state, ownProps) => ({ ...ownProps }),
  dispatch => ({
    loginUser: payload => {
      dispatch({
        type: USER_LOGIN,
        payload
      })
    }
  })
)(AuthenticationScreen);