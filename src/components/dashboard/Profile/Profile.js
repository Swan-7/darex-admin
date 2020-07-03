import React, { useEffect, useState } from "react";
import "./Profile.css";
import {
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  Snackbar,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import * as firebase from "firebase/app";
import bcrypt from "bcryptjs";
import MuiAlert from "@material-ui/lab/Alert";
import { motion } from "framer-motion";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import ImageUploader from "react-images-upload";
import MaterialTable from "material-table";
import { CloseOutlined } from "@material-ui/icons";

const variants = {
  hidden: { x: 500 },
  visible: { x: 0 },
};
const logo = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export default function Profile(props) {
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [userData, setUserData] = useState(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState(false);
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [passwordNew, setPasswordNew] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [emailNew, setEmailNew] = useState("");
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(
    false
  );
  const [loading, setLoading] = useState(false);
  const [passwordHash, setPasswordHast] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [snackBar, setSnackBar] = useState({
    state: false,
    severity: "",
    message: "",
  });
  const [admins, setAdmins] = useState([]);
  const [response, setResponse] = useState(false);
  const [count, setCount] = useState(0);
  const handleChange = (event) => {
    setGender(event.target.value);
    console.log(event.target.value);
    if (event.target.value.length > 0) {
      setGenderError(false);
    }
  };
  const [state, setState] = useState({});
  const [docID, setDocID] = useState(null);
  const [authorised, setAuthorised] = useState(true);
  useEffect(() => {
    console.log(props.userData);
    setUserData(props.userData);
    if (props.userData !== null) {
      // setFirstName(props.userData.firstName);
      // setLastName(props.userData.lastName);
      // setPhoneNumber(props.userData.phoneNumber);
      // setAge(props.userData.age);
      // setLocation(props.userData.location);
      // setGender(props.userData.gender);
      // setImageUpload(props.userData.profileUrl);
      // setPassword(props.userData.password);
      // setDocID(props.docID);
    }
  }, [props.userData, state]);
  useEffect(() => {
    if (props.docID !== null) {
      setDocID(props.docID);
      console.log(props.docID);
    }
  }, [state, props.docID]);
  useEffect(() => {
    console.log(userData);
    // setUserData(props.userData);
    setWindowDimensions(props.windowDimensions);
  }, [props.windowDimensions]);
  const [imageUpload, setImageUpload] = useState("");
  const [imageUploadData, setImageUploadData] = useState(null);
  const [imageUploadState, setImageUploadState] = useState(false);
  function onDrop(pictureData, pictureUrl) {
    setImageUpload(pictureUrl);
    setImageUploadData(pictureData);
    setImageUploadState(true);
    console.log(pictureUrl);
  }
  useEffect(() => {
    firebase
      .firestore()
      .collection("admin")
      // .where("authorised", "==", true)
      .onSnapshot((snapshot) => {
        let adminis = [];
        if (snapshot.empty) {
          setCount(0);
          setAdmins([]);
        } else {
          snapshot.forEach((snap) => {
            adminis.push({
              id: snap.id,
              data: snap.data(),
            });
          });
          adminis.sort((a, b) => a.data.adminNumber - b.data.adminNumber);
          setAdmins(adminis);
          setCount(snapshot.size);
        }
      });
  }, []);
  return (
    <div id="main">
      <div style={{ width: "100%" }}>
        <MaterialTable
          title="Administrators"
          columns={[
            {
              title: "#",
              field: "data.adminNumber",
            },
            { title: "firstName", field: "data.firstName" },
            {
              title: "Last Name",
              field: "data.lastName",
            },
          ]}
          data={admins.map((data, index) => data)}
          options={{
            actionsColumnIndex: -1,
            sorting: true,
          }}
          actions={[
            {
              icon: "add",
              tooltip: "Add User",
              isFreeAction: true,
              onClick: (event) => setResponse(true),
            },
            (rowData) => ({
              icon: "delete",
              tooltip: "Delete User",
              onClick: (event, rowData) => {
                console.log({ rowData });
                firebase
                  .firestore()
                  .collection("admin")
                  .doc(rowData.id)
                  .delete()
                  .then(() => {
                    setSnackBar({
                      state: true,
                      message: "Delete Completed Successfully",
                      severity: "success",
                    });
                  })
                  .catch((error) => {
                    setSnackBar({
                      state: true,
                      message: "Delete Error",
                      severity: "info",
                    });
                  });
              },
              disabled: !rowData.data.authorised,
            }),
          ]}
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
          <h2>ADD ADMINISTRATOR</h2>
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
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <TextField
                style={{ width: "45%" }}
                id="filled-multiline-static"
                label="First Name"
                rows={1}
                onChange={(value) => {
                  setFirstName(value.target.value);
                }}
                value={firstName}
              />
              <TextField
                style={{ width: "45%" }}
                id="filled-multiline-static"
                label="Last Name"
                rows={1}
                onChange={(value) => {
                  setLastName(value.target.value);
                }}
                value={lastName}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <TextField
                id="standard-basic"
                label="Password"
                error={passwordError}
                value={passwordNew}
                onChange={(value) => {
                  setPasswordNew(value.target.value);
                  if (value.target.value.length >= 2) {
                    setPasswordError(false);
                  }
                }}
                error={passwordError}
                helperText={passwordError ? "Incorrect entry." : ""}
                style={{ width: "45%" }}
                type={passwordVisibility ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setPasswordVisibility(!passwordVisibility);
                        }}
                        // onMouseDown={handleMouseDownPassword}
                      >
                        {passwordVisibility ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(value) => {
                  setPasswordNew(value.target.value);
                  if (value.target.value.length) {
                    setPasswordError(false);
                  }
                }}
              />
              <TextField
                id="standard-basic"
                label="Password"
                error={confirmPasswordError}
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value.target.value);
                  if (value.target.value.length >= 2) {
                    setConfirmPasswordError(false);
                  }
                }}
                helperText={confirmPasswordError ? "Incorrect entry." : ""}
                style={{ width: "45%" }}
                type={confirmPasswordVisibility ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setConfirmPasswordVisibility(
                            !confirmPasswordVisibility
                          );
                        }}
                        // onMouseDown={handleMouseDownPassword}
                      >
                        {confirmPasswordVisibility ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(value) => {
                  setConfirmPassword(value.target.value);
                  if (value.target.value.length) {
                    setConfirmPasswordError(false);
                  }
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <TextField
                style={{ width: "45%", marginTop: 20 }}
                id="filled-multiline-static"
                label="Email"
                rows={1}
                onChange={(value) => {
                  setEmailNew(value.target.value);
                }}
                value={emailNew}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 40,
            }}
          >
            <h3>Authorise</h3>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div>
                <Checkbox
                  checked={authorised}
                  onChange={(event) => {
                    setAuthorised(event.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />

                <span>Yes</span>
              </div>
              <div>
                <Checkbox
                  checked={!authorised}
                  onChange={(event) => {
                    setAuthorised(!event.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />

                <span>No</span>
              </div>
            </div>
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
                if (
                  firstName.length > 3 &&
                  lastName.length > 3 &&
                  passwordNew.length > 5 &&
                  confirmPassword.length > 5 &&
                  passwordNew === confirmPassword
                ) {
                  setLoading(true);
                  bcrypt.genSalt(10, function (err, salt) {
                    // let passwordFromPhoneNumber = "";
                    // for (let index = 0; index < 4; index++) {
                    //   // let phoneNumber = "0545285039";
                    //   let value = Math.floor(Math.random() * 10);
                    //   passwordFromPhoneNumber =
                    //     passwordFromPhoneNumber +
                    //     String(phoneNumber[value]);
                    // }
                    // Math.floor(Math.random() * 10);
                    bcrypt.hash(passwordNew, salt, function (err, hash) {
                      firebase
                        .firestore()
                        .collection("admin")
                        .doc()
                        .set({
                          firstName: firstName,
                          lastName: lastName,
                          password: hash,
                          email: emailNew,
                          authorised: authorised,
                          adminNumber: count + 1,
                        })
                        .then(() => {
                          setLoading(false);
                          setResponse(false);
                          setFirstName("");
                          setLastName("");
                          passwordNew("");
                          setEmailNew("");
                          setConfirmPassword("");
                          setAuthorised(true);
                        })
                        .catch((error) => {
                          setLoading(false);
                        });
                    });
                  });
                }
              }}
              disabled={loading}
            >
              ADD
              {loading && (
                <CircularProgress color="secondary" size={24} style />
              )}
            </Button>
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
