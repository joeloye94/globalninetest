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
  const PAGINATE_PER_PAGE = 10;
  const [topStories, setTopStories] = useState([])
  const [currentStories, setCurrentStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate();

  const getTopStories = async () => {
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json");
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
      setIsLoading(false)
    }).catch(err=>{
      console.error(err)
    })
    
  }

  const updatePageNumber = (ev, pageNo) => {
    setIsLoading(true)
    populateData(topStories,pageNo)
  }

  const _redirect = (ev, id) => {
    if(id) return navigate("/"+id)
    return
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
                    News
                  </Typography>
                </Card>
              </Grid>
              
            }
            
            {
              /**
               * 
               * skeleton
               * 
               */
              isLoading && <Grid item xs={12}>
                <Skeleton sx={{margin:"1rem"}} variant="rounded" width={"65%"} height={25} />
                <Skeleton sx={{margin:"1rem"}} variant="rounded" width={"50%"} height={25} />
                <Skeleton sx={{margin:"1rem"}} variant="rounded" width={"75%"} height={25} />
                
              </Grid>
            }

            {
              /**
               * 
               * content
               * 
               */
              !isLoading && currentStories.map(story => (
                <Grid item xs={12} key={story?.id}>
                  <Card className={"customCard"}>
                    <Grid container spacing={2} className={"newsItem"} onClick={(event)=>
                      _redirect(event, story?.id)
                    }>
                      <Grid item xs={12} md={8} className={"newsItem__content"}>
                        <div className={"content"}>

                          <Typography variant="h5" gutterBottom>
                            {story?.title || "null"}
                          </Typography>
                          <Typography variant="subtitle1" gutterBottom>
                            {`${story?.score} points by ${story?.by}`}
                          </Typography>
                          <Typography variant="caption" display="block" gutterBottom className={"link"} onClick={(ev)=>{
                            ev.stopPropagation()
                            if(story?.url) window.open(story.url)
                            return
                          }}>
                            {story?.url || ""}
                          </Typography>
                        </div>

                        <Typography className={"fromNow"} variant="overline" gutterBottom>
                          {moment(story.time*1000).from(moment())}
                        </Typography>
                        
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <div className={"newsItem__img"}>

                        </div>
                        
                      </Grid>
                    </Grid>
                    
                  </Card>
                </Grid>
              ))
            }
            
            {
              /**
               * 
               * pagination
               * 
               */
              <Grid item xs={12}>
                <Pagination disabled={isLoading} count={topStories.length ? Math.ceil(topStories.length/PAGINATE_PER_PAGE) : 0}
                  onChange={updatePageNumber}/>
              </Grid>
            }
          </Grid>
        </Paper>
      </Grid>
    </Box>
};

export default HomePage;