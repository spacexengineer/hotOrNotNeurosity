import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

// import Hottie from "./Hottie";

import { URLs } from "./URL";

import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";

import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const likeWords = [
  "Hot Dawg! 🌭",
  "Lookin Slick! 😎",
  "Shawty on! 🔥",
  "Temperature’s Rising! 🚀",
  "Workin It! 💪",
  "Damnnnn Son! 😍",
  "You’re in LOVE! 🥰",
];

function getRandomLikeWord() {
  const randomIndex = Math.floor(Math.random() * likeWords.length);
  return likeWords[randomIndex];
}

const dislikeWords = [
  "Temperature’s Declining 🥶",
  "Ooohhh, No Connection 😨",
  "You’re Not Feeling It 😦",
  "No Love Found 💔",
  "Not Into It 😖",
];

function getRandomDislikeWord() {
  const randomIndex = Math.floor(Math.random() * dislikeWords.length);
  return dislikeWords[randomIndex];
}

function Header() {
  const neonSignStyle = {
    fontSize: "2em",
    textAlign: "center",
    color: "#fff",
    textShadow: `
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 15px #ff2d95,
      0 0 20px #ff2d95,
      0 0 30px #ff2d95,
      0 0 40px #ff1177,
      0 0 55px #ff1177,
      0 0 75px #ff1177
    `,
    fontWeight: "bold",
  };

  const neonBoxStyle = {
    border: "3px solid #ff1177",
    borderRadius: "10px",
    padding: "20px",
    display: "inline-block",
    boxShadow: `
      0 0 5px #ff2d95,
      0 0 15px #ff2d95,
      0 0 30px #ff1177,
      0 0 45px #ff1177
    `,
    marginBottom: "20px",
    background: "rgba(255, 255, 255, 0.9)",
  };

  return (
    <div style={neonBoxStyle}>
      <h1 style={neonSignStyle}>Hot or Not</h1>
    </div>
  );
}

