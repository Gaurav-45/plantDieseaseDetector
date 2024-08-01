import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { price_data } from "../../temp-db/price-predictor-output";
import MarketCard from "./MarketCard";
import axios from "axios";
import "./PPredictor.css";

function PPredictor() {
  const [apiData, setApiData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [commodity, setCommodity] = useState("");
  const handleChange = async (e) => {
    setLoader(true);
    setCommodity(e.target.value);
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
      setLoader(false);
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div className="price_preditor_container">
      <h5>Commodity</h5>
      <select onChange={handleChange}>
        <option default value="" hidden>
          Select Commodity
        </option>
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
        {loader && commodity.length > 0 ? (
          <div>
            <img src="/load.gif" />
          </div>
        ) : (
          apiData?.result?.map((item, key) => (
            <MarketCard key={key} data={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default PPredictor;
