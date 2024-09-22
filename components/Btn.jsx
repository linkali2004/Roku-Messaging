import React from 'react'
import { Button } from '@mui/material';
export default function Btn(props) {
  return (
    <Button  onClick={props.onClick?props.onClick:null}   type={props.type} variant={props.variant} disabled={props.type=="submit"?(Object.keys(props.disabled).length == 0?false:true):false} startIcon={props.icon?props.icon:null} sx={{
        borderColor: props.variant=="outlined"?"rgb(156 163 175)":"", 
        color: props.variant=="outlined"?"rgb(0,0,0)":"white", 
        backgroundColor:props.bg ? props.bg :"",
        marginTop:"6px"
      }}>
      {props.text}
    </Button>
  )
}
