import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Pagination from '../components/Pagination'

import moment from "moment"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

/**
 * 
 * UI https://bgr.com/wp-content/uploads/2022/06/Google-News-Redesign.jpg?quality=82&strip=all
 * 
 * lazy load up to 10 items
 * 1. get all topstories
 * (https://hacker-news.firebaseio.com/v0/topstories.json)
 * 
 * 2. assuming topstories load in desc order, just load first 10 unique ids from resp
 * type:"job", "story", "comment", "poll", or "pollopt"
 * eg (https://hacker-news.firebaseio.com/v0/item/38408873.json)
 * 
 * 
 * 
 */



const HomePage = () => {
  const PAGINATE_PER_PAGE = 15;
  const [topStories, setTopStories] = useState([])
  const [currentStories, setCurrentStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getTopStories = async () => {
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const stories = await response.json();
      return stories;
    } catch (error) {
      console.error("Error fetching top stories:", error);
      throw error;
    }
  };
  const getStoryByID = async (v) => {
    return (await fetch(`https://hacker-news.firebaseio.com/v0/item/${v}.json?printpretty`)).json();
  }
  const populateData = (data, pageNo)=>{
    const startIndex = (pageNo-1)* PAGINATE_PER_PAGE
    let topItems = JSON.parse(JSON.stringify(data)).slice(startIndex,PAGINATE_PER_PAGE*pageNo)
    
    let itemCalls = []
    // console.log(topItems)
    topItems.forEach(async (v)=>{
      itemCalls.push(getStoryByID(v))
    })

    Promise.all(itemCalls).then(res=>{
      // console.log(res)
      setCurrentStories(res)
    }).catch(err=>{
      console.error(err)
    })

    setIsLoading(false)
    
  }


  const updatePageNumber = (ev, pageNo) => {
    populateData(topStories,pageNo)
  }

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const stories = await getTopStories();
        setTopStories(stories)
        populateData(stories, 1)
      } catch (err) {
        console.error(err)
      }
    };

    if (!topStories.length) {
      fetchData()
    }
  },[topStories])
   
  return <div>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        
         {
          currentStories.map(story => (
            <Grid item xs={12} md={4} key={story.id}>
              <Item>
                {story.title}<br/>
                {moment(story.time*1000).from(moment())}
              </Item>
            </Grid>
          ))
        }
        
        {
          <Grid item xs={12}>
            <Pagination count={topStories.length ? Math.ceil(topStories.length/PAGINATE_PER_PAGE) : 0}
              onChange={updatePageNumber}/>
          </Grid>
        }
        
      </Grid>
    </Box>
    
  </div>;
};

export default HomePage;