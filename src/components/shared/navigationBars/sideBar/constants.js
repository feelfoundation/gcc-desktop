import routes from '../../../../constants/routes';

const menuLinks = t => ([
  [
    {
      icon: 'accountsMonitor',
      id: 'accounts',
      label: t('Sign in'),
      path: routes.login.path,
    },
    {
      icon: 'dashboardIcon',
      id: 'dashboard',
      label: t('Dashboard'),
      path: routes.dashboard.path,
    },
    {
      icon: 'walletIcon',
      id: 'wallet',
      label: t('Wallet'),
      path: routes.wallet.path,
    },
  ],
  [
    {
      icon: 'networkMonitor',
      id: 'blank_network',
      label: t('Feel Explorer'),
      path: 'http://gcce.feel.surf',
    },
  ],
  [
    {
      icon: 'signMessage',
      id: 'signMessage',
      label: t('Sign Message'),
      modal: 'signMessage',
    },
    {
      icon: 'verifyMessage',
      id: 'verifyMessage',
      label: t('Verify Message'),
      modal: 'verifyMessage',
    },
  ],
  [
    {
      icon: 'settings',
      id: 'settings',
      label: t('Settings'),
      modal: 'settings',
    },
  ],
]);

export default menuLinks;
