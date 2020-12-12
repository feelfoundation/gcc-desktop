import id from '../assets/images/dashboard/id.svg';
import transparent from '../assets/images/dashboard/transparent.svg';
import vote from '../assets/images/dashboard/vote.svg';

const quickTips = t => [
  {
    title: t('What is a Feel ID?'),
    description: [
      t('Your Feel ID is how you recognize and interact with your unique Feel account, think of it as your email.'),
      t('You can share your Feel ID with anyone you wish, but never reveal your passphrase to anyone as it would allow full access to your account.'),
    ],
    picture: id,
  },
  {
    title: t('Why should I vote?'),
    description: [
      t('By voting you decide who is trusted to verify transactions and maintain the Feel network, whilst collecting the rewards for doing so.'),
      t('Each GCC is worth one vote.'),
    ],
    picture: vote,
  },
  {
    title: t('How is Feel transparent?'),
    description: [
      t('Like almost all blockchains Feel has transparency at it’s core. This means that anyone can view everything that happens on the Feel network, including the holdings of each account.'),
      t('This helps to keep the network fair, open and honest.'),
    ],
    picture: transparent,
  },
];

export default quickTips;
