import axios from "axios";
import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import Filter from "./components/Filter";
import { TextField, InputAdornment, Button, Icon } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function App() {
  const filtersStored = { ...JSON.parse(localStorage.getItem('filtersStored'))}
  const [apiData, setApiData] = useState([]);
  const [buttonValue, setButtonValue] = useState(true);
  const [searchInput, setSearchInput] = useState(filtersStored.searchInput? filtersStored.searchInput: '');
  const [shapes, setShapes] = useState(filtersStored.shapes? filtersStored.shapes: []);
  const [colors, setColors] = useState(filtersStored.colors? filtersStored.colors: []);
  const [sizes, setSizes] = useState(filtersStored.sizes? filtersStored.sizes: []);

  useEffect(() => {
    let storeVariable = {
      searchInput,
      shapes,
      colors,
      sizes
    }
    localStorage.setItem('filtersStored',JSON.stringify(storeVariable))
    axios
      .get("http://localhost:3000/planets", {
        params: { q: searchInput, color: colors, shape: shapes, size: sizes }
      })
      .then((res) => {
        console.log("res", res.data);
        setApiData(res.data);
      })
      .catch((err) => {
        console.log("error");
      });
  }, [buttonValue, shapes, colors, sizes]);

  const filters = ["Shapes", "Colors", "Sizes"];

  const setValues = useCallback((filterType, value) => {
    let temp = [];
    value.forEach((element) => {
      if (element.value) {
        temp.push(element.id);
      }
    });
    switch (filterType) {
      case "Shapes":
        setShapes(temp);
        break;
      case "Colors":
        setColors(temp);
        break;
      case "Sizes":
        setSizes(temp);
        break;
      default:
        break;
    }
  }, []);

  return (
    <Card className='cardClass'>
      <CardContent>
        <div className="container-fluid">
          <div className="row">
            <div className='col-12 pt-3'>
              <TextField
                className='w-100'
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <Button onClick={(e) => setButtonValue(!buttonValue)} color='primary'>
                        <Icon>search</Icon>
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <div className="pt-3 col-3">
              {filters.map((element) => {
                return (
                  <div key={element.id}>
                    <Filter
                      filterName={element}
                      savedFilters={filtersStored}
                      parentCallback={setValues}
                    ></Filter>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 col-9">
              {
                apiData.map(_=>
                  (
                    <div key={_.id}>
                      <h2>{_.name}</h2>
                      <div>size: {_.size}</div>
                      <div>color: {_.color}</div>
                      <div>shape: {_.shape}</div>
                    </div>
                  )
                )
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;