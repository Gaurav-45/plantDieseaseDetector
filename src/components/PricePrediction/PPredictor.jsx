import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { price_data } from "../../temp-db/price-predictor-output";
import MarketCard from "./MarketCard";
import axios from "axios";

function PPredictor() {
  const [apiData, setApiData] = useState(price_data);
  const handleChange = async (e) => {
    try {
      const commodity = e.target.value;
      let res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getCropPrice`,
        {
          state: "Maharashtra",
          commodity: commodity,
        }
      );
      res = res.data;
      console.log(res);
      setApiData(res);
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div>
      <h5>Commodity</h5>
      <select onChange={handleChange}>
        <option default value="" hidden></option>
        <option value="potato">Potato</option>
        <option value="rice">Rice</option>
        <option value="onion">Onion</option>
      </select>
      <h6>Here are some market prices in your area</h6>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {apiData?.result?.map((item, key) => (
          <MarketCard key={key} data={item} />
        ))}
      </div>
    </div>
  );
}

export default PPredictor;
