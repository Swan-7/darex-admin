import React, { useEffect, useState } from "react";
import "./Main.css";
import clsx from "clsx";
import { makeStyles, useTheme, fade } from "@material-ui/core/styles";
import {
  Avatar,
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faHeadSideCough,
  faHome,
  faCalendarCheck,
  faUserNurse,
  faUserMd,
  faSignOutAlt,
  faProcedures,
  faVials,
} from "@fortawesome/free-solid-svg-icons";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import HomeIcon from "@material-ui/icons/Home";
import Home from "./Home/Home";

import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Profile from "./Profile/Profile";
import Symptoms from "./Symptoms/Symptoms";
import Appointment from "./DocAppoint/DocAppoint";
import Doctors from "./Doctors/Doctors";
import Therapy from "./Therapy/Therapy";
import TestScan from "./Test&Scan/TestScan";
const drawerWidth = "240px";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    width: `calc(100% - 15%)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth})`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function Main({ match }) {
  let data = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const [dialog, setDialog] = useState(false);

  const handleClickOpen = () => {
    setDialog(true);
  };
  const [iconColor, setIconColor] = useState(0);
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem
        onClick={() => {
          history.push(`${match.url}/profile`, { docID: docID });
        }}
      >
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push("/");
        }}
      >
        <IconButton color="inherit">
          <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: 20 }} />
        </IconButton>
        <p>Log out</p>
      </MenuItem>
    </Menu>
  );
  // let data = useParams();
  let history = useHistory();
  let location = useLocation();
  const [userData, setUserData] = useState(null);
  const [docID, setDocID] = useState(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    window.addEventListener("popstate", (e) => {
      // Nope, go back to your page
      e.preventDefault();
      console.log("popstate");
    });
  }, []);
  useEffect(() => {
    // console.log(data);
    window.addEventListener("resize", () => {
      console.log("resize");
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
    setDocID(location.state.docID);
    firebase
      .firestore()
      .collection("admin")
      .doc(location.state.docID)
      .onSnapshot(
        (doc) => {
          // console.log(doc.data());
          setUserData(doc.data());
        },
        (error) => {}
      );

    // console.log(location.state.docID);
  }, []);
  return (
    <div
      style={{
        // width: "100vw",
        height: "100%",
        display: "flex",
        // flexDirection: "row",
        overflowY: "hidden",
      }}
    >
      <div style={{}}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        ></AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          {open && (
            <div className={classes.toolbar}>
              <img
                style={{ width: 160, height: 50 }}
                src={require("../assets/logo_no_background.png")}
              />
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
          )}
          {!open && (
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              {/* <Typography variant="h6" noWrap>
               Mini variant drawer
             </Typography> */}
            </Toolbar>
          )}
          <Divider />
          <List>
            {[
              "Symptoms & Signs",
              "Doc Appointment",
              "Doctors",
              "Therapy",
              "Test & Scan",
            ].map((text, index) => (
              <ListItem
                button
                style={{
                  backgroundColor: index === iconColor ? "#022E53" : "#fff",
                }}
                key={text}
                onClick={() => {
                  // if (text === "Overview") {
                  //   history.push(`${match.url}`, { docID: docID });
                  // }
                  setIconColor(index);
                  if (text === "Symptoms & Signs") {
                    history.push(`${match.url}`, {
                      docID: docID,
                    });
                  }
                  if (text === "Doc Appointment") {
                    history.push(`${match.url}/appointment`, {
                      docID: docID,
                      createAppointment: false,
                    });
                  }
                  if (text === "Doctors") {
                    history.push(`${match.url}/doctors`, {
                      docID: docID,
                      createAppointment: false,
                    });
                  }
                  if (text === "Therapy") {
                    history.push(`${match.url}/therapy`, {
                      docID: docID,
                      createAppointment: false,
                    });
                  }
                  if (text === "Test & Scan") {
                    history.push(`${match.url}/testscan`, {
                      docID: docID,
                      createAppointment: false,
                    });
                  }
                }}
              >
                <ListItemIcon>
                  {/* {index === 0 && (
                      <FontAwesomeIcon style={{ fontSize: 20 }} icon={faHome} />
                    )} */}
                  {index === 0 && (
                    <FontAwesomeIcon
                      icon={faHeadSideCough}
                      style={{ fontSize: 20 }}
                      color={"#00AFEF"}
                    />
                  )}
                  {index === 1 && (
                    <FontAwesomeIcon
                      icon={faCalendarCheck}
                      style={{ fontSize: 20 }}
                      color={"#00AFEF"}
                    />
                  )}
                  {index === 2 && (
                    <FontAwesomeIcon
                      color={"#00AFEF"}
                      icon={faUserMd}
                      style={{ fontSize: 20 }}
                    />
                  )}
                  {index === 3 && (
                    <FontAwesomeIcon
                      icon={faProcedures}
                      style={{ fontSize: 20 }}
                      color={"#00AFEF"}
                    />
                  )}
                  {index === 4 && (
                    <FontAwesomeIcon
                      color={"#00AFEF"}
                      icon={faVials}
                      style={{ fontSize: 20 }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          {/* <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <HomeIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> */}
        </Drawer>
      </div>

      <div
        className={classes.content}
        style={{
          height: "100vh",
          flexGrow: 1,
          // backgroundColor: "#000fff",
          // width: "100%",
          padding: 0,
        }}
      >
        <ElevationScroll>
          <div className={classes.grow}>
            <AppBar position="sticky">
              <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                  Hello Admin
                </Typography>
                {/* <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </div> */}
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                  {/* <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <MailIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                  >
                    <Badge badgeContent={17} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton> */}
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={() => {
                      history.push(`${match.url}/profile`, { docID: docID });
                    }}
                    color="inherit"
                  >
                    {userData !== null &&
                      userData.profileUrl !== undefined &&
                      userData.profileUrl.length === 0 && (
                        <Avatar>
                          {userData !== null &&
                            userData.firstName !== undefined &&
                            `${userData.firstName.substring(
                              0,
                              1
                            )}${userData.lastName.substring(0, 1)}`}
                        </Avatar>
                      )}
                    {userData !== null &&
                      userData.profileUrl !== undefined &&
                      userData.profileUrl.length > 0 && (
                        <Avatar
                          alt="profile"
                          src={userData.profileUrl}
                          className={classes.large}
                        />
                      )}
                    {/* <AccountCircle /> */}
                  </IconButton>
                </div>
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
          </div>
        </ElevationScroll>
        {/* <div className={classes.toolbar} /> */}
        <div style={{ height: "100%", overflowY: "hidden", width: "auto" }}>
          <Switch>
            {/* <Route exact path={`${match.path}`}>
              <Home />
            </Route> */}
            <Route exact path={`${match.path}`}>
              <Symptoms
                userData={userData}
                windowDimensions={windowDimensions}
                docID={docID}
                match={match}
              />
            </Route>
            <Route exact path={`${match.path}/profile`}>
              <Profile
                userData={userData}
                windowDimensions={windowDimensions}
                docID={docID}
              />
            </Route>
            <Route path={`${match.path}/appointment`}>
              <Appointment
                userData={userData}
                windowDimensions={windowDimensions}
                docID={docID}
                match={match}
              />
            </Route>
            <Route path={`${match.path}/doctors`}>
              <Doctors
                userData={userData}
                windowDimensions={windowDimensions}
                docID={docID}
                match={match}
              />
            </Route>
            <Route path={`${match.path}/therapy`}>
              <Therapy
                userData={userData}
                windowDimensions={windowDimensions}
                docID={docID}
                match={match}
              />
            </Route>
            <Route path={`${match.path}/testscan`}>
              <TestScan
                userData={userData}
                windowDimensions={windowDimensions}
                docID={docID}
                match={match}
              />
            </Route>
            {/* <Route path="/products" component={Products} /> */}
          </Switch>
          {/* <Home /> */}
          <Dialog
            open={dialog}
            onClose={() => {}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Information</DialogTitle>
            <DialogContent>
              <DialogContentText
                style={{ display: "flex", flexDirection: "column" }}
                id="alert-dialog-description"
              >
                You have not been directed to book an appointment with a doctor.
              </DialogContentText>
              <DialogContentText
                style={{ display: "flex", flexDirection: "column" }}
                id="alert-dialog-description"
              >
                To book an appointment with a doctor:
                <ul>
                  <li>Tell us what is wrong with you at Symptoms and Signs</li>
                  <li>We will get back to you with what to do next</li>
                </ul>
              </DialogContentText>
              <DialogContentText
                style={{ display: "flex", flexDirection: "column" }}
                id="alert-dialog-description"
              ></DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setDialog(false);
                }}
                color="primary"
                autoFocus
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
