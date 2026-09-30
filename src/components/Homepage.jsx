import React from "react";
import millify from 'millify';
import { Typography, Row, Col, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';

import { useGetCryptosQuery } from '../services/cryptoApi';
import CryptoCurrencies from "./CryptoCurrencies";
import News from './News';
import Loader from './Loader';

const { Title } = Typography;


const Homepage = () => {
    const { data, isFetching } = useGetCryptosQuery(10);
    const globalStats = data?.data?.stats;
  
    if (isFetching || !globalStats) return <Loader />;

    const stats = [
      { title: 'Cryptocurrencies', value: millify(globalStats.total) },
      { title: 'Exchanges', value: millify(globalStats.totalExchanges) },
      { title: 'Market cap', value: `$${millify(globalStats.totalMarketCap)}` },
      { title: '24h volume', value: `$${millify(globalStats.total24hVolume)}` },
      { title: 'Markets', value: millify(globalStats.totalMarkets) },
    ];
  
    return (
      <div className="homepage">
        <section className="market-overview">
          <div className="market-overview-heading">
            <span className="eyebrow">Market overview</span>
            <Title level={2} className="heading">Crypto market at a glance</Title>
            <p>Live stats across the global digital asset market.</p>
          </div>
          <Row gutter={[12, 12]} className="global-stats">
            {stats.map(({ title, value }) => (
              <Col xs={12} sm={8} key={title}>
                <div className="global-stat-card"><Statistic title={title} value={value} /></div>
              </Col>
            ))}
          </Row>
        </section>
        <div className="home-heading-container">
          <Title level={2} className="home-title">Top 10 Cryptos In The World</Title>
          <Link className="section-link" to="/cryptocurrencies">View all <ArrowRightOutlined /></Link>
        </div>
        <CryptoCurrencies simplified />
        <div className="home-heading-container">
          <Title level={2} className="home-title">Latest Crypto News</Title>
          <Link className="section-link" to="/news">View all <ArrowRightOutlined /></Link>
        </div>
        <News simplified />
      </div>
    );
  };
  
  export default Homepage;
