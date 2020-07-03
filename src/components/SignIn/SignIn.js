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
} from "@material-ui/core";
import { motion } from "framer-motion";
import MuiAlert from "@material-ui/lab/Alert";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import * as firebase from "firebase/app";
import { useHistory, Prompt } from "react-router-dom";
import bcrypt from "bcryptjs";
import "./SignIn.css";
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
export default function SignIn(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    state: false,
    severity: "",
    message: "",
  });
  let history = useHistory();
  useEffect(() => {
    window.addEventListener("popstate", (e) => {
      // Nope, go back to your page
      e.preventDefault();
      console.log("popstate");
      history.push("/");
    });
  }, []);
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
      <span>Hello Admin, Welcome back,Please login to your account</span>
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
        <div
          style={{
            width:
              props.windowDimensions !== undefined &&
              props.windowDimensions.width > 1024
                ? "40%"
                : "60%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <TextField
            error={userNameError}
            id={userNameError ? "standard-error-helper-text" : "standard-basic"}
            // label="Error"
            // defaultValue="Hello World"
            value={userName}
            onChange={(value) => {
              setUserName(value.target.value);
              if (value.target.value.length >= 2) {
                setUserNameError(false);
              }
            }}
            helperText={userNameError ? "Incorrect entry." : ""}
            style={{ width: "100%" }}
            label="Email"
          />
        </div>

        <div
          style={{
            width:
              props.windowDimensions !== undefined &&
              props.windowDimensions.width > 1024
                ? "40%"
                : "60%",
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
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {}}
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
                // textDecorationLine: "underline",
                textTransform: "none",
              }}
            >
              Forgot Password
            </Button>
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
            {/* <Button
              onClick={props.signUp}
              variant="outlined"
              style={{
                borderWidth: 2,
                borderColor: "#00528E",
                color: "#00528E",
                fontWeight: "bold",
                boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
                width: "45%",
              }}
            >
              Sign Up
            </Button> */}
            <Button
              onClick={() => {
                if (userName.length > 5 && password.length > 7) {
                  setLoading(true);
                  setPasswordError(false);
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
                            .collection("admin")
                            .where("email", "==", userName)
                            .get()
                            .then((docs) => {
                              if (docs.empty) {
                                console.log("account not found");
                                setSnackBar({
                                  state: true,
                                  message: "Account not found",
                                  severity: "info",
                                });
                                setLoading(false);
                                // firebase
                                //   .firestore()
                                //   .collection("users")
                                //   .where("phoneNumber", "==", userName)
                                //   .get()
                                //   .then((docs) => {
                                //     if (docs.empty) {
                                //       console.log("account not found");
                                //       setLoading(false);
                                //       setSnackBar({
                                //         state: true,
                                //         message: "Account not found",
                                //         severity: "info",
                                //       });
                                //     } else {
                                //       docs.forEach((doc) => {
                                //         bcrypt
                                //           .compare(
                                //             password,
                                //             doc.data().password
                                //           )
                                //           .then((res) => {
                                //             // res === true
                                //             setLoading(false);
                                //             if (res) {
                                //               console.log("Login Success");
                                //               setSnackBar({
                                //                 state: true,
                                //                 message: "Sign up successful",
                                //                 severity: "success",
                                //               });
                                //               setTimeout(() => {
                                //                 history.push("/dashboard", {
                                //                   docID: doc.id,
                                //                 });
                                //               }, 2000);
                                //             } else {
                                //               console.log("password wrong");
                                //               setSnackBar({
                                //                 state: true,
                                //                 message: "Wrong password",
                                //                 severity: "info",
                                //               });
                                //             }
                                //           });
                                //       });
                                //     }
                                //   })
                                //   .catch((error) => {
                                //     setLoading(false);
                                //     setSnackBar({
                                //       state: true,
                                //       message: error.message,
                                //       severity: "error",
                                //     });
                                //   });
                              } else {
                                docs.forEach((doc) => {
                                  bcrypt
                                    .compare(password, doc.data().password)
                                    .then((res) => {
                                      // res === true
                                      setLoading(false);
                                      if (res) {
                                        console.log("Login Success");
                                        setSnackBar({
                                          state: true,
                                          message: "Sign up successful",
                                          severity: "success",
                                        });
                                        history.push("/dashboard", {
                                          docID: doc.id,
                                        });
                                      } else {
                                        console.log("password wrong");
                                        setSnackBar({
                                          state: true,
                                          message: "Wrong password",
                                          severity: "info",
                                        });
                                      }
                                    });
                                });
                              }
                            })
                            .catch((error) => {
                              setLoading(false);
                              setSnackBar({
                                state: true,
                                message: error.message,
                                severity: "error",
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
                      console.log(errorMessage);
                      // ...
                    });
                }
                if (password.length < 8) {
                  setPasswordError(true);
                }
                if (userName.length < 6) {
                  setUserNameError(true);
                }

                // setField({
                //   signIn: false,
                //   signUp: false,
                //   ageGender: false,
                //   locationPhone: true,
                // });
              }}
              variant="outlined"
              style={{
                // borderWidth: 2,
                width: "100%",
                backgroundColor: "#00528E",
                color: "#fff",
                fontWeight: "bold",
                boxShadow: "0px 6px 12px rgba(0,42,182,0.15)",
              }}
            >
              Login
              {loading && <CircularProgress color="#fff" size={24} style />}
            </Button>
          </div>
        </div>
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
      </motion.div>
      {/* <Prompt
        message={(location, action) => {
          if (action === "POP") {
            console.log("Backing up...");
          }

          return `Are you sure you want to go to ${location.pathname}?`;
        }}
      /> */}
    </div>
  );
}
