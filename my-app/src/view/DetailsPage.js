import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Pagination from '../components/Pagination'

import moment from "moment"

import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const DetailsPage = () => {
  const { itemID } = useParams();

  const getDetails = async () => {

  }

  const fetchData = async () => {
    try {
      const stories = await getDetails();
      
    } catch (err) {
      console.error(err)
    }
  };
  
  useEffect(()=>{
    fetchData()
  },[])
  return <Box className="holder" sx={{ flexGrow: 1 }} >
    <Grid container spacing={2}>
      <Paper sx={{
        width:"100%",
        padding:"0rem"
      }}>
        <Grid container spacing={0}>
          {
            <Grid item xs={12}>
              <Card className={"customCard"}>
                <Typography variant="h6" sx={{
                  fontWeight:700,
                  padding:"1rem 1.5rem",
                  textAlign:"left"
                }} gutterBottom>
                  Details
                </Typography>
              </Card>
            </Grid>
          }
        </Grid>
      </Paper>
    </Grid>
  </Box>
  
};

export default DetailsPage;