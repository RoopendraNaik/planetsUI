import axios from 'axios';
import './App.css';
import React, { useCallback, useEffect, useState } from 'react'
import Filter from './components/Filter';

function App() {
  const [apiData, setApiData] = useState([])
  const [searchInput, setSearchInput] = useState()
  const [shapes, setShapes] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  useEffect(() => {
    axios.get('http://localhost:3000/planets', { params: { q: searchInput, color: colors, shape: shapes, size: sizes } }).then(
      res => {
        console.log('res', res.data)
        setApiData(res.data)
      }
    ).catch(err => { console.log('error'); })
  }, [searchInput, shapes, colors, sizes])
  const filters = ['Shapes', 'Colors', 'Sizes']
  const setValues = useCallback((filterType, value) => {
    console.log("filterType", filterType);
    console.log("value", value);
    let temp = []
    value.forEach(element => {
      if (element.value) {
        temp.push(element.id)
      }
    });
    switch (filterType) {
      case 'Shapes':
        setShapes(temp)
        break;
      case 'Colors':
        setColors(temp)
        break;
      case 'Sizes':
        setSizes(temp)
        break;
      default:
        break;
    }
  }, [])
  return (
    <div>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-3'>
            {
              filters.map(element => {
                return (<Filter filterName={element} parentCallback={setValues}></Filter>)
              })
            }
          </div>
          <div className='col-9'>
            {JSON.stringify(apiData)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
