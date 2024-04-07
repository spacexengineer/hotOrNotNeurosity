import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";

import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

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
      <div>
        {user ? <Nav /> : null}
        {/* <div className="calm-score">
          &nbsp;{calm}% <div className="calm-word">Calm</div>
        </div> */}
      </div>
      <div>
        <div style={{ marginRight: "10px" }}>
          <h2>Raw Electrode Data</h2>
          <Bar data={eegChartData} options={eegChartOptions} />
        </div>
        <div>
          <h2>Power Bands Data</h2>
          <Bar data={powerBandsChartData} options={powerBandChartOptions} />
        </div>
      </div>
    </main>
  );
}
