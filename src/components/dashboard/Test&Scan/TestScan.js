import React, { useEffect, useState } from "react";

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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
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
export default function TestScan(props) {
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
  const [medium, setMedium] = useState("");
  const [mediumError, setMediumError] = useState(false);
  let data = useLocation();
  const handleChange = (event) => {
    setMedium(event.target.value);
    setMediumError(false);
  };
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState(false);
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
    setCategoryError(false);
  };
  const [admins, setAdmins] = useState([]);
  const [response, setResponse] = useState(false);
  const [count, setCount] = useState(0);

  const [state, setState] = useState({});
  const [docID, setDocID] = useState(null);
  const [authorised, setAuthorised] = useState(true);
  const [specialty, setSpecialty] = useState("");
  const [create, setCreate] = useState(false);
  const [therapyID, setTherapyID] = useState(null);
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
      .collection("testCatalog")
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
          adminis.sort((a, b) => a.data.therapyNumber - b.data.therapyNumber);
          setAdmins(adminis);
          setCount(snapshot.size);
        }
      });
  }, []);
  return (
    <div id="main">
      <div style={{ width: "100%" }}>
        <MaterialTable
          title="Test Catalog"
          columns={[
            {
              title: "#",
              field: "data.catalogNumber",
            },
            { title: "Name", field: "data.name" },
            {
              title: "Price",
              field: "data.price",
            },
            {
              title: "Category",
              field: "data.category",
            },
            {
              title: "Currency",
              field: "data.currency",
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
              onClick: (event) => {
                setResponse(true);
                setEdit(false);
                setFirstName("");
                setLastName("");
                setMedium("");
                setAuthorised(true);
              },
            },
            {
              icon: "edit",
              tooltip: "Edit User",

              onClick: (event, rowData) => {
                setEdit(true);
                setResponse(true);
                setFirstName(rowData.data.name);
                setLastName(rowData.data.price);
                setMedium(rowData.data.currency);
                setAuthorised(rowData.data.authorised);
                setTherapyID(rowData.id);
              },
            },
            (rowData) => ({
              icon: "delete",
              tooltip: "Delete User",
              onClick: (event, rowData) => {
                console.log({ rowData });
                firebase
                  .firestore()
                  .collection("testCatalog")
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
              disabled: !rowData.data.status,
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
          <h2>{edit ? "EDIT TEST CATALOG DETAILS" : "ADD TEST"}</h2>
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
                label="Name"
                rows={1}
                onChange={(value) => {
                  setFirstName(value.target.value);
                }}
                value={firstName}
              />
              <TextField
                style={{ width: "45%" }}
                id="filled-multiline-static"
                label="Price"
                rows={1}
                onChange={(value) => {
                  setLastName(value.target.value);
                }}
                value={lastName}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <FormControl
              style={{
                width: windowDimensions.width > 860 ? "45%" : "45%",

                marginTop: 20,
              }}
              error={mediumError}
            >
              <InputLabel id="demo-simple-select-label">Currency</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={medium}
                onChange={handleChange}
              >
                {["GHS", "USD"].map((item, index) => {
                  return (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
              {mediumError && <FormHelperText>Pick a currency</FormHelperText>}
            </FormControl>
            <FormControl
              style={{
                width: windowDimensions.width > 860 ? "45%" : "45%",

                marginTop: 20,
              }}
              error={mediumError}
            >
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                onChange={handleChangeCategory}
              >
                {[
                  "SEROLOGY",
                  "HAEMATOLOGY",
                  "BIOCHEMISTRY",
                  "ENDOCRINOLOGY/ENZYMOLOGY/IMMUNOLOGY",
                  "MICROBIOLOGY",
                  "DNA TESTING",
                  "PCR-XPERT TEST",
                  "IMAGING",
                  "HISTOPATHOLOGY",
                  "PARASITOLOGY",
                ].map((item, index) => {
                  return (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
              {categoryError && (
                <FormHelperText>Pick a category</FormHelperText>
              )}
            </FormControl>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 40,
            }}
          >
            <h3>Status</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div>
                <Checkbox
                  checked={authorised}
                  onChange={(event) => {
                    setAuthorised(event.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />

                <span>Activate</span>
              </div>
              <div>
                <Checkbox
                  checked={!authorised}
                  onChange={(event) => {
                    setAuthorised(!event.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />

                <span>De-Activate</span>
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
                  firstName.length > 1 &&
                  Number.isInteger(Number(lastName))
                ) {
                  setLoading(true);
                  if (edit) {
                    firebase
                      .firestore()
                      .collection("testCatalog")
                      .doc(therapyID)
                      .update({
                        name: firstName,
                        price: Number(lastName),
                        currency: medium,
                        status: authorised,
                        category: category,
                      })
                      .then(() => {
                        setSnackBar({
                          state: true,
                          message: "Updated Successfully",
                          severity: "success",
                        });
                        setLoading(false);
                        setResponse(false);
                        setFirstName("");
                        setLastName("");
                        setAuthorised(true);
                        setTherapyID(null);
                        setMedium("");
                        setCategory("");
                      })
                      .catch((error) => {
                        setSnackBar({
                          state: true,
                          message: "An Error occured",
                          severity: "warning",
                        });
                        setLoading(false);
                      });
                  } else {
                    let date = new Date();
                    firebase
                      .firestore()
                      .collection("testCatalog")
                      .doc()
                      .set({
                        name: firstName,
                        price: Number(lastName),
                        status: authorised,
                        catalogNumber: count + 1,
                        createdAtValue: date.getTime(),
                        createdAt: new Date(),
                        currency: medium,
                        category: category,
                      })
                      .then(() => {
                        setLoading(false);
                        setResponse(false);
                        setFirstName("");
                        setLastName("");
                        setSnackBar({
                          state: true,
                          message: "Added Successfully",
                          severity: "success",
                        });
                        setAuthorised(true);
                        setTherapyID(null);
                        setMedium("");
                        setCategory("");
                      })
                      .catch((error) => {
                        setSnackBar({
                          state: true,
                          message: "An Error occured",
                          severity: "warning",
                        });
                        setLoading(false);
                      });
                  }
                }
              }}
              disabled={loading}
            >
              {edit ? "UPDATE" : "ADD"}
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
