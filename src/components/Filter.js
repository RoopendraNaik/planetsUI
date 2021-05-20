import React, { useState, useEffect } from 'react';
import axios from 'axios'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';

function Filter(props) {
    const [items, setItems] = useState([])
    const handleValueChange = (e) => {
        let temp = []
        items.forEach(_=>{
            if(e.target.id === _.id) {
                temp.push({id: _.id,name: _.name,value: !_.value})
            } else {
                temp.push({id: _.id,name: _.name,value: _.value})
            }
        })
        setItems(temp)
        props.parentCallback(props.filterName,temp)
    }
    useEffect(() => {
        let filterVariable = props.filterName.charAt(0).toLowerCase() + props.filterName.slice(1);
        axios.get(`http://localhost:3000/${filterVariable}`).then(res => {
            let temp = [];
            res.data.forEach(element => {
                if(props.savedFilters && props.savedFilters[filterVariable]?.length>0){
                    if(props.savedFilters[filterVariable].includes(element.id)){
                        temp.push({ id: element.id, name: element.name, value: true })
                    } else {
                        temp.push({ id: element.id, name: element.name, value: false })
                    }
                } else {
                    temp.push({ id: element.id, name: element.name, value: false })
                }
            });
            setItems(temp)
        })
    }, [props.filterName])
    return (
        <div>
            <h2>{props.filterName}</h2>
            {
                items.map(_ =>
                    (
                        <FormGroup row key={_.id}>
                            <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={_.value}
                                    onChange={event => handleValueChange(event)}
                                    name={_.name} id={_.id}
                                    color="primary"
                                  />
                                }
                                label={_.name}
                              />
                        </FormGroup>
                      )
                )
            }
        </div>
    );
}

export default Filter;