import React, { useEffect, useState } from "react";
import millify from "millify";
import { Link } from "react-router-dom";
import { Card, Row, Col, Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useGetCryptosQuery } from "../services/cryptoApi";
import Loader from "./Loader";

const { Title } = Typography;

const CryptoCurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCryptos(cryptosList?.data?.coins);

    const filteredData = cryptosList?.data?.coins.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );

    setCryptos(filteredData);
  }, [cryptosList, searchTerm]);

  if (isFetching) return <Loader />;
  if (cryptos && cryptos.length === 0) return <div className="empty-state">No cryptocurrencies match your search.</div>;

  return (
    <>
      {!simplified && (
        <div className="currency-list-toolbar">
          <div>
            <span className="eyebrow">Explore the market</span>
            <Title level={2}>Cryptocurrencies</Title>
            <p>Compare prices, market caps, and daily moves.</p>
          </div>
          <Input
            className="search-crypto"
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>
      )}
      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos?.map((currency) => (
          <Col
            xs={24}
            sm={12}
            lg={8}
            xl={6}
            className="crypto-card"
            key={currency.uuid}
          >
            {/* Note: Change currency.id to currency.uuid  */}
            <Link key={currency.uuid} to={`/crypto/${currency.uuid}`}>
              <Card
                className="currency-card"
                title={`${currency.rank}. ${currency.name}`}
                extra={<img className="crypto-image" src={currency.iconUrl} alt={`${currency.name} icon`} />}
                hoverable
              >
                <div className="currency-metric"><span>Price</span><strong>${millify(currency.price)}</strong></div>
                <div className="currency-metric"><span>Market cap</span><strong>${millify(currency.marketCap)}</strong></div>
                <div className="currency-metric"><span>24h change</span><strong className={Number(currency.change) >= 0 ? 'positive-change' : 'negative-change'}>{currency.change}%</strong></div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CryptoCurrencies;
