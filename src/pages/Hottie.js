import React, { useEffect, useState } from "react";
// import "./styles.css";

// const URL = "https://gist.githubusercontent.com/sikanhe/f6a21b85f005fa73a6354102f9d25e3c/raw";

export default function Hottie() {
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoritedDogs, setFavoritedDogs] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showGif, setShowGif] = useState(true); // State to manage GIF visibility
  const [glowingButton, setGlowingButton] = useState(null);

  const URL =
    "https://gist.githubusercontent.com/sikanhe/f6a21b85f005fa73a6354102f9d25e3c/raw";

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
  });

  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setDogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
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
    setGlowingButton(Math.random() < 0.5 ? "like" : "dislike");
  };

  const toggleFavorites = () => {
    setShowFavorites((prevShowFavorites) => !prevShowFavorites);
  };

  if (loading) {
    return <p>Loading dogs...</p>;
  }

  if (showFavorites) {
    return (
      <>
        <h2>Favorited Dogs</h2>
        {favoritedDogs.map((dog, index) => (
          <div key={index}>
            <h3>{dog.name}</h3>
            <img
              src={dog.image}
              alt={dog.name}
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          </div>
        ))}
        <button onClick={toggleFavorites}>Back to All Dogs</button>
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
        <h2>Hot or Not?!</h2>
        <div
          key={dogs[currentIndex].id}
          style={{ height: "300px", width: "300px", marginBottom: "20px" }}
        >
          <img
            src={dogs[currentIndex].url}
            alt="a person"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                <div>You should select this one</div>
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
                <div>You should select this one</div>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
