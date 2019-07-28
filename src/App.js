import React, { useState, useEffect } from "react";
import Airtable from "airtable";

const base = new Airtable({ apiKey: "keyMzueuX1hgzNozE" }).base(
  "app4cOMlQjy69Qwp5"
);

function App() {
  const [scores, setScores] = useState([]);
  const [movements, setMovements] = useState([]);

  function handleClick(e) {
    e.preventDefault();
    base("Table 1").create(
      {
        Name: "Person 1",
        colour: "Salmon",
        Date: "2019-01-01"
      },
      function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        // console.log(record.getId());
      }
    );
  }

  async function fetchScores() {
    base("Scores")
      .select({
        view: "Grid view",
        filterByFormula: "({Movement} = 'Deadlift')"
      })
      .eachPage((scores, fetchNextPage) => {
        setScores(scores);
        // console.log(records);
        fetchNextPage();
      });
  }
  async function fetchMovements() {
    base("Movement")
      .select({
        view: "Grid view"
        // filterByFormula: "({Movement} = 'Deadlift')"
      })
      .eachPage((movements, fetchNextPage) => {
        setMovements(movements);
        // console.log(movements);
        fetchNextPage();
      });
  }

  useEffect(() => {
    fetchMovements();
  }, []);

  useEffect(() => {
    fetchScores();
  }, []);
  return (
    <div className="App">
      <form
        onSubmit={e => {
          e.preventDefault();
          base("Table 1").create(
            {
              colour: "Salmon",
              Date: "2019-01-01"
            },
            function(err, record) {
              if (err) {
                // console.error(err);
                return;
              }
              // console.log(record.getId());
            }
          );
          e.preventDefault();
          fetchScores();
        }}
      >
        <select>
          <option value="Show top scores">Show top scores</option>
          <option value="Show dealift scores">Show deadlift scores</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {movements.length > 0 ? (
        movements.map((movement, index) => (
          <div key={index}>
            <h2>{movement.fields.Name}</h2>
            <p>{movement.fields.Notes}</p>
            <scoreRepeater scores={scores} movement={movement} />
          </div>
        ))
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}

export const scoreRepeater = props => {
  return;
  props.scores
    .filter(score => score.fields.Name === props.movement.fields.Movement)
    .map((score, index) => <p key="index">{score.fields.Weight}</p>);
  console.log(score);
};

export default App;
