import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';

export default (t, activeToken) => {
  const isGCC = activeToken === tokenMap.GCC.key;
  const isMobile = document.body.clientWidth < 640;
  if (isMobile) {
    return ([
      {
        title: t('Transaction'),
        classList: grid['col-xs-9'],
      },
      {
        title: t('Amount'),
        classList: grid['col-xs-3'],
      },
    ]);
  }
  return ([
    {
      title: t('Transaction'),
      classList: isGCC ? grid['col-xs-4'] : grid['col-xs-5'],
    },
    {
      title: t('Date'),
      classList: isGCC ? grid['col-xs-2'] : grid['col-xs-3'],
    },
    {
      title: t('Fee'),
      classList: grid['col-xs-2'],
    },
    {
      title: t('Details'),
      classList: isGCC ? `${grid['col-xs-2']} ${grid['col-md-2']}` : 'hidden',
    },
    {
      title: t('Amount'),
      classList: grid['col-xs-2'],
    },
  ]);
};
