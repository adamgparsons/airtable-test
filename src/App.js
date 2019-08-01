import React, { useState, useEffect } from "react";
import axios from "axios";

// const base = new Airtable({ apiKey: "keyMzueuX1hgzNozE" }).base(
//   "app4cOMlQjy69Qwp5"
// );

const scoresUrl = "https://api.airtable.com/v0/app4cOMlQjy69Qwp5/scores";
const movementsUrl = "https://api.airtable.com/v0/app4cOMlQjy69Qwp5/movement";

// render list from JSON response to URL
const Airtable = ({ scoresUrl, movementsUrl }) => {
  const [scoresData, setScoresData] = useState([]);
  const [movementData, setMovementData] = useState([]);

  let flags = {};
  const topScores = scoresData.filter(function(entry) {
    if (flags[entry.Movement]) {
      return false;
    }
    flags[entry.Movement] = true;
    return true;
  });
  console.log(topScores);

  // Using async directly in the useEffect function isn’t allowed.
  // Let’s implement a workaround, by creating a separate async function.
  // const fetchData = async () => {
  //   const result = await axios(scoresUrl);
  //   setScoresData(result.data.records);
  //   setMovementData(result.data.records);
  // };

  // use fetch instead of axios
  const getData = async () => {
    try {
      const scoresRes = await fetch(scoresUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer keyMzueuX1hgzNozE"
        }
      });
      const json = await scoresRes.json();
      const jsonTrim = json.records.map(record => record.fields);
      console.log(jsonTrim);
      const dataSorted = jsonTrim.sort(function(a, b) {
        var scoreA = a.Weight;
        var scoreB = b.Weight;
        if (scoreA < scoreB) {
          return 1;
        }
        if (scoreA > scoreB) {
          return -1;
        }
        return 0;
      });
      setScoresData(dataSorted);
      // console.log(dataSorted);
    } catch (err) {
      console.log(err);
    }
    //movement data
    try {
      const movementRes = await fetch(movementsUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer keyMzueuX1hgzNozE"
        }
      });
      const json = await movementRes.json();
      setMovementData(json.records);
      // console.log(json.records);
    } catch (err) {
      console.log(err);
    }
  };

  // call async function from useEffect
  useEffect(() => {
    getData();
  }, []); // provide an empty array as second argument to the effect hook to avoid activating it on component updates but only for the mounting of the component.

  return (
    <div>
      {topScores.length > 0 ? (
        topScores.map((score, index) => (
          <div key={index}>
            <h2>{score.Movement}</h2>
            <p>{score.Weight}</p>
          </div>
        ))
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

const App = () => (
  <div>
    <Airtable scoresUrl={scoresUrl} movementsUrl={movementsUrl} />
  </div>
);

export default App;