function Hottie({ powerBandsData }) {
  const [loading, setLoading] = useState(false);
  // const [dogs, setDogs] = useState([]);
  const [dogs, setDogs] = useState(URLs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoritedDogs, setFavoritedDogs] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showGif, setShowGif] = useState(true); // State to manage GIF visibility
  const [glowingButton, setGlowingButton] = useState(null);
  const [alphaValue, setCurrentAlphaValue] = useState(0);

  // console.log("props ", powerBandsData);
  console.log("alphaValue ", alphaValue);

  // const URL =
  //   "https://gist.githubusercontent.com/sikanhe/f6a21b85f005fa73a6354102f9d25e3c/raw";

  const buttonsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "50px", // This will create a gap of 50px between the button containers
    visibility: showGif ? "hidden" : "visible", // Hide buttons when GIF is showing
    marginBottom: "20px", // Spacing from the bottom
  };

  // Inline style for the individual button container
  const buttonWrapperStyle = {
    display: "flex",
    flexDirection: "column", // Stack the elements vertically
    alignItems: "center", // Center align the button and text
    height: "60px", // Fixed height to account for the button and potential text
  };

  const buttonStyle = (button) => ({
    marginRight: button === "like" ? "25px" : "0",
    marginLeft: button === "dislike" ? "25px" : "0",
    boxShadow: glowingButton === button ? "0 0 10px red" : "none",
    border: glowingButton === button ? "1px solid red" : "1px solid #ddd",
    color: glowingButton === button ? "red" : "#000",
    visibility: showGif ? "hidden" : "visible",
    marginBottom: "10px",
    padding: "0.5rem 1rem", // Padding inside the button
    fontSize: "1rem", // Font size
    fontWeight: "bold", // Font weight
    borderRadius: "0.25rem", // Rounded corners
    cursor: "pointer",
    transition: "background-color 0.2s",
  });

  // useEffect(() => {
  //   fetch(URLs)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setDogs(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data: ", error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
        setCurrentAlphaValue(powerBandsData.alpha); // Set alpha to the current alpha value when the GIF is hidden
        // button set here
        setGlowingButton(alphaValue > 30 ? "like" : "dislike");
      }, 5000); // Hide the GIF after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showGif]);

  const handleDogAction = (isLiked) => {
    if (isLiked) {
      setFavoritedDogs((prevFavs) => [...prevFavs, dogs[currentIndex]]);
    }
    const nextIndex = (currentIndex + 1) % dogs.length;
    if (nextIndex === 0) {
      // All dogs have been liked/disliked
      setShowFavorites(true); // Or handle this scenario as you see fit
    } else {
      setCurrentIndex(nextIndex);
      setShowGif(true); // Show the GIF again for the next dog
    }

    // // button set here
    // setGlowingButton(Math.random() < 0.5 ? "like" : "dislike");
  };

  const toggleFavorites = () => {
    setShowFavorites((prevShowFavorites) => !prevShowFavorites);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (showFavorites) {
    return (
      <>
        <h2>Your Favorite</h2>
        <div
          key={dogs[currentIndex].id}
          style={{ height: "300px", width: "300px", marginBottom: "20px" }}
        >
          <img
            src={
              "https://bookface-images.s3.amazonaws.com/avatars/93d828e318fc0b066b0b8f1d92d381465d9c5e79.jpg?1695927944"
            }
            alt="a person"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>
        {/* <button onClick={toggleFavorites}>Back to All Dogs</button> */}
      </>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
      className="App"
    >
      <>
        <div
          key={dogs[currentIndex].id}
          style={{ height: "300px", width: "300px", marginBottom: "20px" }}
        >
          <img
            src={dogs[currentIndex].url}
            alt="a person"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>
        <div></div>
        <div
          style={{
            position: "relative", // Relative positioning to contain the absolute GIF
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {showGif && (
            <img
              src="https://media.tenor.com/kw46_dihwwYAAAAi/hearts-loading.gif"
              alt="Loading..."
              style={{
                position: "absolute", // Absolute positioning to overlay the buttons
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%", // Set to the width of the container for the buttons
              }}
            />
          )}

          <div style={buttonsContainerStyle}>
            <div style={buttonWrapperStyle}>
              <button
                onClick={() => handleDogAction(false)}
                style={buttonStyle("dislike")}
              >
                Not
              </button>
              {glowingButton === "dislike" && !showGif && (
                <div>{getRandomDislikeWord()}</div>
              )}
            </div>
            <div style={buttonWrapperStyle}>
              <button
                onClick={() => handleDogAction(true)}
                style={buttonStyle("like")}
              >
                Hot
              </button>
              {glowingButton === "like" && !showGif && (
                <div>{getRandomLikeWord()}</div>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export function Calm() {
  const { user } = useNotion();
  const [calm, setCalm] = useState(0);
  // Adjust state to hold the EEG channel names and their corresponding averaged values
  const [channelAverages, setChannelAverages] = useState([]);
  const [channelNames, setChannelNames] = useState([]);
  const [powerBandsData, setPowerBandsData] = useState({
    delta: [],
    theta: [],
    alpha: [],
    beta: [],
    gamma: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const calmSubscription = notion.calm().subscribe((calm) => {
      const calmScore = Math.trunc(calm.probability * 100);
      setCalm(calmScore);
    });

    const eegSubscription = notion
      .brainwaves("raw")
      .subscribe(({ data, info }) => {
        // Calculate the average for each channel's data array
        const averages = data.map(
          (channelData) =>
            channelData.reduce((a, b) => a + b, 0) / channelData.length
        );
        setChannelAverages(averages);
        // Set channel names for labeling the chart
        setChannelNames(info.channelNames);
      });

    // Subscription to power bands
    const powerBandsSubscription = notion
      .brainwaves("powerByBand")
      .subscribe(({ data }) => {
        // Here, data is an object with arrays for each band, like { alpha: [values], beta: [values], ... }
        setPowerBandsData({
          delta: calculateAverage(data.delta),
          theta: calculateAverage(data.theta),
          alpha: calculateAverage(data.alpha),
          beta: calculateAverage(data.beta),
          gamma: calculateAverage(data.gamma),
        });
      });

    return () => {
      calmSubscription.unsubscribe();
      eegSubscription.unsubscribe();
      powerBandsSubscription.unsubscribe();
    };
  }, [user]);

  const calculateAverage = (bandArray) => {
    return bandArray.reduce((acc, value) => acc + value, 0) / bandArray.length;
  };

  const eegChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const eegChartData = {
    labels: channelNames, // Use channel names for labels
    datasets: [
      {
        label: "Average EEG Signal Strength",
        data: channelAverages, // Use the calculated averages
        backgroundColor: [
          "rgba(102, 51, 153, 0.6)",
          "rgba(254, 209, 0, 0.6)",
          "rgba(0, 181, 204, 0.6)",
          "rgba(77, 196, 77, 0.6)",
          "rgba(255, 64, 129, 0.6)",
          // Add more colors if you have more than 5 channels
        ],
      },
    ],
  };

  // Prepare chart data for power bands
  const powerBandsChartData = {
    labels: [
      // "Delta\n0.104 Hz",
      // "Theta\n4-7.5 Hz",
      // "Alpha\n7.5-12.5 Hz",
      // "Beta\n12.5-30 Hz",
      // "Gamma\n30-100 Hz",
      "Delta",
      "Theta",
      "Alpha",
      "Beta",
      "Gamma",
    ], // Band names for labels
    datasets: [
      {
        label: "Absolute Power by Band",
        data: [
          powerBandsData.delta, // Average for Delta
          powerBandsData.theta, // Average for Theta
          powerBandsData.alpha, // Average for Alpha
          powerBandsData.beta, // Average for Beta
          powerBandsData.gamma, // Average for Gamma
        ],
        backgroundColor: [
          "rgba(102, 51, 153, 0.6)", // Color for Delta
          "rgba(254, 209, 0, 0.6)", // Color for Theta
          "rgba(0, 181, 204, 0.6)", // Color for Alpha
          "rgba(77, 196, 77, 0.6)", // Color for Beta
          "rgba(255, 64, 129, 0.6)", // Color for Gamma
        ],
      },
    ],
  };

  const powerBandChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "µV²/Hz",
        },
      },
      x: {
        title: {
          display: true,
          text: "Frequency Bands",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Set to true if you want to display the legend
      },
      title: {
        display: true,
        text: "Absolute Power by Band",
      },
    },
  };

  return (
    <main className="main-container">
      <div className="overlay">
        <div>
          <Header />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "100px" }}>
              <div style={{ display: "none" }}>{user ? <Nav /> : null}</div>
              {/* <div >{user ? <Nav /> : null}</div> */}
              {/* <div className="calm-score">
          &nbsp;{calm}% <div className="calm-word">Calm</div>
        </div> */}
              <Hottie powerBandsData={powerBandsData} />
            </div>
            <div>
              <div style={{ marginRight: "10px" }}>
                {/* <h2>Raw Electrode Data</h2> */}
                {/* <Bar data={eegChartData} options={eegChartOptions} /> */}
              </div>
              <div>
                {/* <h2>Power Bands Data</h2> */}
                <Bar
                  data={powerBandsChartData}
                  options={powerBandChartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
