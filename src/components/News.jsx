import React, { useState } from 'react';
import { Select, Typography, Row, Col, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
  const { data: cryptoCurrencies } = useGetCryptosQuery(100, { skip: simplified });
  const { data: cryptoNews, isFetching, isError } = useGetCryptoNewsQuery({ newsCategory, count: simplified ? 6 : 12 });

  if (isFetching) return <Loader />;
  if (isError) return <p className="empty-state">News could not be loaded. Please try again later.</p>;
  if (!cryptoNews?.value) return <p className="empty-state">No news articles were found.</p>;

  return (
    <div className={`news-list ${simplified ? 'news-list-simplified' : ''}`}>
      {!simplified && (
        <div className="news-editorial-heading">
          <div>
            <span className="eyebrow">The market journal</span>
            <Title level={2}>Crypto news</Title>
            <p>Reporting and analysis from across the digital asset market.</p>
          </div>
          <Select
            showSearch
            className="select-news"
            aria-label="Filter news by cryptocurrency"
            placeholder="Search a cryptocurrency"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            <Option value="Cryptocurrency">All crypto news</Option>
            {cryptoCurrencies?.data?.coins?.map((currency) => <Option key={currency.uuid} value={currency.name}>{currency.name}</Option>)}
          </Select>
        </div>
      )}
      <Row gutter={[20, 20]} className="news-editorial-grid">
        {cryptoNews.value.map((news, index) => {
          const featured = !simplified && index === 0;
          const imageUrl = news?.image?.thumbnail?.contentUrl;

          return (
            <Col xs={24} sm={featured ? 24 : 12} lg={featured ? 24 : 8} key={news.url}>
              <Card hoverable className={`news-card ${featured ? 'news-card-featured' : ''} ${!imageUrl ? 'news-card-text-only' : ''}`}>
                <a href={news.url} target="_blank" rel="noreferrer">
                  <div className="news-card-copy">
                    <Text className="news-source">{news.provider?.[0]?.name || 'Crypto news'}</Text>
                    <Title className="news-title" level={featured ? 3 : 4}>{news.name}</Title>
                    {news.description && <p>{news.description.length > (featured ? 240 : 120) ? `${news.description.substring(0, featured ? 240 : 120)}...` : news.description}</p>}
                    <span className="news-read-link">Read article <ArrowRightOutlined /></span>
                  </div>
                  {imageUrl && (
                    <img
                      className="news-card-image"
                      src={imageUrl}
                      alt=""
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </a>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default News;
