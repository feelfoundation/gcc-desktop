import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const _convertTimeFromFirstBlock = value =>
  new Date(new Date(2020, 9, 20, 10, 0, 0, 0).getTime() + value);
// const _convertTimeFromFirstBlock = value =>
// new Date((((Date.UTC(2020, 9, 20, 10, 0, 0, 0) / 1000) + value) * 1000));

export const Time = withTranslation()((props) => {
  moment.locale(i18n.language);
  const time = moment(_convertTimeFromFirstBlock(props.label));
  return <span>{time.fromNow(true)}</span>;
});

export const DateFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const day = moment(_convertTimeFromFirstBlock(props.time));
  return (<span className="date">{day.format('ll')}</span>);
});

export const TimeFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const day = moment(_convertTimeFromFirstBlock(props.time));
  return (<span className="time">{day.format('LTS')}</span>);
});

const timestampConverters = {
  GCC: _convertTimeFromFirstBlock,
  BTC: timestamp => timestamp,
};

export const DateTimeFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const datetime = moment(timestampConverters[props.token || 'GCC'](props.time));
  return (
    <span className={`${props.className || ''}`}>
      {
        props.fulltime ? (
          datetime.format('DD MMM YYYY, hh:mm:ss A')
        )
          : datetime.calendar(null, {
            lastDay: props.t('DD MMM YYYY'),
            sameDay: props.t('hh:mm A'),
            nextDay: props.t('[Tomorrow], hh:mm A'),
            lastWeek: props.t('DD MMM YYYY'),
            nextWeek: props.t('DD MMM YYYY'),
            sameElse: props.t('DD MMM YYYY'),
          })
      }
    </span>
  );
});
