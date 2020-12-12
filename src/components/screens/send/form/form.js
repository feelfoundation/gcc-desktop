import React from 'react';
import FormBtc from './formBtc';
import FormGCC from './formGCC';

const TokenSpecificFormMap = {
  GCC: FormGCC,
  BTC: FormBtc,
};

export default function Form(props) {
  const { token, prevState, initialValue } = props;

  const getInitialValue = fieldName => (
    prevState && prevState.fields ? prevState.fields[fieldName].value : initialValue[fieldName] || ''
  );

  const TokenSpecificForm = TokenSpecificFormMap[token];
  return <TokenSpecificForm {...props} key={token} getInitialValue={getInitialValue} />;
}

Form.defaultProps = {
  prevState: {},
  data: {},
};
