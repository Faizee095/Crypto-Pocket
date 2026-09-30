import React, { useState } from 'react';
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import moment from 'moment';

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
  if (isError) return <p>News could not be loaded. Please try again later.</p>;
  if (!cryptoNews?.value) return <p>No news articles were found.</p>;

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {cryptoCurrencies?.data?.coins?.map((currency) => <Option key={currency.uuid} value={currency.name}>{currency.name}</Option>)}
          </Select>
        </Col>
      )}
      {cryptoNews.value.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title className="news-title" level={4}>{news.name}</Title>
                <div className="news-image-frame" aria-hidden="true">
                  <FileImageOutlined />
                  {news?.image?.thumbnail?.contentUrl && (
                    <img
                      className="news-image"
                      src={news.image.thumbnail.contentUrl}
                      alt=""
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>
              <p>{news.description?.length > 100 ? `${news.description.substring(0, 100)}...` : news.description}</p>
              <div className="provider-container">
                <div>
                  <Avatar>{news.provider?.[0]?.name?.charAt(0)?.toUpperCase() || '?'}</Avatar>
                  <Text className="provider-name">{news.provider?.[0]?.name}</Text>
                </div>
                {news.datePublished && <Text>{moment(news.datePublished).fromNow()}</Text>}
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
