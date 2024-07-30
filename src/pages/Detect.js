import React, { Component, Fragment } from "react";
import {
  Alert,
  Button,
  Collapse,
  Container,
  Form,
  Spinner,
  ListGroup,
  Tabs,
  Tab,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FaCamera, FaChevronDown, FaChevronRight } from "react-icons/fa";
import Cropper from "react-cropper";
import * as tf from "@tensorflow/tfjs";
import LoadButton from "../components/LoadButton";
import { MODEL_CLASSES } from "../model/classes";
import { openDB } from "idb";
import config from "../config";
import "./Detect.css";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import "../../src/components/Detect/DetectModal.css";

const MODEL_PATH = "/model/model.json";
const IMAGE_SIZE = 224;
const CANVAS_SIZE = 224;
const TOPK_PREDICTIONS = 1;

const INDEXEDDB_DB = "tensorflowjs";
const INDEXEDDB_STORE = "tree_model_info_store";
const INDEXEDDB_KEY = "tree_web-model";
export default class Classify extends Component {
  constructor(props) {
    super(props);

    this.webcam = null;
    this.model = null;
    this.modelLastUpdated = null;

    this.state = {
      modelLoaded: false,
      filename: "",
      isModelLoading: false,
      isClassifying: false,
      predictions: [],
      photoSettingsOpen: true,
      modelUpdateAvailable: false,
      showModelUpdateAlert: false,
      showModelUpdateSuccess: false,
      isDownloadingModel: false,
      diseaseMoreInfo: {},
      showModal: false,
    };
  }

