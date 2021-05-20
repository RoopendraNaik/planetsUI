import React, { useState, useEffect } from 'react';
import axios from 'axios'

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
        axios.get(`http://localhost:3000/${props.filterName.charAt(0).toLowerCase() + props.filterName.slice(1)}`).then(res => {
            let temp = [];
            res.data.forEach(element => {
                temp.push({ id: element.id, name: element.name, value: false })
            });
            setItems(temp)
        })
    }, [props.filterName])
    return (
        <div>
            <h2>{props.filterName}</h2>
            {
                items.map(_ =>
                    (<div key={_.id}><input type='checkbox' name={_.name} id={_.id} value={_.value} checked={_.value} onChange={event => handleValueChange(event)} />{_.name}</div>)
                )
            }
        </div>
    );
}

export default Filter;