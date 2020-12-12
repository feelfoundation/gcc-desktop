import React from 'react';
import moment from 'moment';
import Icon from '../../../toolbox/icon';
import TweetParser from './twitterParser';
import styles from './news.css';

const News = ({
  // eslint-disable-next-line camelcase
  content, timestamp, url, title, author, image_url, source, t,
}) => {
  const date = moment.unix(timestamp).format('DD MMM YYYY');
  const newsTitle = title || author;
  const authorText = author === 'feelfoundation' ? null
    // eslint-disable-next-line react/jsx-one-expression-per-line
    : <span> {t('Written by')} <b className={styles.author}>{author}</b></span>;
  const iconSource = source === 'twitter_feel' ? 'newsFeedTwitter' : 'newsFeedBlog';
  return (
    <div
      className={`${styles.news} news-item`}
      onClick={() => (window.open(url, '_blank', 'rel="noopener noreferrer'))}
    >
      <div className={styles.header}>
        <Icon name={iconSource} className={styles.icon} />
        <div>
          <span className={styles.title}>{newsTitle}</span>
          <span className={styles.subtitle}>
            {authorText}
            {date}
          </span>
        </div>
      </div>
      <div className={styles.description}>
        <TweetParser>
          {content.replace(/<br \/>/g, '').replace(url, '')}
        </TweetParser>
      </div>
      {
        // eslint-disable-next-line camelcase
        image_url ? <img className={styles.img} src={image_url} alt={title} /> : null
      }
    </div>
  );
};

export default News;
