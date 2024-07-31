import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { markets } from "../../temp-db/price-predictor-output";

function MarketCard({ data }) {
  return (
    <Card className="my-1" style={{ width: "95vw" }}>
      <Row noGutters>
        <Col xs={4} style={{ backgroundColor: "green", padding: 0 }}>
          <Card.Img
            alt="Market"
            src={markets[Math.floor(Math.random() * markets.length)]}
            style={{ objectFit: "cover", height: "100%" }}
          />
        </Col>
        <Col xs={8}>
          <Card.Body>
            <Card.Text>
              <b>Market: </b>
              {data.Market}
            </Card.Text>
            <Card.Text>
              <b>Price: </b>
              {data.Modal_Price}
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default MarketCard;
