import React, { useState } from "react";
import { input_data, optimal_crops } from "../../temp-db/crop-yields-output";
import { Card, Button } from "react-bootstrap";
import YModal from "./YModal";

function YPredictor() {
  const [showInfo, setShowInfo] = useState(false);
  const [cropInfo, setCropInfo] = useState({});
  const handleCropClick = (cropData) => {
    setCropInfo(cropData);
    setShowInfo(true);
  };
  return (
    <div>
      <h3 style={{ paddingLeft: "20px", textAlign: "left", marginTop: 20 }}>
        Crop Yield Predictor
      </h3>
      <div style={{ paddingLeft: "20px", textAlign: "left" }}>
        <p>
          Based on the current status of soil moisture, temperature, and light,
          here are some crops that can make profit.
        </p>

        <p>
          <span>Current soil moisture: </span>
          {input_data.soil_moisture}
        </p>
        <p>
          <span>Temperature: </span>
          {input_data.temperature}
        </p>
        <p>
          <span>Light: </span>
          {input_data.light_conditions.replace("_", " ")}
        </p>
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {optimal_crops.map((crop, key) => (
          <Card
            key={key}
            style={{ width: "90%", padding: "10px 0" }}
            onClick={() => handleCropClick(crop)}
          >
            <Card.Img variant="top" src={crop.url} />
            <Card.Body>
              <Card.Title>{crop.crop_name}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
      <YModal
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        cropInfo={cropInfo}
      />
    </div>
  );
}

export default YPredictor;
