import React, { useState, useEffect, createRef } from "react";
import "./Symptoms.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialTable from "material-table";
import { CloseOutlined, Done, SendOutlined, Add } from "@material-ui/icons";
import {
  faPlus,
  faUserMd,
  faProcedures,
  faVials,
  faPills,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  IconButton,
  Chip,
  Avatar,
  TextField,
  CircularProgress,
  Divider,
  Checkbox,
  Modal,
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import * as firebase from "firebase/app";
import { FilePicker } from "react-file-picker";
import { motion } from "framer-motion";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import ImageUploader from "react-images-upload";
export default function Symptoms(props) {
  // const data = useLocation();
  let data = useRouteMatch();

  let historyRoute = useHistory();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [docID, setDocID] = useState(null);
  useEffect(() => {
    if (props.docID !== null) {
      setDocID(props.docID);
      console.log(props.docID);
    }
  }, [props.docID]);
  useEffect(() => {
    // console.log(userData);
    // setUserData(props.userData);
    setWindowDimensions(props.windowDimensions);
  }, [props.windowDimensions]);
  const [openCreate, setOpenCreate] = useState(false);
  const [text, setText] = useState(false);
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoLocal, setVideoLocal] = useState(null);
  const [videoUploadUrl, setVideoUploadUrl] = useState(null);
  const [picture, setPicture] = useState(false);
  const [pictureUploadUrl, setPictureUploadUrl] = useState(null);
  const [audio, setAudio] = useState(false);
  const [audioUploadUrl, setAudioUploadUrl] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioLocal, setAudioLocal] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadData, setImageUploadData] = useState(null);
  const [imageUploadState, setImageUploadState] = useState(false);
  const [loading, setLoading] = useState(false);
  function onDrop(pictureData, pictureUrl) {
    setImageUpload(pictureUrl);
    setImageUploadData(pictureData[0]);
    setImageUploadState(true);
    console.log({ pictureUrl });
    console.log({ pictureData });
  }
  let fileInput = createRef();
  let videoInput = createRef();
  const [history, setHistory] = useState([]);
  const [pending, setPending] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);
  const [unRead, setUnRead] = useState(0);
  const [count, setCount] = useState(0);
  const [docAppointment, setDocAppointment] = useState(false);
  const [therapy, setTherapy] = useState({
    "Primary Care": false,
    "Cardiac & Chest Surgery": false,
    "Cardiology & Cardiovascular Medicine": false,
    "Colorectal Surgery": false,
    Dermatology: false,
    Dental: false,
    "Endocrinology & Diabetic Medicine": false,
    "Geriatric Medicine": false,
    "Haematology & Blood Disorders": false,
    "Infectious Diseases": false,
    "Liver Disease and Gastroenterology": false,
    Nephrology: false,
    Neurology: false,
    "Oncology & Cancer Medicine & Surgery": false,
    "Otolaryngology:false, Head and Neck Surgery (ENT)": false,
    "Plastic Surgery": false,
    "Respiratory and Sleep Disorder": false,
  });
  const [prescription, setPrescription] = useState(false);
  const [testScan, setTestScan] = useState(false);
  const [response, setResponse] = useState(false);
  const [symptomID, setSymptomID] = useState(null);
  const [, setState] = useState({});
  useEffect(() => {
    console.log("Response effect", response);
  }, [response]);
  useEffect(() => {
    if (docID !== null) {
      console.log("ran");
      firebase
        .firestore()
        .collection("symptoms")
        .orderBy("createdAt", "desc")
        .onSnapshot(
          (snapshots) => {
            let initialHistory = [];
            let initialPending = 0;
            let initialDone = 0;
            setCount(snapshots.size);
            if (snapshots.empty) {
              setHistory([]);
            } else {
              snapshots.forEach((snap) => {
                let date = new Date(snap.data().createdAtValue);
                if (snap.data().status === "pending") {
                  initialPending = initialPending + 1;
                }
                if (snap.data().status === "done") {
                  initialDone = initialDone + 1;
                }
                initialHistory.push({
                  ...snap.data(),
                  date: date.toDateString(),
                  id: snap.id,
                });
              });
              console.log(initialHistory);
              setHistory(initialHistory);
              setTotal(snapshots.size);
              setPending(initialPending);
              setDone(initialDone);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [docID]);
  return (
    <div id="main">
      Symptoms & signs
      <div id="summary">
        <div
          style={{
            paddingRight: windowDimensions.width < 600 ? 15 : 70,
            paddingLeft: windowDimensions.width < 600 ? 15 : 70,
            paddingTop: windowDimensions.width < 600 ? 15 : 40,
            paddingBottom: windowDimensions.width < 600 ? 15 : 40,
            backgroundImage: "linear-gradient(#035697, #15B6EF)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            boxShadow: "0px 6px 12px rgba(3, 86, 181, 0.3)",
            borderRadius: "5px",
            marginBottom: windowDimensions.width < 1460 ? 5 : 0,
            marginRight: windowDimensions.width < 1460 ? 10 : 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: 20,
            }}
          >
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 10 : 22,
                color: "#fff",
              }}
            >
              {pending}
            </span>
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 8 : 18,
                color: "#fff",
              }}
            >
              Pending
            </span>
          </div>
          <img
            style={{
              width: windowDimensions.width < 600 ? 20 : 40,
              height: windowDimensions.width < 600 ? 20 : 40,
            }}
            src={require("../../assets/icons8-data_pending.png")}
          />
        </div>
        <div
          style={{
            paddingRight: windowDimensions.width < 600 ? 15 : 70,
            paddingLeft: windowDimensions.width < 600 ? 15 : 70,
            paddingTop: windowDimensions.width < 600 ? 15 : 40,
            paddingBottom: windowDimensions.width < 600 ? 15 : 40,
            backgroundImage: "linear-gradient(#09841C, #84C681)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            boxShadow: "0px 6px 12px rgba(3, 86, 181, 0.3)",
            borderRadius: "5px",
            marginBottom: windowDimensions.width < 1460 ? 5 : 0,
            marginRight: windowDimensions.width < 1460 ? 10 : 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: 20,
            }}
          >
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 10 : 22,
                color: "#fff",
              }}
            >
              {done}
            </span>
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 8 : 18,
                color: "#fff",
              }}
            >
              Done
            </span>
          </div>
          <img
            style={{
              width: windowDimensions.width < 600 ? 20 : 40,
              height: windowDimensions.width < 600 ? 20 : 40,
            }}
            src={require("../../assets/icons8-email_open.png")}
          />
        </div>
        <div
          style={{
            paddingRight: windowDimensions.width < 600 ? 15 : 70,
            paddingLeft: windowDimensions.width < 600 ? 15 : 70,
            paddingTop: windowDimensions.width < 600 ? 15 : 40,
            paddingBottom: windowDimensions.width < 600 ? 15 : 40,
            backgroundImage: "linear-gradient(#035697,#98A4C2)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            boxShadow: "0px 6px 12px rgba(3, 86, 181, 0.3)",
            borderRadius: "5px",
            marginBottom: windowDimensions.width < 1460 ? 5 : 0,
            marginRight: windowDimensions.width < 1460 ? 10 : 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: 20,
            }}
          >
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 10 : 22,
                color: "#fff",
              }}
            >
              {total}
            </span>
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 8 : 18,
                color: "#fff",
              }}
            >
              Total
            </span>
          </div>
          <img
            style={{
              width: windowDimensions.width < 600 ? 20 : 40,
              height: windowDimensions.width < 600 ? 20 : 40,
            }}
            src={require("../../assets/icons8-folder.png")}
          />
        </div>
      </div>
      <div
        style={{
          overflowY: "scroll",
          width: "100%",

          marginTop: 30,
        }}
      >
        <MaterialTable
          title="Symptoms"
          detailPanel={[
            {
              tooltip: "Show Name",
              render: (rowData) => {
                return (
                  <div
                    style={{
                      fontSize: 12,
                      textAlign: "center",

                      // backgroundColor: "#43A047",
                      overflowY: "scroll",
                      // height: "40%",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        marginTop: 20,
                        display: "flex",
                        width: "100%",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <h2>Description</h2>
                          <span>{rowData.text}</span>
                        </div>

                        {rowData.img.url.length > 0 && (
                          <div>
                            <img
                              onClick={() => {}}
                              style={{
                                width:
                                  windowDimensions.width < 860 ? "80%" : "50%",
                                height: 50,
                              }}
                              src={rowData.img.url}
                            />
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {rowData.audio.url.length > 0 && (
                          <audio controls>
                            <source
                              src={rowData.audio.url}
                              type={rowData.audio.type}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                        {rowData.video.url.length > 0 && (
                          <video width="320" height="240" controls>
                            <source
                              src={rowData.video.url}
                              type={rowData.video.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outlined"
                      style={{
                        // borderWidth: 2,
                        width: "90%",
                        backgroundColor: "#00528E",
                        color: "#fff",
                        fontWeight: "bold",
                        boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                      onClick={() => {
                        setResponse(true);
                        setSymptomID(rowData.id);
                        console.log({ response });
                      }}
                    >
                      Reply/Edit
                    </Button>
                  </div>
                );
              },
            },
          ]}
          columns={[
            { title: "#", field: "symptomNumber" },
            { title: "Date", field: "date" },
            {
              title: "Status",
              field: "status",
            },
          ]}
          data={history.map((data, index) => data)}
          options={{
            actionsColumnIndex: -1,
          }}
        />
      </div>
      {response && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            width: windowDimensions.width < 860 ? "100%" : "100%",
            height: "100%",
            zIndex: 9999,
            alignItems: "center",
            overflowY: "scroll",
            paddingBottom: 20,
            left: 0,
            top: 0,
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h2>RESPONSE</h2>
          <IconButton
            style={{
              position: "absolute",
              right: 10,
              top: 10,
            }}
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setResponse(false);
            }}
            edge="start"
          >
            <CloseOutlined />
          </IconButton>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: windowDimensions.width < 860 ? "100%" : "100%",
              marginTop: 15,
            }}
          >
            <TextField
              style={{ width: "90%" }}
              id="filled-multiline-static"
              label="Summary"
              multiline
              rows={10}
              placeholder="Response to be submitted to patient"
              onChange={(value) => {
                setDescription(value.target.value);
              }}
            />
          </div>
          <h3>Recommendations</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h4>Appointment</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <div>
                  <Checkbox
                    checked={docAppointment}
                    onChange={(event) => {
                      setDocAppointment(event.target.checked);
                      console.log(event.target.checked);
                      console.log({ docAppointment });
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />

                  <span>Yes</span>
                </div>
                <div>
                  <Checkbox
                    checked={!docAppointment}
                    onChange={(event) => {
                      setDocAppointment(!event.target.checked);
                      console.log(event.target.checked);
                      console.log({ docAppointment });
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />

                  <span>No</span>
                </div>
              </div>
            </div>
            {docAppointment && <div></div>}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h4>Therapy</h4>

              {therapy && (
                <div
                  style={{
                    overflowY: "scroll",
                    maxHeight: 250,
                    backgroundColor: "rgba(0,0,0,0.15)",
                  }}
                >
                  {[
                    "Primary Care",
                    "Cardiac & Chest Surgery",
                    "Cardiology & Cardiovascular Medicine",
                    "Colorectal Surgery",
                    "Dermatology",
                    "Dental",
                    "Endocrinology & Diabetic Medicine",
                    "Geriatric Medicine",
                    "Haematology & Blood Disorders",
                    "Infectious Diseases",
                    "Liver Disease and Gastroenterology",
                    "Nephrology",
                    "Neurology",
                    "Oncology & Cancer Medicine & Surgery",
                    "Otolaryngology, Head and Neck Surgery (ENT)",
                    "Plastic Surgery",
                    "Respiratory and Sleep Disorder",
                  ].map((item, index) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          key={index}
                          checked={therapy[item]}
                          onChange={(event) => {
                            therapy[item] = !therapy[item];
                            setState({});
                          }}
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4>Prescription</h4>
            </div>
            {prescription && <div></div>}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4>Test & Scan</h4>
            </div>
            {testScan && <div></div>}
          </div>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              style={{
                // borderWidth: 1,
                // borderStyle: "solid",
                marginTop: 20,
                width: "45%",
                // borderColor: "#00528E",
                color: "#00528E",
                fontWeight: "bold",
                backgroundColor: "rgba(0,42,182,0.15)",
                boxShadow: "0px 6px 12px rgba(0,42,182,0)",
              }}
              onClick={() => {
                setResponse(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              style={{
                marginTop: 20,
                width: "45%",
                backgroundColor: "#00528E",
                color: "#fff",
                fontWeight: "bold",
              }}
              onClick={() => {
                if (description.length > 5) {
                  const date = new Date();
                  // const fieldValue = fire
                  setLoading(true);
                  firebase
                    .firestore()
                    .collection("symptoms")
                    .doc(symptomID)
                    .update({
                      response: {
                        appointment: docAppointment,
                        therapy: therapy,
                        prescription: null,
                        testScan: null,
                        timeStamp: date.getTime(),
                        summary: description,
                      },
                      status: "done",
                    })
                    .then(() => {
                      setLoading(false);
                      setResponse(false);
                      setTherapy({
                        "Primary Care": false,
                        "Cardiac & Chest Surgery": false,
                        "Cardiology & Cardiovascular Medicine": false,
                        "Colorectal Surgery": false,
                        Dermatology: false,
                        Dental: false,
                        "Endocrinology & Diabetic Medicine": false,
                        "Geriatric Medicine": false,
                        "Haematology & Blood Disorders": false,
                        "Infectious Diseases": false,
                        "Liver Disease and Gastroenterology": false,
                        Nephrology: false,
                        Neurology: false,
                        "Oncology & Cancer Medicine & Surgery": false,
                        "Otolaryngology:false, Head and Neck Surgery (ENT)": false,
                        "Plastic Surgery": false,
                        "Respiratory and Sleep Disorder": false,
                      });
                    })
                    .catch((error) => {
                      setLoading(false);
                    });
                }
              }}
            >
              Update
              {loading && <CircularProgress color="#fff" size={24} style />}
            </Button>
          </div>
        </div>
      )}
      {openCreate && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            width: windowDimensions.width < 860 ? "100%" : "100%",
            height: "100%",
            zIndex: 9999,
            alignItems: "center",
            overflowY: "scroll",
            paddingBottom: 20,
            left: 0,
            top: 0,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 style={{ display: "flex" }}>Symptoms and Sign</h3>
            <IconButton
              style={{
                justifySelf: "flex-end",
                position: "absolute",
                right: 10,
              }}
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setOpenCreate(false);
                setAudioFile(null);
                setAudioUploadUrl(null);
                setImageUpload(null);
                setImageUploadData(null);
                setPictureUploadUrl(null);
                setVideoUploadUrl(null);
                setVideoFile(false);
                setDescription("");
                setAudioLocal(null);
              }}
              edge="start"
              // className={clsx(classes.menuButton, {
              //   [classes.hide]: open,
              // })}
            >
              <CloseOutlined />
            </IconButton>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              height: "100%",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: windowDimensions.width > 860 ? "50%" : "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Note: Tell us what is wrong with you by;</span>
              <ul>
                <li>
                  Typing what is wrong with you using the input field provided
                  under Text
                </li>
                <li>Uploading a picture of it</li>
                <li>Uploading an audio telling us what is wrong</li>
                <li>Uploading a video that tells and shows us what is wrong</li>
                <li>or you can do all the above</li>
              </ul>
            </div>
            <div
              style={{
                width: windowDimensions.width > 860 ? 2 : "100%",
                height: windowDimensions.width > 860 ? "100%" : 2,
                backgroundColor: "#000",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "column",
                width: windowDimensions.width > 860 ? "45%" : "100%",
                paddingLeft: "5%",
                paddingRight: "5%",
                paddingBottom: 20,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: 15,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Chip
                    avatar={
                      text && (
                        <Avatar>
                          <Done />
                        </Avatar>
                      )
                    }
                    label="Text"
                    clickable
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      console.log("clicked");
                      setText(!text);
                    }}
                  />
                </div>
                <div>
                  <Chip
                    avatar={
                      picture && (
                        <Avatar>
                          <Done />
                        </Avatar>
                      )
                    }
                    label="Picture"
                    clickable
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      // console.log("clicked");
                      setPicture(!picture);
                    }}
                  />
                </div>
                <div>
                  <Chip
                    avatar={
                      audio && (
                        <Avatar>
                          <Done />
                        </Avatar>
                      )
                    }
                    label="Audio"
                    clickable
                    color="primary"
                    onClick={() => {
                      // console.log("clicked");
                      setAudio(!audio);
                    }}
                    variant="outlined"
                  />
                </div>
                <div>
                  <Chip
                    avatar={
                      video && (
                        <Avatar>
                          <Done />
                        </Avatar>
                      )
                    }
                    label="Video"
                    clickable
                    color="primary"
                    onClick={() => {
                      // console.log("clicked");
                      setVideo(!video);
                    }}
                    variant="outlined"
                  />
                </div>
              </div>
              {text && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    width: windowDimensions.width < 860 ? "100%" : "100%",
                    marginTop: 15,
                  }}
                >
                  <TextField
                    style={{ width: "90%" }}
                    id="filled-multiline-static"
                    label="Description"
                    multiline
                    rows={10}
                    placeholder="Tell us what is wrong"
                    onChange={(value) => {
                      setDescription(value.target.value);
                    }}
                  />
                </div>
              )}
              {picture && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: 15,
                  }}
                >
                  {imageUpload !== null && (
                    <img
                      style={{ width: "80%", height: 200 }}
                      src={imageUpload}
                    />
                  )}
                  <ImageUploader
                    fileContainerStyle={{
                      boxShadow: "0px 0px 0px 0 rgba(0, 0, 0, 0.00)",
                    }}
                    withIcon={false}
                    buttonText="Choose images"
                    onChange={onDrop}
                    imgExtension={[".jpg", ".png"]}
                    maxFileSize={1112880}
                    withLabel={false}
                    singleImage
                    buttonStyles={{
                      borderWidth: 2,
                      borderColor: "#00528E",
                      color: "#00528E",
                      fontWeight: "bold",
                      boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                      width: windowDimensions.width > 1024 ? "45%" : "70%",
                      borderStyle: "dashed",
                      marginTop: windowDimensions.width > 1024 ? 20 : 10,
                      backgroundColor: "#fff",
                      borderRadius: 5,
                    }}
                  />
                </div>
              )}
              {audio && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: 15,
                  }}
                >
                  {audioLocal !== null && (
                    <audio controls>
                      <source
                        src={audioLocal !== null ? audioLocal : ""}
                        type={audioFile !== null ? audioFile.type : "audio/*"}
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <label for="audio" class="audio">
                    Upload an audio
                  </label>
                  <input
                    id="audio"
                    className="audio"
                    style={{
                      borderWidth: 2,
                      borderColor: "#00528E",
                      color: "#00528E",
                      fontWeight: "bold",
                      boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                      width: windowDimensions.width > 1024 ? "45%" : "70%",
                      borderStyle: "dashed",
                      marginTop: windowDimensions.width > 1024 ? 20 : 10,
                      backgroundColor: "#fff",
                      borderRadius: 5,
                      paddingTop: 10,
                      paddingBottom: 10,
                      outline: "none",
                    }}
                    ref={fileInput}
                    type="file"
                    onChange={(event) => {
                      // console.log(value.value);
                      // console.log({ file });
                      event.preventDefault();
                      // console.log(
                      //   `Selected file - ${fileInput.current.files[0].name}`
                      // );
                      setAudioFile(fileInput.current.files[0]);
                      const objectURL = window.URL.createObjectURL(
                        fileInput.current.files[0]
                      );
                      console.log(objectURL);
                      setAudioLocal(objectURL);
                    }}
                    accept="audio/*,"
                  />
                </div>
              )}
              {video && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: 15,
                  }}
                >
                  {videoLocal !== null && (
                    <video width="320" height="240" controls>
                      <source
                        src={videoLocal !== null ? videoLocal : ""}
                        type={videoFile !== null ? videoFile.type : "video/*"}
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <label for="video" class="video">
                    Upload a video
                  </label>
                  <input
                    id="video"
                    className="video"
                    ref={videoInput}
                    type="file"
                    style={{
                      borderWidth: 2,
                      borderColor: "#00528E",
                      color: "#00528E",
                      fontWeight: "bold",
                      boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                      width: windowDimensions.width > 1024 ? "45%" : "70%",
                      borderStyle: "dashed",
                      marginTop: windowDimensions.width > 1024 ? 20 : 10,
                      backgroundColor: "#fff",
                      borderRadius: 5,
                      paddingTop: 10,
                      paddingBottom: 10,
                      outline: "none",
                    }}
                    placeholder="Choose a Video File"
                    onChange={(event) => {
                      // console.log(value.value);
                      // console.log({ file });
                      event.preventDefault();
                      // console.log(
                      //   `Selected file - ${videoInput.current.files[0].name}`
                      // );
                      setVideoFile(videoInput.current.files[0]);
                      const objectURL = window.URL.createObjectURL(
                        videoInput.current.files[0]
                      );
                      // console.log(objectURL);
                      setVideoLocal(objectURL);
                    }}
                    accept="video/*,"
                  />
                </div>
              )}

              {(text || picture || audio || video) && (
                <div
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-around",
                    display: "flex",
                    marginTop: 15,
                  }}
                >
                  <Button
                    onClick={() => {
                      if (!loading) {
                        setOpenCreate(false);
                        setAudioFile(null);
                        setAudioUploadUrl(null);
                        setImageUpload(null);
                        setImageUploadData(null);
                        setPictureUploadUrl(null);
                        setVideoUploadUrl(null);
                        setVideoFile(false);
                        setDescription("");
                        setAudioLocal(null);
                      }
                    }}
                    variant="outlined"
                    style={{
                      backgroundColor: "rgba(0,42,182,0.15",
                      fontWeight: "bold",
                      // boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                      width: windowDimensions.width > 1024 ? "35%" : "35%",
                      color: "#00528E",
                      borderWidth: 0,
                    }}
                  >
                    <span style={{ marginRight: 10 }}>Cancel</span>

                    <CloseOutlined />
                  </Button>
                  <Button
                    onClick={() => {
                      setLoading(true);
                      // if (text||picture||audio||video) {
                      if (videoFile !== null) {
                        const fieldValue = firebase.firestore.FieldValue;
                        const storageRef = firebase.storage().ref();
                        const symptomRef = firebase
                          .firestore()
                          .collection("users")
                          .doc(docID)
                          .collection("symptoms")
                          .doc();
                        const picRef = storageRef.child(
                          `users/${docID}/symptoms/${symptomRef.id}/video`
                        );
                        var metadata = {
                          contentType: videoFile.type,
                        };
                        let upload = picRef.put(videoFile, metadata);
                        upload.on(
                          "state_changed",
                          function (snapshot) {
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress =
                              (snapshot.bytesTransferred /
                                snapshot.totalBytes) *
                              100;
                            console.log("Upload is " + progress + "% done");
                            switch (snapshot.state) {
                              case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                break;
                              case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log("Upload is running");
                                break;
                            }
                          },
                          function (error) {
                            // Handle unsuccessful uploads

                            console.log(error);
                          },
                          function () {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            upload.snapshot.ref
                              .getDownloadURL()
                              .then(function (downloadURL) {
                                console.log("File available at", downloadURL);
                                setVideoUploadUrl(downloadURL);
                                // symptomRef
                                //   .set({
                                //     video: downloadURL,
                                //   })
                                //   .then(() => {
                                //     // setSnack(true);
                                //     console.log("success");
                                //   })
                                //   .catch((error) => {
                                //     console.log(error);
                                //   });
                              });
                          }
                        );
                      } else {
                        setVideoUploadUrl("");
                      }
                      if (audioFile !== null) {
                        const fieldValue = firebase.firestore.FieldValue;
                        const storageRef = firebase.storage().ref();
                        const symptomRef = firebase
                          .firestore()
                          .collection("users")
                          .doc(docID)
                          .collection("symptoms")
                          .doc();
                        const picRef = storageRef.child(
                          `users/${docID}/symptoms/${symptomRef.id}/audio`
                        );
                        var metadata = {
                          contentType: audioFile.type,
                        };
                        let upload = picRef.put(audioFile, metadata);
                        upload.on(
                          "state_changed",
                          function (snapshot) {
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress =
                              (snapshot.bytesTransferred /
                                snapshot.totalBytes) *
                              100;
                            console.log("Upload is " + progress + "% done");
                            switch (snapshot.state) {
                              case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                break;
                              case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log("Upload is running");
                                break;
                            }
                          },
                          function (error) {
                            // Handle unsuccessful uploads

                            console.log(error);
                          },
                          function () {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            upload.snapshot.ref
                              .getDownloadURL()
                              .then(function (downloadURL) {
                                console.log("File available at", downloadURL);
                                setAudioUploadUrl(downloadURL);
                                // symptomRef
                                //   .set({
                                //     video: downloadURL,
                                //   })
                                //   .then(() => {
                                //     // setSnack(true);
                                //     console.log("success");
                                //   })
                                //   .catch((error) => {
                                //     console.log(error);
                                //   });
                              });
                          }
                        );
                      } else {
                        setAudioUploadUrl("");
                      }
                      if (imageUploadData !== null) {
                        const fieldValue = firebase.firestore.FieldValue;
                        const storageRef = firebase.storage().ref();
                        const symptomRef = firebase
                          .firestore()
                          .collection("users")
                          .doc(docID)
                          .collection("symptoms")
                          .doc();
                        const picRef = storageRef.child(
                          `users/${docID}/symptoms/${symptomRef.id}/picture`
                        );
                        var metadata = {
                          contentType: imageUploadData.type,
                        };
                        let upload = picRef.put(imageUploadData, metadata);
                        upload.on(
                          "state_changed",
                          function (snapshot) {
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress =
                              (snapshot.bytesTransferred /
                                snapshot.totalBytes) *
                              100;
                            console.log("Upload is " + progress + "% done");
                            switch (snapshot.state) {
                              case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                break;
                              case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log("Upload is running");
                                break;
                            }
                          },
                          function (error) {
                            // Handle unsuccessful uploads

                            console.log(error);
                          },
                          function () {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            upload.snapshot.ref
                              .getDownloadURL()
                              .then(function (downloadURL) {
                                console.log("File available at", downloadURL);
                                setPictureUploadUrl(downloadURL);
                                // symptomRef
                                //   .set({
                                //     video: downloadURL,
                                //   })
                                //   .then(() => {
                                //     // setSnack(true);
                                //     console.log("success");
                                //   })
                                //   .catch((error) => {
                                //     console.log(error);
                                //   });
                              });
                          }
                        );
                      } else {
                        setPictureUploadUrl("");
                      }
                      // }
                    }}
                    disabled={loading}
                    variant="outlined"
                    style={{
                      borderWidth: 2,
                      borderColor: "#00528E",
                      color: "#00528E",
                      fontWeight: "bold",
                      boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                      width: windowDimensions.width > 1024 ? "40%" : "40%",
                      //   borderStyle: "dashed",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <span style={{ marginRight: 10 }}>Submit</span>

                      <SendOutlined />
                      {loading && (
                        <CircularProgress color="primary" size={24} />
                      )}
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
