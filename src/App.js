import React, { useState, useEffect } from "react";
import Airtable from "airtable";

const base = new Airtable({ apiKey: "keyMzueuX1hgzNozE" }).base(
  "app4cOMlQjy69Qwp5"
);

function App() {
  const [scoresData, setScoresData] = useState([]);
  const [movementsData, setMovementsData] = useState([]);

  let movementsList = movementsData.map(movement => movement.fields.Name);
  let scoresSorted = scoresData.sort(function(a, b) {
    var scoreA = a.fields.Weight;
    var scoreB = b.fields.Weight;
    if (scoreA < scoreB) {
      return 1;
    }
    if (scoreA > scoreB) {
      return -1;
    }
    return 0;
  });

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
        view: "Grid view"
        // filterByFormula: "({Movement} = 'Deadlift')"
      })
      .eachPage((scores, fetchNextPage) => {
        setScoresData(scores);
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
        setMovementsData(movements);
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
      {console.log(movementsList)}
      {movementsData.length > 0 ? (
        movementsData.map((movement, index) => (
          <div key={index}>
            <h2>{movement.fields.Name}</h2>
            <p>{movement.fields.Notes}</p>
            {scoresSorted.map((score, index) =>
              movement.fields.Name === score.fields.Movement ? (
                <p key={index}>{score.fields.Weight}</p>
              ) : (
                ""
              )
            )}
            {console.log(scoresSorted)}
          </div>
        ))
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}

export default App;
