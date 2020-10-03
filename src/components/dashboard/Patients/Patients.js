import React, { useState, useEffect, createRef } from "react";
// import "./Symptoms.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialTable from "material-table";
import { CloseOutlined, Done, SendOutlined, Add } from "@material-ui/icons";
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
  Backdrop,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import "../../style.css";
import ImageUploader from "react-images-upload";
import { faCross, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
export default function Patients(props) {
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
  //modals
  const [medicalHistory, setmedicalHistory] = useState(false);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  //prescription
  const [drugcount, setdrugcount] = useState(1);
  const [drug, setdrug] = useState("");
  //conditions
  const [conditionsRelatives, setconditionsRelatives] = useState([]);
  const [conditionsRelative, setconditionsRelative] = useState("");
  const [currentSymptoms, setcurrentSymptoms] = useState([]);
  const [currentSymptomValue, setcurrentSymptomValue] = useState("");
  const [currentMedications, setcurrentMedications] = useState([]);
  const [currentMedication, setcurrentMedication] = useState("");
  const [tobacco, settobacco] = useState(null);
  const [illegal, setillegal] = useState(null);
  const [alcohol, setalchohol] = useState(null);
  const [updateLoading, setupdateLoading] = useState(false);
  const [userID, setuserID] = useState("");
  const [selectedUser, setselectedUser] = useState(null);
  const [allergies, setallergies] = useState([]);
  const [allergy, setallergy] = useState("");
  const [history, setHistory] = useState([]);
  const [pending, setPending] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);

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
  //prescrition table patient
  const [patientPrescritpion, setPatientPrescritpion] = useState([]);
  const [prescritionLoading, setPrescriptionLoading] = useState(true);
  useEffect(() => {
    if (prescriptionModal) {
      setPrescriptionLoading(true);
      firebase
        .firestore()
        .collection("prescriptions")
        .where("userID", "==", userID)
        .onSnapshot(
          (snapshots) => {
            let initial = [];
            if (snapshots.empty) {
              setPatientPrescritpion([]);
              setPrescriptionLoading(false);
              console.log("empty");
            } else {
              snapshots.forEach((snap) => {
                initial.push(snap.data());
              });
              setPatientPrescritpion(initial);
              setPrescriptionLoading(false);
            }
          },
          (error) => {
            console.log(error);
            setPrescriptionLoading(false);
          }
        );
    }
  }, [prescriptionModal]);
  useEffect(() => {
    console.log("Response effect", response);
  }, [response]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  useEffect(() => {
    setLoadingIndicator(true);
    firebase
      .firestore()
      .collection("users")
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
              // let date = new Date(snap.data().createdAtValue);
              if (snap.data().status === "pending") {
                initialPending = initialPending + 1;
              }
              if (snap.data().status === "done") {
                initialDone = initialDone + 1;
              }
              initialHistory.push({
                ...snap.data(),
                //   date: date.toDateString(),
                id: snap.id,
              });
            });
            console.log(initialHistory);
            setHistory(initialHistory);
            setTotal(snapshots.size);
            setPending(initialPending);
            setDone(initialDone);
            setLoadingIndicator(false);
          }
        },
        (error) => {
          console.log(error);
          setLoadingIndicator(false);
        }
      );
  }, []);
  return (
    <div
      style={{
        flexGrow: 1,
        padding: "40px 30px",
        display: "flex",
        // overflowY: "scroll",
        backgroundColor: "rgba(0,175,239,0.19)",

        flexBasis: 50,
        height: "100vh",
      }}
    >
      <div
        style={{
          // overflowY: "scroll",
          // width: "100vw",
          flexGrow: 1,
          display: "flex",
          marginTop: 30,
          maxHeight: "80vh",
        }}
      >
        <MaterialTable
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            maxHeight: "100%",
            boxShadow: "0px 10px 20px rgba(0,175,239,0.19)",
          }}
          title="Patients"
          isLoading={loadingIndicator}
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
                      maxHeight: "70vh",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "row",
                      gap: "2em",
                      flexWrap: "wrap",
                      paddingTop: 20,
                      paddingBottom: 50,
                    }}
                  >
                    {[
                      {
                        title: "Medical History",
                        image: require("../../assets/dashboard/icons8-treatment.png"),
                        to: "history",
                      },
                      {
                        title: "Vitals Watch",
                        image: require("../../assets/dashboard/icons8-epilepsy_smart_watch.png"),
                        to: "Watch",
                      },
                      // {
                      //   title: "Vitals Watch",
                      //   image: require("../../assets/icons8-order_history.svg"),
                      //   to: "Watch",
                      // },
                      {
                        title: "Test & Scan",
                        image: require("../../assets/dashboard/icons8-airport_security.png"),
                        to: "Watch",
                      },
                      {
                        title: "Vaccination",
                        image: require("../../assets/dashboard/icons8-syringe.png"),
                        to: "Watch",
                      },
                      {
                        title: "DH+ Dispensary & Medical Delivery",
                        image: require("../../assets/dashboard/icons8-hand_with_a_pill.png"),
                        to: "prescription",
                      },
                      {
                        title: "Diet & Fitness Plan",
                        image: require("../../assets/dashboard/diet_fitness.svg"),
                        to: "Watch",
                      },
                      {
                        title: "DR. Afar",
                        image: require("../../assets/dashboard/icons8-video_conference.png"),
                        to: "Watch",
                      },
                      // {
                      //   title: "Prescription",
                      //   image: require("../../assets/dashboard/icons8-video_conference.png"),
                      //   to: "Watch",
                      // },
                    ].map((item, index) => {
                      return (
                        <div
                          // className="card_pointed"
                          onClick={() => {
                            setuserID(rowData.id);
                            setselectedUser(rowData);
                            if (item.title === "Medical History") {
                              setmedicalHistory(true);
                              if (rowData.medicalHistory !== undefined) {
                                setconditionsRelatives(
                                  rowData.medicalHistory
                                    .conditionsImmediateRelatives
                                );
                                setcurrentSymptoms(
                                  rowData.medicalHistory
                                    .symptomsCurrentlyExperiencing
                                );
                                setcurrentMedications(
                                  rowData.medicalHistory.currentMedications
                                );
                                setallergies(rowData.medicalHistory.allergies);
                                settobacco(
                                  rowData.medicalHistory.useOrHistoryOfTobacco
                                );
                                setillegal(
                                  rowData.medicalHistory
                                    .useOrHistoryofIllegalDrugs
                                );
                                setalchohol(
                                  rowData.medicalHistory.consumeAlcohol
                                );
                              }
                            }
                            if (item.to === "prescription") {
                              setPrescriptionModal(true);
                            }
                          }}
                          key={index}
                          style={{
                            backgroundColor: "#005194",
                            padding: "25px",
                            borderRadius: 10,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 3px 6px rgba(0,42,182,0.15)",
                            cursor: "pointer",
                            width: 250,
                          }}
                        >
                          <img src={item.image} />
                          <span
                            style={{
                              marginTop: 15,
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          >
                            {item.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
          ]}
          columns={[
            { title: "#", field: "userID" },
            { title: "First", field: "firstName" },
            {
              title: "Last",
              field: "lastName",
            },
          ]}
          data={history.map((data, index) => data)}
          options={{
            actionsColumnIndex: -1,
          }}
        />
      </div>
      <Backdrop
        open={prescriptionModal}
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            display: "flex",
            width: "90%",
            height: "90%",
            padding: 20,
            flexDirection: "column",
            overflowY: "scroll",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <FontAwesomeIcon
            onClick={() => {
              setdrug("");
              setdrugcount(1);
              setPrescriptionModal(false);
            }}
            color={"#00AFEF"}
            icon={faTimes}
            style={{
              fontSize: 20,
              marginLeft: "auto",
              position: "absolute",
              top: 20,
              right: 20,
            }}
          />
          <div style={{ flexDirection: "column", display: "flex" }}>
            <span style={{ fontSize: 20, marginBottom: 20 }}>
              Prescription for patient
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>Drug</span>
              <TextField
                onChange={(value) => {
                  setdrug(value.target.value);
                }}
                value={drug}
                placeholder="Drug name"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>Count</span>
              <TextField
                type="number"
                onChange={(value) => {
                  setdrugcount(value.target.value);
                }}
                value={drugcount}
                placeholder="count"
              />
            </div>
            <Button
              onClick={() => {
                if (drug.length > 1 && drugcount > 0) {
                  setupdateLoading(true);
                  firebase
                    .firestore()
                    .collection("prescriptions")
                    .doc()
                    .set({
                      drug: drug,
                      count: drugcount,
                      createdAt: new Date().getTime(),
                      userID: userID,
                    })
                    .then(() => {
                      alert("upload successful");
                      setdrug("");
                      setdrugcount(1);
                    })
                    .catch((error) => {
                      setupdateLoading(false);
                      alert("An error occurred");
                    });
                } else {
                  alert("provide inputs");
                }
              }}
              disabled={updateLoading}
              variant="contained"
              style={{
                marginTop: 20,
                width: "45%",
                backgroundColor: "#00528E",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Update
            </Button>
          </div>

          <div
            style={{
              // overflowY: "scroll",
              // width: "100vw",
              flexGrow: 1,
              display: "flex",
              marginTop: 30,
              maxHeight: "80vh",
            }}
          >
            <MaterialTable
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                maxHeight: "100%",
                boxShadow: "0px 10px 20px rgba(0,175,239,0.19)",
              }}
              title="Prescritpions"
              isLoading={prescritionLoading}
              columns={[
                { title: "Drug", field: "drug" },
                { title: "Count", field: "count" },
              ]}
              data={patientPrescritpion}
              options={{
                actionsColumnIndex: -1,
              }}
            />
          </div>
        </div>
      </Backdrop>
      <Backdrop
        open={medicalHistory}
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            display: "flex",
            width: "80%",
            height: "90%",
            padding: 20,
            flexDirection: "column",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ marginLeft: "auto", fontSize: 25 }}>
              Medical History
            </span>
            <FontAwesomeIcon
              onClick={() => {
                setconditionsRelatives([]);
                setcurrentSymptoms([]);
                setcurrentMedications([]);
                setallergies([]);
                settobacco(null);
                setillegal(null);
                setalchohol(null);
                setmedicalHistory(false);
              }}
              color={"#00AFEF"}
              icon={faTimes}
              style={{ fontSize: 20, marginLeft: "auto" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>
              Conditions that apply to you or to any members of your immediate
              relatives
            </span>
            <div>
              <TextField
                onChange={(value) => {
                  setconditionsRelative(value.target.value);
                }}
                value={conditionsRelative}
                placeholder="provide condition"
              />
              <FontAwesomeIcon
                onClick={() => {
                  if (conditionsRelative.length > 2) {
                    let initials = conditionsRelatives;
                    initials.push(conditionsRelative);
                    setconditionsRelatives(initials);
                    console.log(conditionsRelative);
                    setconditionsRelative("");
                  }
                }}
                color={"#00AFEF"}
                icon={faPlus}
                style={{ fontSize: 20, marginLeft: "auto" }}
              />
            </div>
            <div
              className="flex row"
              style={{ gap: "1em", marginTop: 10, flexWrap: "wrap" }}
            >
              {conditionsRelatives.length > 0 &&
                conditionsRelatives.map((item, index) => {
                  return (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => {
                        let initials = conditionsRelatives;
                        initials.splice(index, 1);
                        setconditionsRelatives(initials);
                        // console.log(initials);
                        setState({});
                      }}
                      color="primary"
                    />
                  );
                })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Symptoms that you're currently experiencing</span>
            <div>
              <TextField
                onChange={(value) => {
                  setcurrentSymptomValue(value.target.value);
                }}
                value={currentSymptomValue}
                placeholder="provide condition"
              />
              <FontAwesomeIcon
                onClick={() => {
                  if (currentSymptomValue.length > 2) {
                    let initials = currentSymptoms;
                    initials.push(currentSymptomValue);
                    setcurrentSymptoms(initials);
                    // console.log(conditionsRelative);
                    setcurrentSymptomValue("");
                  }
                }}
                color={"#00AFEF"}
                icon={faPlus}
                style={{ fontSize: 20, marginLeft: "auto" }}
              />
            </div>
            <div
              className="flex row"
              style={{ gap: "1em", marginTop: 10, flexWrap: "wrap" }}
            >
              {currentSymptoms.length > 0 &&
                currentSymptoms.map((item, index) => {
                  return (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => {
                        let initials = currentSymptoms;
                        initials.splice(index, 1);
                        setcurrentSymptoms(initials);
                        // console.log(initials);
                        setState({});
                      }}
                      color="primary"
                    />
                  );
                })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Currently on any medication</span>
            <div>
              <TextField
                onChange={(value) => {
                  setcurrentMedication(value.target.value);
                }}
                value={currentMedication}
                placeholder="provide condition"
              />
              <FontAwesomeIcon
                onClick={() => {
                  if (currentMedication.length > 2) {
                    let initials = currentMedications;
                    initials.push(currentMedication);
                    setcurrentMedications(initials);
                    // console.log(conditionsRelative);
                    setcurrentMedication("");
                  }
                }}
                color={"#00AFEF"}
                icon={faPlus}
                style={{ fontSize: 20, marginLeft: "auto" }}
              />
            </div>
            <div
              className="flex row"
              style={{ gap: "1em", marginTop: 10, flexWrap: "wrap" }}
            >
              {currentMedications.length > 0 &&
                currentMedications.map((item, index) => {
                  return (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => {
                        let initials = currentMedications;
                        initials.splice(index, 1);
                        setcurrentMedications(initials);
                        // console.log(initials);
                        setState({});
                      }}
                      color="primary"
                    />
                  );
                })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Medication allergies</span>
            <div>
              <TextField
                onChange={(value) => {
                  setallergy(value.target.value);
                }}
                value={allergy}
                placeholder="provide condition"
              />
              <FontAwesomeIcon
                onClick={() => {
                  if (allergy.length > 2) {
                    let initials = allergies;
                    initials.push(allergy);
                    setallergies(initials);
                    // console.log(conditionsRelative);
                    setallergy("");
                  }
                }}
                color={"#00AFEF"}
                icon={faPlus}
                style={{ fontSize: 20, marginLeft: "auto" }}
              />
            </div>
            <div
              className="flex row"
              style={{ gap: "1em", marginTop: 10, flexWrap: "wrap" }}
            >
              {allergies.length > 0 &&
                allergies.map((item, index) => {
                  return (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => {
                        let initials = allergies;
                        initials.splice(index, 1);
                        setallergies(initials);
                        // console.log(initials);
                        setState({});
                      }}
                      color="primary"
                    />
                  );
                })}
            </div>
          </div>
          <div>
            <span>Use or have any history of using tobacco</span>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={tobacco}
              onChange={(value) => {
                settobacco(value.target.value);
              }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </div>
          <div>
            <span>Use or have history of using illegal drugs</span>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={illegal}
              onChange={(value) => {
                setillegal(value.target.value);
              }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </div>
          <div>
            <span>Often do consume alcohol</span>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={alcohol}
              onChange={(value) => {
                setalchohol(value.target.value);
              }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </div>
          <Button
            onClick={() => {
              if (
                // conditionsRelatives.length >= 0 &&
                // currentSymptoms.length >= 0 &&
                // currentMedications.length >= 0 &&
                // allergies.length > 0 &&
                tobacco !== null &&
                illegal !== null &&
                alcohol !== null
              ) {
                setupdateLoading(true);
                firebase
                  .firestore()
                  .collection("users")
                  .doc(userID)
                  .update({
                    medicalHistory: {
                      conditionsImmediateRelatives: conditionsRelatives,
                      symptomsCurrentlyExperiencing: currentSymptoms,
                      currentMedications: currentMedications,
                      allergies: allergies,
                      useOrHistoryOfTobacco: tobacco,
                      useOrHistoryofIllegalDrugs: illegal,
                      consumeAlcohol: alcohol,
                    },
                  })
                  .then(() => {
                    setupdateLoading(false);
                    setconditionsRelatives([]);
                    setcurrentSymptoms([]);
                    setcurrentMedications([]);
                    setallergies([]);
                    settobacco(null);
                    setillegal(null);
                    setalchohol(null);
                    setmedicalHistory(false);
                    console.log("done");
                  })
                  .catch((error) => {
                    setupdateLoading(false);
                    alert("An error occurred");
                  });
              } else {
                alert("check tobacco, illegal drugs or alcohol response");
              }
            }}
            disabled={updateLoading}
            variant="contained"
            style={{
              marginTop: 20,
              width: "45%",
              backgroundColor: "#00528E",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Update
          </Button>
        </div>
      </Backdrop>
    </div>
  );
}
