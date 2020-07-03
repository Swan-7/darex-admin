import React, { useState, useEffect } from "react";
import "./Welcome.css";
import SignUp from "./SignUp/SignUp";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import "./Header.css";
import { useHistory, useLocation } from "react-router-dom";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Image,
  DotGroup,
  Dot,
} from "pure-react-carousel";
import SignIn from "./SignIn/SignIn";
const dotValue = [
  {
    key: 1,
  },
  {
    key: 2,
  },
  {
    key: 2,
  },
];
export default function Welcome() {
  const [option, setOption] = useState(true);
  let history = useHistory();
  let location = useLocation();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    window.addEventListener("resize", () => {
      console.log("resize");
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }, []);
  return (
    <div id="main_screen">
      <div id="main_welcome">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
          className="main_carousel"
        >
          <img
            style={{
              width: "100%",
            }}
            src={require("./assets/undraw_laravel_and_vue_59tp.png")}
          />
        </div>
        <div className="main_signup_signin">
          {/* {option && (
            <SignUp
              windowDimensions={windowDimensions}
              signIn={() => {
                setOption(false);
                // history.push("/dashboard");
                console.log(location);
              }}
            />
          // )} */}

          <SignIn
            windowDimensions={windowDimensions}
            signUp={() => {
              setOption(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
