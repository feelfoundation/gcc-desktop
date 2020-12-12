const castBalanceStringToNumber = number => parseFloat(number.replace(/,/g, ''));

export default function compareBalances(balanceBeforeString, balanceAfterString, cost) {
  const balanceBefore = castBalanceStringToNumber(balanceBeforeString.replace(' GCC', ''));
  const balanceAfter = castBalanceStringToNumber(balanceAfterString.replace(' GCC', ''));
  expect(balanceAfter - parseFloat(balanceBefore - cost)).to.lt(0.1);
}