  async componentDidMount() {
    if ("indexedDB" in window) {
      try {
        this.model = await tf.loadLayersModel("indexeddb://" + INDEXEDDB_KEY);

        try {
          const db = await openDB(INDEXEDDB_DB, 1);
          const item = await db
            .transaction(INDEXEDDB_STORE)
            .objectStore(INDEXEDDB_STORE)
            .get(INDEXEDDB_KEY);
          const dateSaved = new Date(item.modelArtifactsInfo.dateSaved);
          await this.getModelInfo();
          console.log(this.modelLastUpdated);
          if (
            !this.modelLastUpdated ||
            dateSaved >= new Date(this.modelLastUpdated).getTime()
          ) {
            console.log("Using saved model");
          } else {
            this.setState({
              modelUpdateAvailable: true,
              showModelUpdateAlert: true,
            });
          }
        } catch (error) {
          console.warn(error);
          console.warn("Could not retrieve when model was saved.");
        }
      } catch (error) {
        console.log("Not found in IndexedDB. Loading and saving...");
        console.log(error);
        this.model = await tf.loadLayersModel(MODEL_PATH);
        await this.model.save("indexeddb://" + INDEXEDDB_KEY);
      }
    } else {
      console.warn("IndexedDB not supported.");
      this.model = await tf.loadLayersModel(MODEL_PATH);
    }

    this.setState({ modelLoaded: true });
    this.initWebcam();

    let prediction = tf.tidy(() =>
      this.model.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3]))
    );
    prediction.dispose();
  }

  async componentWillUnmount() {
    if (this.webcam) {
      this.webcam.stop();
    }

    //dispose model.
    try {
      this.model.dispose();
    } catch (e) {
      //console.log(e);
    }
  }

  initWebcam = async () => {
    try {
      this.webcam = await tf.data.webcam(this.refs.webcam, {
        resizeWidth: CANVAS_SIZE,
        resizeHeight: CANVAS_SIZE,
        facingMode: "environment",
      });
    } catch (e) {
      this.refs.noWebcam.style.display = "block";
    }
  };

  startWebcam = async () => {
    if (this.webcam) {
      this.webcam.start();
    }
  };

  stopWebcam = async () => {
    if (this.webcam) {
      this.webcam.stop();
    }
  };

  getModelInfo = async () => {
    await fetch(`${config.API_ENDPOINT}/model_info`, {
      method: "GET",
    })
      .then(async (response) => {
        await response
          .json()
          .then((data) => {
            this.modelLastUpdated = data.last_updated;
          })
          .catch((err) => {
            console.log("Unable to get parse model info.");
          });
      })
      .catch((err) => {
        console.log("Unable to get model info");
      });
  };

  updateModel = async () => {
    console.log("Updating the model: " + INDEXEDDB_KEY);
    this.setState({ isDownloadingModel: true });
    this.model = await tf.loadLayersModel(MODEL_PATH);
    await this.model.save("indexeddb://" + INDEXEDDB_KEY);
    this.setState({
      isDownloadingModel: false,
      modelUpdateAvailable: false,
      showModelUpdateAlert: false,
      showModelUpdateSuccess: true,
    });
  };

  handleGetMoreInfo = async () => {
    console.log(this.state.predictions[0].className);
    let res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/getCropDiseaseInformation`,
      {
        disease: this.state.predictions[0].className,
      }
    );

    this.setState(
      {
        diseaseMoreInfo: {
          diseaseName: res.data.metaData.disease,
          causes: res.data.result.causes,
          information: res.data.result.information,
          treatment: res.data.result.treatment,
          medicines: res.data.result.medicine,
        },
        showModal: true,
      },
      () => {
        console.log("yeyyy!");
        console.log(this.state.diseaseMoreInfo);
      }
    );
  };

  handleShow = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  classifyLocalImage = async () => {
    this.setState({ isClassifying: true });

    const croppedCanvas = this.refs.cropper.getCroppedCanvas();
    const image = tf.tidy(() => tf.browser.fromPixels(croppedCanvas).toFloat());

    // Process and resize image
    const imageData = await this.processImage(image);
    const resizedImage = tf.image.resizeBilinear(imageData, [
      IMAGE_SIZE,
      IMAGE_SIZE,
    ]);

    const logits = this.model.predict(resizedImage);
    const probabilities = await logits.data();
    const preds = await this.getTopKClasses(probabilities, TOPK_PREDICTIONS);

    this.setState({
      predictions: preds,
      isClassifying: false,
      photoSettingsOpen: !this.state.photoSettingsOpen,
    });

    const context = this.refs.canvas.getContext("2d");
    const ratioX = CANVAS_SIZE / croppedCanvas.width;
    const ratioY = CANVAS_SIZE / croppedCanvas.height;
    const ratio = Math.min(ratioX, ratioY);
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.drawImage(
      croppedCanvas,
      0,
      0,
      croppedCanvas.width * ratio,
      croppedCanvas.height * ratio
    );

    // Dispose of tensors .
    image.dispose();
    imageData.dispose();
    resizedImage.dispose();
    logits.dispose();
  };

  classifyWebcamImage = async () => {
    this.setState({ isClassifying: true });

    const imageCapture = await this.webcam.capture();

    const resized = tf.image.resizeBilinear(imageCapture, [
      IMAGE_SIZE,
      IMAGE_SIZE,
    ]);
    const imageData = await this.processImage(resized);
    const logits = this.model.predict(imageData);
    const probabilities = await logits.data();
    const preds = await this.getTopKClasses(probabilities, TOPK_PREDICTIONS);

    this.setState({
      predictions: preds,
      isClassifying: false,
      photoSettingsOpen: !this.state.photoSettingsOpen,
    });

    // Draw thumbnail to UI.
    const tensorData = tf.tidy(() => imageCapture.toFloat().div(255));
    await tf.browser.toPixels(tensorData, this.refs.canvas);

    // Dispose of tensors we are finished with.
    resized.dispose();
    imageCapture.dispose();
    imageData.dispose();
    logits.dispose();
    tensorData.dispose();
  };

  processImage = async (image) => {
    return tf.tidy(() => image.expandDims(0).toFloat().div(255));
  };

  getTopKClasses = async (values, topK) => {
    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++) {
      valuesAndIndices.push({ value: values[i], index: i });
    }
    valuesAndIndices.sort((a, b) => {
      return b.value - a.value;
    });
    //console.log(valuesAndIndices);
    const topkValues = new Float32Array(topK);
    const topkIndices = new Int32Array(topK);
    for (let i = 0; i < topK; i++) {
      topkValues[i] = valuesAndIndices[i].value;
      topkIndices[i] = valuesAndIndices[i].index;
    }

    const topClassesAndProbs = [];
    for (let i = 0; i < topkIndices.length; i++) {
      topClassesAndProbs.push({
        className: MODEL_CLASSES[topkIndices[i]],
        probability: (topkValues[i] * 100).toFixed(2),
      });
      // console.log(topkIndices[i]);
      // console.log(MODEL_CLASSES[topkIndices[i]]);
      // console.log((topkValues[i] * 100).toFixed(2));
    }
    return topClassesAndProbs;
  };

  handlePanelClick = (event) => {
    this.setState({ photoSettingsOpen: !this.state.photoSettingsOpen });
  };

  handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        filename: event.target.files[0].name,
      });
    }
  };

  handleTabSelect = (activeKey) => {
    switch (activeKey) {
      case "camera":
        this.startWebcam();
        break;
      case "localfile":
        this.setState({ filename: null, file: null });
        this.stopWebcam();
        break;
      default:
    }
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.showModal}
          onHide={this.handleClose}
          dialogClassName="custom-modal"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Disease Diagnosis
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="label">Disease Name</p>
            <p>{this.state.diseaseMoreInfo.diseaseName}</p>
            <p className="label">Disease Cause</p>
            <p>{this.state.diseaseMoreInfo.causes}</p>
            <p className="label">Disease Information</p>
            <p>{this.state.diseaseMoreInfo.information}</p>
            <p className="label">Disease Treatment</p>
            <p>{this.state.diseaseMoreInfo.treatment}</p>
            <p className="label">Medicines</p>
            {this.state.diseaseMoreInfo?.medicines?.map((medicine, key) => (
              <div key={key}>
                <b>{medicine.name}</b>
                <p>{medicine.information}</p>
                <p className="medicine-dose">
                  <span>
                    <b>Dose: </b>
                  </span>
                  {medicine.dose}
                </p>
              </div>
            ))}
          </Modal.Body>
        </Modal>
        <div className="Classify container">
          {!this.state.modelLoaded && (
            <Fragment>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>{" "}
              <span className="loading-model-text">Downloading Model</span>
            </Fragment>
          )}

          {this.state.modelLoaded && (
            <Fragment>
              <Button
                onClick={this.handlePanelClick}
                className="classify-panel-header"
                aria-controls="photo-selection-pane"
                aria-expanded={this.state.photoSettingsOpen}
              >
                Take or Select a Photo to Detect
                <span className="panel-arrow">
                  {this.state.photoSettingsOpen ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              </Button>
              <Collapse in={this.state.photoSettingsOpen}>
                <div id="photo-selection-pane">
                  {this.state.modelUpdateAvailable &&
                    this.state.showModelUpdateAlert && (
                      <Container>
                        <Alert
                          variant="info"
                          show={
                            this.state.modelUpdateAvailable &&
                            this.state.showModelUpdateAlert
                          }
                          onClose={() =>
                            this.setState({ showModelUpdateAlert: false })
                          }
                          dismissible
                        >
                          An update for the{" "}
                          <strong>{this.state.modelType}</strong> model is
                          available.
                          <div className="d-flex justify-content-center pt-1">
                            {!this.state.isDownloadingModel && (
                              <Button
                                onClick={this.updateModel}
                                variant="outline-info"
                              >
                                Update
                              </Button>
                            )}
                            {this.state.isDownloadingModel && (
                              <div>
                                <Spinner
                                  animation="border"
                                  role="status"
                                  size="sm"
                                >
                                  <span className="sr-only">
                                    Downloading...
                                  </span>
                                </Spinner>{" "}
                                <strong>Downloading...</strong>
                              </div>
                            )}
                          </div>
                        </Alert>
                      </Container>
                    )}
                  {this.state.showModelUpdateSuccess && (
                    <Container>
                      <Alert
                        variant="success"
                        onClose={() =>
                          this.setState({ showModelUpdateSuccess: false })
                        }
                        dismissible
                      >
                        The <strong>{this.state.modelType}</strong> model has
                        been updated!
                      </Alert>
                    </Container>
                  )}
                  <Tabs
                    defaultActiveKey="camera"
                    id="input-options"
                    onSelect={this.handleTabSelect}
                    className="justify-content-center"
                  >
                    <Tab eventKey="camera" title="Take Photo" className="tabs">
                      <div id="no-webcam" ref="noWebcam">
                        <span className="camera-icon">
                          <FaCamera />
                        </span>
                        No camera found. <br />
                        Please use a device with a camera, or upload an image
                        instead.
                      </div>
                      <div className="webcam-box-outer">
                        <div className="webcam-box-inner">
                          <video
                            ref="webcam"
                            autoPlay
                            playsInline
                            muted
                            id="webcam"
                          ></video>
                        </div>
                      </div>
                      <div className="button-container">
                        <LoadButton
                          variant="primary"
                          size="lg"
                          onClick={this.classifyWebcamImage}
                          isLoading={this.state.isClassifying}
                          text="Detect"
                          loadingText="Detecting the Disease.."
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="localfile" title="Select Local File">
                      <Form.Group controlId="file">
                        <Form.Label>Select Image File</Form.Label>
                        <br />
                        <Form.Label className="imagelabel">
                          {this.state.filename
                            ? this.state.filename
                            : "Browse..."}
                        </Form.Label>
                        <Form.Control
                          onChange={this.handleFileChange}
                          type="file"
                          accept="image/*"
                          className="imagefile"
                        />
                      </Form.Group>
                      {this.state.file && (
                        <Fragment>
                          <div id="local-image">
                            <Cropper
                              ref="cropper"
                              src={this.state.file}
                              style={{ height: 400, width: "100%" }}
                              guides={true}
                              aspectRatio={1 / 1}
                              viewMode={2}
                            />
                          </div>
                          <div className="button-container">
                            <LoadButton
                              variant="primary"
                              size="lg"
                              disabled={!this.state.filename}
                              onClick={this.classifyLocalImage}
                              isLoading={this.state.isClassifying}
                              text="Detect"
                              loadingText="Detecting the Disease.."
                            />
                          </div>
                        </Fragment>
                      )}
                    </Tab>
                  </Tabs>
                </div>
              </Collapse>
              {this.state.predictions.length > 0 && (
                <div className="classification-results">
                  <h3>Predictions</h3>
                  <canvas
                    ref="canvas"
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                  />
                  <br />
                  <ListGroup>
                    {this.state.predictions.map((category) => {
                      return (
                        <ListGroup.Item key={category.className}>
                          <strong>{category.className}</strong>{" "}
                          {category.probability}%
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                  <Button
                    onClick={this.handleGetMoreInfo}
                    className="classify-panel-header"
                  >
                    Get Disease Diagnosis
                  </Button>
                </div>
              )}
            </Fragment>
          )}
        </div>
      </>
    );
  }
}
