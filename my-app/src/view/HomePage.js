import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Pagination from '../components/Pagination'


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
        console.log(story)
        console.log("\n------------------\n")
      })
    }else{
      fetchData();
    }
    console.log(topStories)

  },[topStories])
   
  return <div>
    {
      topStories.length && <Pagination count={topStories.length}/>
    }
  </div>;
};

export default HomePage;