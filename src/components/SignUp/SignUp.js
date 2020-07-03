import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { motion } from "framer-motion";
import "./SignUp.css";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import * as firebase from "firebase/app";
import bcrypt from "bcryptjs";
import MuiAlert from "@material-ui/lab/Alert";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// These imports load individual services into the firebase namespace.
import { useHistory } from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const variants = {
  hidden: { x: 500 },
  visible: { x: 0 },
};
const logo = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function SignUp(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    setGender(event.target.value);
    console.log(event.target.value);
    if (event.target.value.length > 0) {
      setGenderError(false);
    }
  };
  const [field, setField] = useState({
    name: true,
    ageGender: false,
    locationPhone: false,
    password: false,
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [userID, setUserID] = useState(null);
  const [docID, setDocID] = useState(null);
  useEffect(() => {}, []);
  let history = useHistory();
  return (
    <div id="main_signup">
      <motion.div
        transition={{ ease: "easeInOut", duration: 2 }}
        initial="hidden"
        animate="visible"
        variants={logo}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          position: "absolute",
          top: "10%",
        }}
      >
        <img
          style={{ width: 200, height: 60 }}
          src={require("../assets/logo_no_background.png")}
        />
      </motion.div>
      <span>Kindly fill the forms below to continue</span>
      <motion.div
        transition={{ ease: "easeInOut", duration: 0.5 }}
        initial="hidden"
        animate="visible"
        variants={variants}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: 20,
        }}
      >
        {field.name && (
          <div
            style={{
              width:
                props.windowDimensions !== undefined &&
                props.windowDimensions.width > 1024
                  ? "40%"
                  : "55%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              error={firstNameError}
              id={
                firstNameError ? "standard-error-helper-text" : "standard-basic"
              }
              // label="Error"
              // defaultValue="Hello World"
              value={firstName}
              onChange={(value) => {
                setFirstName(value.target.value);
                if (value.target.value.length >= 2) {
                  setFirstNameError(false);
                }
              }}
              helperText={firstNameError ? "Incorrect entry." : ""}
              style={{ width: "100%" }}
              label="First Name"
            />
            <TextField
              value={lastName}
              onChange={(value) => {
                setLastName(value.target.value);
                if (value.target.value.length >= 2) {
                  setLastNameError(false);
                }
              }}
              error={lastNameError}
              helperText={lastNameError ? "Incorrect entry." : ""}
              style={{ width: "100%", marginTop: 5 }}
              id="standard-basic"
              label="Last Name"
            />
            <Button
              onClick={() => {
                if (firstName.length < 2) {
                  setFirstNameError(true);
                } else {
                  setFirstNameError(false);
                }
                if (lastName.length < 2) {
                  setLastNameError(true);
                } else {
                  setLastNameError(false);
                }
                if (firstName.length >= 2 && lastName.length >= 2) {
                  setField({
                    password: false,
                    name: false,
                    ageGender: true,
                    locationPhone: false,
                  });
                }
              }}
              variant="outlined"
              style={{
                borderWidth: 2,
                borderColor: "#00528E",
                color: "#00528E",
                fontWeight: "bold",
                boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                marginTop: 20,
                alignSelf: "flex-end",
              }}
            >
              Next
            </Button>
          </div>
        )}
        {field.ageGender && (
          <div
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              display: "flex",
              width:
                props.windowDimensions !== undefined &&
                props.windowDimensions.width > 1024
                  ? "40%"
                  : "55%",
            }}
          >
            <TextField
              error={ageError}
              helperText={ageError ? "Incorrect entry." : ""}
              id="standard-basic"
              style={{ width: 120 }}
              label="Age"
              maxLength={3}
              value={age}
              onChange={(value) => {
                const ageValue = Number(value.target.value);
                if (Number.isInteger(ageValue)) {
                  setAge(value.target.value);
                  setAgeError(false);
                  if (value.target.value.length > 3) {
                    setAgeError(true);
                  } else {
                    setAgeError(false);
                  }
                  console.log("true");
                } else {
                  setAgeError(true);
                }
              }}
            />
            <FormControl error={genderError} className={classes.formControl}>
              <InputLabel id="demo-simple-select-error-label">
                Gender
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={gender}
                onChange={handleChange}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </Select>
              {genderError && <FormHelperText>Error</FormHelperText>}
            </FormControl>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 20,
              }}
            >
              <Button
                onClick={() => {
                  setField({
                    password: false,
                    name: true,
                    ageGender: false,
                    locationPhone: false,
                  });
                }}
                variant="outlined"
                style={{
                  borderWidth: 2,
                  borderColor: "#00528E",
                  color: "#00528E",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (age.length >= 4) {
                    setAgeError(true);
                  } else {
                    setAgeError(false);
                  }
                  if (!Number.isInteger(Number(age))) {
                    setAgeError(true);
                  } else {
                    setAgeError(false);
                  }
                  if (age.length === 0) {
                    setAgeError(true);
                  } else {
                    setAgeError(false);
                  }
                  if (gender.length === 0) {
                    setGenderError(true);
                  } else {
                    setGenderError(false);
                  }
                  if (
                    age.length > 0 &&
                    age.length < 4 &&
                    Number.isInteger(Number(age)) &&
                    (gender === "male" || gender == "female")
                  ) {
                    setField({
                      password: false,
                      name: false,
                      ageGender: false,
                      locationPhone: true,
                    });
                  }
                }}
                variant="outlined"
                style={{
                  borderWidth: 2,
                  borderColor: "#00528E",
                  color: "#00528E",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {field.locationPhone && (
          <div
            style={{
              width:
                props.windowDimensions !== undefined &&
                props.windowDimensions.width > 1024
                  ? "40%"
                  : "55%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              id="standard-basic"
              label="Location"
              value={location}
              onChange={(value) => {
                setLocation(value.target.value);
                if (value.target.value.length >= 2) {
                  setLocationError(false);
                }
              }}
              error={locationError}
              helperText={locationError ? "Incorrect entry." : ""}
              style={{ width: "100%", marginTop: 5 }}
            />
            <TextField
              id="standard-basic"
              label="Phone Number"
              value={phoneNumber}
              onChange={(value) => {
                setPhoneNumber(value.target.value);
                if (value.target.value.length >= 10) {
                  setPhoneNumberError(false);
                }
              }}
              placeholder="eg. 0245xxxxxx"
              error={phoneNumberError}
              helperText={phoneNumberError ? "Incorrect entry." : ""}
              style={{ width: "100%", marginTop: 5 }}
            />
            <div
              style={{
                width: "100%",
                alignItems: "center",
                // justifyContent: "center",
                marginTop: 10,
                display: "flex",
              }}
            >
              <Checkbox
                style={{ padding: 0 }}
                checked={checked}
                onChange={(event) => {
                  setChecked(event.target.checked);
                }}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
              <span>I agree with terms and conditions</span>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 20,
              }}
            >
              <Button
                onClick={() => {
                  setField({
                    password: false,
                    name: false,
                    ageGender: true,
                    locationPhone: false,
                  });
                }}
                variant="outlined"
                style={{
                  borderWidth: 2,
                  borderColor: "#00528E",
                  color: "#00528E",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  // setOpen(true);
                  if (
                    location.length >= 2 &&
                    phoneNumber.length === 10 &&
                    checked
                  ) {
                    setLoading(true);
                    // Store hash in your password DB.
                    // let password =
                    firebase
                      .firestore()
                      .collection("users")
                      .where("phoneNumber", "==", phoneNumber)
                      .get()
                      .then((docs) => {
                        if (docs.empty) {
                          bcrypt.genSalt(10, function (err, salt) {
                            let passwordFromPhoneNumber = "";
                            for (let index = 0; index < 4; index++) {
                              // let phoneNumber = "0545285039";
                              let value = Math.floor(Math.random() * 10);
                              passwordFromPhoneNumber =
                                passwordFromPhoneNumber +
                                String(phoneNumber[value]);
                            }
                            // Math.floor(Math.random() * 10);
                            bcrypt.hash(
                              passwordFromPhoneNumber,
                              salt,
                              function (err, hash) {
                                setPassword(passwordFromPhoneNumber);
                                // Store hash in your password DB.

                                firebase
                                  .firestore()
                                  .collection("users")
                                  .get()
                                  .then((docs) => {
                                    const size = docs.size;
                                    if (docs.empty) {
                                      console.log("empty");
                                    }
                                    //  else {
                                    console.log("not empty");
                                    let fieldValue =
                                      firebase.firestore.FieldValue;
                                    setUserID("DXP000" + (size + 1));
                                    let doc = firebase
                                      .firestore()
                                      .collection("users")
                                      .doc();
                                    setDocID(doc.id);
                                    doc
                                      .set({
                                        firstName: firstName,
                                        lastName: lastName,
                                        age: Number(age),
                                        location: location,
                                        phoneNumber: phoneNumber,
                                        gender: gender,
                                        password: hash,
                                        userID: "DXP000" + (size + 1),
                                        isActive: true,
                                        createdAt: fieldValue.serverTimestamp(),
                                        profileUrl: "",
                                      })
                                      .then(() => {
                                        setLoading(false);
                                        setSnackBar({
                                          state: true,
                                          message: "Sign up successful",
                                          severity: "success",
                                        });

                                        setTimeout(() => {
                                          // history.push("/dashboard");
                                          setOpen(true);
                                        }, 2000);
                                        // alert("Sign up successful");
                                      })
                                      .catch((error) => {
                                        setLoading(false);
                                        // alert("An error occured");
                                        setSnackBar({
                                          state: true,
                                          severity: "error",
                                          message: "Error occured",
                                        });
                                        console.log(error);
                                      });
                                    // }
                                    console.log(size);
                                  })
                                  .catch((error) => {
                                    // console.log(error);
                                    setLoading(false);
                                    setSnackBar({
                                      state: true,
                                      severity: "error",
                                      message: "Error occured",
                                    });
                                  });
                              }
                            );
                          });
                        } else {
                          setLoading(false);
                          setSnackBar({
                            state: true,
                            message: "User with similar phone number exists",
                            severity: "info",
                          });
                        }
                      })
                      .catch((error) => {
                        setLoading(false);
                        setSnackBar({
                          state: true,
                          severity: "error",
                          message: "Error occured",
                        });
                      });
                  }
                  if (location.length < 2) {
                    setLocationError(true);
                  } else {
                    setLocationError(false);
                  }
                  if (phoneNumber.length < 10) {
                    setPhoneNumberError(true);
                  } else {
                    setPhoneNumberError(false);
                  }
                  if (!checked) {
                    // alert("Complete all fields required");
                  }
                }}
                variant="outlined"
                style={{
                  borderWidth: 2,
                  borderColor: "#00528E",
                  color: "#00528E",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                }}
              >
                Complete
                {loading && <CircularProgress size={24} style />}
              </Button>
              {/* <Button
                onClick={() => {
                  if (location.length < 2) {
                    setLocationError(true);
                  } else {
                    setLocationError(false);
                  }
                  if (phoneNumber.length < 10) {
                    setPhoneNumberError(true);
                  } else {
                    setPhoneNumberError(false);
                  }
                  if (location.length >= 2 && phoneNumber.length >= 10) {
                    setField({
                      password: true,
                      name: false,
                      ageGender: false,
                      locationPhone: false,
                    });
                  }
                }}
                variant="outlined"
                style={{
                  borderWidth: 2,
                  borderColor: "#00528E",
                  color: "#00528E",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                }}
              >
                Next
              </Button> */}
            </div>
          </div>
        )}
        {field.password && (
          <div
            style={{
              width:
                props.windowDimensions !== undefined &&
                props.windowDimensions.width > 1024
                  ? "40%"
                  : "55%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              id="standard-basic"
              label="Password"
              error={passwordError}
              value={password}
              onChange={(value) => {
                setPassword(value.target.value);
                if (value.target.value.length >= 2) {
                  setPasswordError(false);
                }
              }}
              error={passwordError}
              helperText={passwordError ? "Incorrect entry." : ""}
              style={{ width: "100%", marginTop: 5 }}
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
                      {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(value) => {
                setPassword(value.target.value);
                if (value.target.value.length) {
                  setPasswordError(false);
                }
              }}
            />
            <TextField
              style={{ width: "100%" }}
              id="standard-basic"
              label="Confirm Password"
              onChange={(value) => {
                setConfirmPassword(value.target.value);
                if (value.target.value.length) {
                  setConfirmPasswordError(false);
                }
              }}
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
            />
            <div
              style={{
                width: "100%",
                alignItems: "center",
                // justifyContent: "center",
                marginTop: 10,
                display: "flex",
              }}
            >
              <Checkbox
                style={{ padding: 0 }}
                checked={checked}
                onChange={(event) => {
                  setChecked(event.target.checked);
                }}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
              <span>I agree with terms and conditions</span>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 20,
              }}
            >
              <Button
                onClick={() => {
                  setField({
                    password: false,
                    name: false,
                    ageGender: false,
                    locationPhone: true,
                  });
                }}
                variant="outlined"
                style={{
                  borderWidth: 2,
                  borderColor: "#00528E",
                  color: "#00528E",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (
                    password === confirmPassword &&
                    password.length >= 8 &&
                    checked
                  ) {
                    setLoading(true);
                    // Store hash in your password DB.
                    firebase
                      .auth()
                      .signInAnonymously()
                      .then(() => {
                        firebase.auth().onAuthStateChanged(function (user) {
                          if (user) {
                            // User is signed in.
                            var isAnonymous = user.isAnonymous;
                            var uid = user.uid;
                            // ...
                            firebase
                              .firestore()
                              .collection("users")
                              .where("phoneNumber", "==", phoneNumber)
                              .get()
                              .then((docs) => {
                                if (docs.empty) {
                                  bcrypt.genSalt(10, function (err, salt) {
                                    bcrypt.hash(password, salt, function (
                                      err,
                                      hash
                                    ) {
                                      // Store hash in your password DB.

                                      firebase
                                        .firestore()
                                        .collection("users")
                                        .get()
                                        .then((docs) => {
                                          const size = docs.size;
                                          if (docs.empty) {
                                            console.log("empty");
                                          }
                                          //  else {
                                          console.log("not empty");
                                          let fieldValue =
                                            firebase.firestore.FieldValue;
                                          firebase
                                            .firestore()
                                            .collection("users")
                                            .doc()
                                            .set({
                                              firstName: firstName,
                                              lastName: lastName,
                                              age: Number(age),
                                              location: location,
                                              phoneNumber: phoneNumber,
                                              gender: gender,
                                              password: hash,
                                              userID: "DXP000" + (size + 1),
                                              isActive: true,
                                              createdAt: fieldValue.serverTimestamp(),
                                              profileUrl: "",
                                            })
                                            .then(() => {
                                              setLoading(false);
                                              setSnackBar({
                                                state: true,
                                                message: "Sign up successful",
                                                severity: "success",
                                              });
                                              // setTimeout(() => {

                                              // }, 4000);
                                              // alert("Sign up successful");
                                            })
                                            .catch((error) => {
                                              setLoading(false);
                                              // alert("An error occured");
                                              setSnackBar({
                                                state: true,
                                                severity: "error",
                                                message: "Error occured",
                                              });
                                              console.log(error);
                                            });
                                          // }
                                          console.log(size);
                                        })
                                        .catch((error) => {
                                          // console.log(error);
                                          setLoading(false);
                                          setSnackBar({
                                            state: true,
                                            severity: "error",
                                            message: "Error occured",
                                          });
                                        });
                                    });
                                  });
                                } else {
                                  setLoading(false);
                                  setSnackBar({
                                    state: true,
                                    message:
                                      "User with similar phone number exists",
                                    severity: "info",
                                  });
                                }
                              })
                              .catch((error) => {
                                setLoading(false);
                                setSnackBar({
                                  state: true,
                                  severity: "error",
                                  message: "Error occured",
                                });
                              });
                          } else {
                            // User is signed out.
                            // ...
                          }
                          // ...
                        });
                      })
                      .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(error);
                      });
                  }
                  if (password.length < 8) {
                  }
                  if (!checked) {
                    alert("Complete all fields required");
                  }
                }}
                variant="outlined"
                style={{
                  borderWidth: 2,
                  borderColor: "#00528E",
                  color: "#00528E",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                }}
              >
                Complete
                {loading && <CircularProgress size={24} style />}
              </Button>
            </div>
          </div>
        )}
        <Button
          onClick={props.signIn}
          // onClick={() => {
          //   history.push("/dashboard");
          // }}
          style={{
            borderWidth: 2,
            borderColor: "#00528E",
            color: "#00528E",
            fontWeight: "bold",
            // boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
            marginTop: 30,
            textDecorationLine: "underline",
          }}
        >
          Already have an account? Login
        </Button>
      </motion.div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        // style={{ backgroundColor: "#1FAF67" }}
        open={snackBar.state}
        autoHideDuration={2000}
        onClose={() => {
          setSnackBar({ state: false, severity: "", message: "" });
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
      <Dialog
        open={open}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Thank you for Signing Up..."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ display: "flex", flexDirection: "column" }}
            id="alert-dialog-description"
          >
            Find below your UserID and Password:
            <span style={{ fontWeight: "bold" }}>
              UserID: {userID} or {phoneNumber}
            </span>
            <span style={{ fontWeight: "bold" }}> Password: {password}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              history.push("/dashboard", { docID: docID });
            }}
            color="primary"
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
