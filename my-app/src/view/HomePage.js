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
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${v}.json?printpretty`);
    const dtl = await response.json();
    return dtl
  }

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const stories = await getTopStories();
        setTopStories(stories);
      } catch (error) {
        // Handle errors, e.g., display an error message
      }
    };

    if (topStories.length > 0) {
      let topItems = topStories.slice(0,15)

      topItems.forEach(async (v)=>{
        let story = await getStoryByID(v)
        // console.log(story)
        // console.log("\n------------------\n")
        const updatedStories = currentStories.push(story)
        setCurrentStories(prev=>[
          ...prev,
          story
        ])

        console.log(currentStories)
      })

      setIsLoading(false)
      
    }else{
      fetchData();
    }
    

  },[topStories])
   
  return <div>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        
        {
          currentStories.length && currentStories.map(story => (
            <Grid item xs={12} md={4} key={story.id}>
              <Item>{story.title}</Item>
            </Grid>
          ))
        }
        
        {
          topStories.length && <Grid item xs={12}>
            <Pagination count={topStories.length}/>
          </Grid>
        }
        
      </Grid>
    </Box>
    
  </div>;
};

export default HomePage;