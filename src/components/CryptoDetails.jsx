import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Typography, Select, Button } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined, LinkOutlined } from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState('7d');
  const [showAllLinks, setShowAllLinks] = useState(false);
  const { data, isFetching, isError, refetch } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timeperiod });
  const cryptoDetails = data?.data?.coin;

  if (isFetching) return <Loader />;
  if (isError || !cryptoDetails) {
    return (
      <section className="coin-load-error">
        <Title level={3}>Coin details are unavailable</Title>
        <p>We couldn’t load this coin’s information. Check your connection and try again.</p>
        <Button onClick={refetch}>Try again</Button>
      </section>
    );
  }

  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails?.price && millify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptoDetails?.['24hVolume'] ? millify(cryptoDetails['24hVolume']) : '—'}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time high', value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Approved supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total supply', value: cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total), icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating supply', value: cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating), icon: <ExclamationCircleOutlined /> },
  ];
  const coinLinks = cryptoDetails.links || [];
  const visibleLinks = showAllLinks ? coinLinks : coinLinks.slice(0, 6);

  return (
    <Col className="coin-detail-container">
      <section className="coin-overview-card">
        <div className="coin-overview-identity">
          <img className="coin-overview-icon" src={cryptoDetails.iconUrl} alt={`${cryptoDetails.name} icon`} onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
          <div>
            <span className="eyebrow">Digital asset</span>
            <Title level={2} className="coin-name">{cryptoDetails.name}</Title>
            <div className="coin-overview-meta">
              <span>{cryptoDetails.symbol}</span>
              <span className="coin-rank">Rank #{cryptoDetails.rank}</span>
            </div>
          </div>
        </div>
        <div className="coin-overview-summary">Live price, market activity, and project information.</div>
      </section>
      <div className="chart-controls">
        <span>Price history</span>
        <Select value={timeperiod} className="select-timeperiod" aria-label="Chart time period" onChange={(value) => setTimeperiod(value)}>
          {time.map((date) => <Option key={date} value={date}>{date}</Option>)}
        </Select>
      </div>
      <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails?.price)} coinName={cryptoDetails?.name} />
      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">{cryptoDetails.name} Value Statistics</Title>
            <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">Other Stats Info</Title>
            <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <section className="coin-desc-link">
        <article className="coin-desc">
          <Title level={3} className="coin-details-heading">About {cryptoDetails.name}</Title>
          <div className="coin-description-content">
            {HTMLReactParser(cryptoDetails.description || '<p>Description unavailable.</p>')}
          </div>
        </article>
        <aside className="coin-links">
          <Title level={3} className="coin-details-heading">Official links</Title>
          <div className="coin-links-list">
            {visibleLinks.map((link) => (
              <a className="coin-link" href={link.url} target="_blank" rel="noreferrer" key={link.url} title={`${link.type}: ${link.name}`}>
                <span className="coin-link-copy">
                  <span className="link-name">{link.type}</span>
                  <span className="coin-link-label">{link.name}</span>
                </span>
                <LinkOutlined className="coin-link-icon" />
              </a>
            ))}
            {!coinLinks.length && <p className="coin-links-empty">No links available.</p>}
          </div>
          {coinLinks.length > 6 && (
            <Button type="link" className="coin-links-toggle" onClick={() => setShowAllLinks((visible) => !visible)}>
              {showAllLinks ? 'Show fewer' : `Show all ${coinLinks.length} links`}
            </Button>
          )}
        </aside>
      </section>
    </Col>
  );
};

export default CryptoDetails;

