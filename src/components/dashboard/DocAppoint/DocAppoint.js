import React, { useState, useEffect, createRef } from "react";

import DateFnsUtils from "@date-io/date-fns";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "./DocAppoint.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialTable from "material-table";
import { CloseOutlined, Done, SendOutlined, Add } from "@material-ui/icons";
import { faPlus, faComment } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  IconButton,
  Chip,
  Avatar,
  TextField,
  CircularProgress,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  InputBase,
  Paper,
  Checkbox,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import * as firebase from "firebase/app";
import { FilePicker } from "react-file-picker";
import { motion } from "framer-motion";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import ImageUploader from "react-images-upload";
import { makeStyles } from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "45%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function Appointment(props) {
  const classes = useStyles();
  const [medium, setMedium] = React.useState("");
  let data = useLocation();
  const handleChange = (event) => {
    setMedium(event.target.value);
    setMediumError(false);
  };
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [docID, setDocID] = useState(null);
  useEffect(() => {
    const createAppointment = data.state.createAppointment;
    if (props.docID !== null) {
      setDocID(props.docID);
      console.log(props.docID);
    }
    if (createAppointment) {
      setOpenCreate(true);
    } else {
      setOpenCreate(false);
    }
  }, [props.docID]);
  useEffect(() => {
    // console.log(userData);
    // setUserData(props.userData);
    setWindowDimensions(props.windowDimensions);
  }, [props.windowDimensions]);
  const [openCreate, setOpenCreate] = useState(true);
  const [mediumError, setMediumError] = useState(false);
  const [loading, setLoading] = useState(false);

  let fileInput = createRef();
  let videoInput = createRef();
  const [history, setHistory] = useState([]);
  const [pending, setPending] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);
  const [unRead, setUnRead] = useState(0);
  const [count, setCount] = useState(0);
  const [chat, setChat] = useState(false);
  const [appointmentID, setAppointmentID] = useState(null);
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState(null);
  const [response, setResponse] = useState(false);
  const [link, setLink] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patientMedium, setPatientMedium] = useState(null);
  const [selectedDocID, setSelectedDocID] = useState(null);
  const [snackBar, setSnackBar] = useState({
    state: false,
    severity: "",
    message: "",
  });
  useEffect(() => {
    console.log({ data });
    if (docID !== null) {
      console.log("ran");
      firebase
        .firestore()
        .collection("appointments")
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
              console.log("change occured");
              snapshots.forEach((snap) => {
                let date = new Date(snap.data().createdAtValue);
                let chats = [];
                if (snap.data().status === "pending") {
                  initialPending = initialPending + 1;
                }
                console.log(snap.id);
                console.log({ appointmentID });
                if (snap.id === appointmentID) {
                  console.log("found");
                  setChatData(snap.data().chatData);
                } else {
                  console.log("not found");
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
      firebase
        .firestore()
        .collection("doctors")
        .where("authorised", "==", true)
        .onSnapshot(
          (snapshots) => {
            let doctors = [];
            if (snapshots.empty) {
            } else {
              snapshots.forEach((snap) => {
                doctors.push({
                  id: snap.id,
                  data: snap.data(),
                });
              });
              setDoctors(doctors);
            }
          },
          (error) => {}
        );
    }
  }, [docID]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  useEffect(() => {
    if (appointmentID !== null) {
      firebase
        .firestore()
        .collection("users")
        .doc(docID)
        .collection("appointments")
        .doc(appointmentID)
        .onSnapshot(
          (snapshot) => {
            if (!snapshot.exists) {
              setChatData([]);
            } else {
              console.log("change occured");
              if (snapshot.id === appointmentID) {
                console.log("found");
                setChatData(snapshot.data().chatData);
                console.log(snapshot.id);
              } else {
                console.log("not found");
              }
              // snapshots.forEach((snap) => {
              //   let date = new Date(snap.data().createdAtValue);
              //   let chats = [];

              //   console.log(snap.id);
              //   console.log({ appointmentID });

              // });
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, [appointmentID]);
  return (
    <div id="main" style={{ justifyContent: "flex-start" }}>
      Doctor Appointment
      <div
        style={{
          width: "100%",
          // height: "20%",
          alignSelf: "flex-start",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          flexWrap: "wrap",
          marginTop: 50,
        }}
      >
        {/* <Button
          className="create-card"
          style={{
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            paddingRight: windowDimensions.width < 600 ? 15 : 70,
            paddingLeft: windowDimensions.width < 600 ? 15 : 70,
            paddingTop: windowDimensions.width < 600 ? 15 : 40,
            paddingBottom: windowDimensions.width < 600 ? 15 : 40,
            boxShadow: "0px 6px 12px rgba(3,86,181,0.3)",
            borderColor: "#035697",
            borderWidth: 1,
            borderStyle: "dashed",
            borderRadius: 5,
            marginBottom: windowDimensions.width < 1460 ? 10 : 0,
          }}
          onClick={() => {
            setOpenCreate(true);
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              color="#035697"
              style={{ fontSize: windowDimensions.width < 600 ? 10 : 20 }}
              icon={faPlus}
            />
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 8 : 20,
                color: "#15B6EF",
              }}
            >
              Book now
            </span>
          </div>
        </Button> */}

        {/* <div
          style={{
            paddingRight: windowDimensions.width < 600 ? 5 : 70,
            paddingLeft: windowDimensions.width < 600 ? 5 : 70,
            paddingTop: windowDimensions.width < 600 ? 5 : 40,
            paddingBottom: windowDimensions.width < 600 ? 5 : 40,
            backgroundImage: "linear-gradient(#c91e1e, #c16565)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            boxShadow: "0px 6px 12px rgba(3, 86, 181, 0.3)",
            borderRadius: "5px",
            marginBottom: windowDimensions.width < 1460 ? 5 : 0,
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
              {12}
            </span>
            <span
              style={{
                fontSize: windowDimensions.width < 600 ? 8 : 18,
                color: "#fff",
              }}
            >
              Un-Read
            </span>
          </div>
          <img
            style={{
              width: windowDimensions.width < 600 ? 20 : 40,
              height: windowDimensions.width < 600 ? 20 : 40,
            }}
            src={require("../../assets/icons8-unread_messages.png")}
          />
        </div> */}
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
      <div style={{ overflowY: "scroll", width: "100%", marginTop: 20 }}>
        <MaterialTable
          title="Appointments"
          detailPanel={[
            {
              tooltip: "Show Name",
              render: (rowData) => {
                return (
                  <div
                    style={{
                      fontSize: 12,
                      textAlign: "center",

                      overflowY: "scroll",
                      height: "40%",
                    }}
                  >
                    <div>
                      <div>
                        <h3>Medium</h3>
                        <span>{rowData.medium}</span>
                      </div>
                      {/* <div
                        onClick={() => {
                          setChat(true);
                          setAppointmentID(rowData.id);
                          console.log("rowData", rowData.id);
                          setChatData(rowData.chatData);
                        }}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <IconButton
                          aria-label="show 4 new mails"
                          color="inherit"
                          onClick={() => {
                            setChat(true);
                            setAppointmentID(rowData.id);
                            console.log(rowData.id);
                            setChatData(rowData.chatData);
                          }}
                        >
                          <FontAwesomeIcon
                            color="#035697"
                            style={{
                              fontSize: windowDimensions.width < 600 ? 30 : 60,
                            }}
                            icon={faComment}
                          />
                        </IconButton>
                        <span>Chat</span>
                      </div> */}
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
                          setPatientMedium(rowData.medium);
                          setSelectedDocID(rowData.id);
                        }}
                      >
                        Reply/Edit
                      </Button>
                    </div>
                  </div>
                );
              },
            },
          ]}
          columns={[
            { title: "#", field: "appointmentNumber" },
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
      {openCreate && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            width: windowDimensions.width < 860 ? "100%" : "100%",
            height: "100%",
            zIndex: 1200,
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
            <h3 style={{ display: "flex" }}>Doctor Appointment</h3>
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
              <span> Schedule an Appointment</span>
              <ul>
                <li>Choose a day</li>
                <li>Choose a medium</li>
                <li>
                  And we will schedule an appointment for you with our doctors
                </li>
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
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date for Appointment"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <FormControl
                style={{
                  width: windowDimensions.width > 860 ? "45%" : "80%",

                  marginTop: 20,
                }}
                error={mediumError}
              >
                <InputLabel id="demo-simple-select-label">Medium</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={medium}
                  onChange={handleChange}
                >
                  {["Chat", "Skype Call", "WhatsApp Call", "Zoom Call"].map(
                    (item, index) => {
                      return (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
                {mediumError && <FormHelperText>Pick a medium</FormHelperText>}
              </FormControl>
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
                    setOpenCreate(false);
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
                    const fieldValue = firebase.firestore.FieldValue;
                    const date = new Date();

                    if (medium.length > 0) {
                      setLoading(true);
                      setMediumError(false);
                      firebase
                        .firestore()
                        .collection("users")
                        .doc(docID)
                        .collection("appointments")
                        .doc()
                        .set({
                          medium: medium,
                          createdAt: fieldValue.serverTimestamp(),
                          date: selectedDate,
                          status: "pending",
                          createdAtValue: date.getTime(),
                          appointmentNumber: count + 1,
                        })
                        .then(() => {
                          setLoading(false);
                          setMedium("");
                          setSelectedDate(new Date());
                          setOpenCreate(false);
                        })
                        .catch((error) => {
                          setLoading(false);
                        });
                    } else {
                      setMediumError(true);
                    }
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
                    {loading && <CircularProgress color="primary" size={24} />}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {response && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            width: windowDimensions.width < 860 ? "100%" : "100%",
            height: "100%",
            zIndex: 1200,
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
            {patientMedium !== "Chat" && (
              <TextField
                style={{ width: "90%" }}
                id="filled-multiline-static"
                label="Link"
                rows={1}
                placeholder="Link for call"
                onChange={(value) => {
                  setLink(value.target.value);
                }}
                value={link}
              />
            )}
            <FormControl
              style={{
                width: windowDimensions.width > 860 ? "45%" : "80%",

                marginTop: 20,
              }}
              error={mediumError}
            >
              <InputLabel id="demo-simple-select-label">
                Available Doctors
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={medium}
                onChange={handleChange}
              >
                {doctors.map((item, index) => {
                  return (
                    <MenuItem value={item.id} key={index}>
                      {item.data.firstName + " " + item.data.lastName}
                    </MenuItem>
                  );
                })}
              </Select>
              {mediumError && <FormHelperText>Pick a medium</FormHelperText>}
            </FormControl>
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
              disabled={loading}
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
              disabled={loading}
              onClick={() => {
                let doctorRef = firebase
                  .firestore()
                  .collection("doctors")
                  .doc(medium);
                if (
                  medium !== null
                  //  &&
                  // ((patientMedium !== "Chat" && link.length > 5) ||
                  //   patientMedium === "Chat")
                ) {
                  setLoading(true);
                  firebase
                    .firestore()
                    .collection("appointments")
                    .doc(selectedDocID)
                    .update({
                      status: "updated",
                      doctor: doctorRef,
                    })
                    .then(() => {
                      setLoading(false);
                      setSnackBar({
                        state: true,
                        severity: "success",
                        message: "Updated successfully",
                      });
                      setMedium(null);
                      setLink("");
                      setResponse(false);
                    })
                    .catch((error) => {
                      setLoading(false);

                      setSnackBar({
                        state: true,
                        severity: "warning",
                        message: "An error occured",
                      });
                    });
                } else {
                }
              }}
            >
              Update
              {loading && <CircularProgress color="primary" size={24} />}
            </Button>
          </div>
        </div>
      )}
      {chat && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            width: windowDimensions.width < 860 ? "100%" : "100%",
            height: "100%",
            zIndex: 1200,
            alignItems: "center",
            overflowY: "scroll",

            left: 0,
            top: 0,
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              borderBottomWidth: 1,
              boxShadow: "0px 6px 12px rgba(0,0,0,0.15)",
              padding: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: "15%",
            }}
          >
            <Avatar></Avatar>
            <div style={{ display: "flex", justifySelf: "center" }}>
              Dr. Ama Nimo
            </div>
            <IconButton
              style={{
                justifySelf: "flex-end",
                // position: "absolute",
                // right: 10,
              }}
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setChat(false);
              }}
              edge="start"
            >
              <CloseOutlined />
            </IconButton>
          </div>
          <div
            style={{
              width: "100%",
              height: "75%",
              overflowY: "scroll",
              display: "flex",
              flexDirection: "column",
              paddingLeft: "5%",
              paddingRight: "5%",
              paddingBottom: 20,
            }}
          >
            {chat &&
              appointmentID !== null &&
              chatData !== null &&
              chatData.map((item, index) => {
                if (item.user === "patient") {
                  return (
                    <Paper
                      key={index}
                      style={{
                        maxWidth: "80%",
                        marginTop: 5,
                        alignSelf: "flex-end",
                        padding: 10,
                      }}
                      elevation={3}
                    >
                      {item.message}
                    </Paper>
                  );
                } else {
                  return (
                    <Paper
                      key={index}
                      style={{
                        maxWidth: "80%",
                        marginTop: 5,
                        alignSelf: "flex-start",
                        padding: 10,
                      }}
                      elevation={3}
                    >
                      {item.message}
                    </Paper>
                  );
                }
              })}
          </div>
          <div
            style={{
              width: "100%",
              // height: "10%",
              paddingTop: 10,
              paddingBottom: 10,
              boxShadow: "0px -6px 12px rgba(0,0,0,0.15)",
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InputBase
              style={{
                width: "85%",
                overflowY: "auto",

                padding: 15,
                borderRadius: 5,
                backgroundColor: "rgba(0,0,0,0.15)",
              }}
              placeholder="Type a message"
              rowsMax={4}
              value={message}
              multiline
              onChange={(value) => {
                setMessage(value.target.value);
              }}
            />
            <IconButton
              style={{
                justifySelf: "flex-end",
                width: "15%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                // position: "absolute",
                // right: 10,
              }}
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                const fieldValue = firebase.firestore.FieldValue;
                const date = new Date();
                if (message.length > 0) {
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(docID)
                    .collection("appointments")
                    .doc(appointmentID)
                    .update({
                      chatData: fieldValue.arrayUnion({
                        message: message,
                        timeStamp: date.getTime(),
                        user: "patient",
                      }),
                    })
                    .then(() => {
                      setMessage("");
                      console.log(appointmentID);
                    })
                    .catch(() => {});
                }
              }}
              edge="start"
            >
              <SendOutlined />
            </IconButton>
          </div>
        </div>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        // style={{ backgroundColor: "#1FAF67" }}
        open={snackBar.state}
        autoHideDuration={2000}
        onClose={() => {
          setSnackBar({
            state: false,
            message: "",
            severity: "",
          });
          // if (snackBar.severity === "success") {
          //   history.push("/dashboard");
          // }
        }}
        // message="Sign Up successful"
      >
        <Alert
          // onClose={() => {
          //   setSnackBar({ state: false, severity: "", message: "" });
          //   // if (snackBar.severity === "success") {

          //   // }
          // }}
          severity={snackBar.severity}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
