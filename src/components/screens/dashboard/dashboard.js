// istanbul ignore file
import React from 'react';
import WalletDetails from '../../shared/walletDetails';
import RecentTransactions from './recentTransactions';
import styles from './dashboard.css';
import Onboarding from '../../toolbox/onboarding/onboarding';

const getOnboardingSlides = t => [{
  title: t('Ready to go!'),
  content: t('The ultimate gateway to the ecosystem. Feel’s new design lets you easily manage your GCC (and much, much more).'),
  illustration: 'hubReadyToGo',
}, {
  title: t('Stay Informed'),
  content: t('Keep up-to-date with announcements from the Feel Foundation. Check what network delegates have been up to with dedicated profile pages.'),
  illustration: 'builtAroundCommunity',
}, {
  title: t('Send GCC and BTC'),
  content: t('Personalize each transaction with a custom message. Look up its value in a fiat currency of your choice.'),
  illustration: 'sendGCCTokens',
}, {
  title: t('Get Involved'),
  content: t('Community is key. Vote for delegates, or register as one yourself. Feel like a feature is missing? Request it directly from the Feel.'),
  illustration: 'timeToContribute',
}];

const Dashboard = ({ account, t }) => {
  const isLoggedIn = !!(account.address);

  return (
    <React.Fragment>
      <div className={`${styles.wrapper} dashboard-container`}>
        <div style={{ display: 'none' }}>
          <Onboarding
            slides={getOnboardingSlides(t)}
            actionButtonLabel={t('Got it, thanks!')}
            name="dashboardOnboarding"
          />
        </div>
        <div className={`${styles.main}`}>
          <div className={styles.subContainer}>
            {
              isLoggedIn
                ? <WalletDetails className={styles.marginFix} />
                : null
            }

            <RecentTransactions className={styles.marginFix} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
