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

import PersonIcon from '@mui/icons-material/Person';

const DetailsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [story, setStory] = useState({})
  const [comments, setComments] = useState([])
  const { itemID } = useParams();

  const getDetails = async () => {
    try {
      //38413064
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${itemID}.json?print=pretty`);
      // const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/38413064.json?print=pretty`);
      const dtl = await response.json();
      return dtl;
    } catch (error) {
      console.error("Error fetching detail:", error);
      throw error;
    }
  }

  const fetchData = async () => {
    try {
      const dtl = await getDetails();
      await populateData(dtl)
    } catch (err) {
      console.error(err)
    }
  };
  const getFetchIDEndpoint = async (v) => {
    return (await fetch(`https://hacker-news.firebaseio.com/v0/item/${v}.json?printpretty`)).json();
  }

  const populateData = async (dtl) => {
    return new Promise(async (res,rej)=>{
      try{
        setStory(dtl)
        await populateComments(dtl).then(res=>{

          console.log(comments)
          console.log("all comments loaded")
          setIsLoading(false)
        }).catch(err=>{
          console.error(err)
        })
      }catch(err){
        console.error(err)
        rej(false)
      }
      
    })
  }
  const populateComments = async (dtl) => {
    return new Promise(async (res,rej)=>{
      try{
        // console.log(dtl)
        //if there are comments found
        if(dtl?.kids?.length){
          let itemCalls = []
          dtl.kids.forEach(async (v)=>{
            itemCalls.push(getFetchIDEndpoint(v))
          })
          
          if(itemCalls.length){
            //load parent level
            Promise.all(itemCalls).then(async itemCallRes=>{
              //load child level
              itemCallRes.forEach(async itemCallResItem=>{
                //load first level
                setComments(prev=>{
                  const updateChildJSON = {
                    ...itemCallResItem,
                  }
                  
                  return [
                    ...prev,
                    updateChildJSON
                  ]
                })

                // if to load child level comments
                // await populateComments(itemCallResItem).then(childRes=>{

                //   console.log("all child comments loaded")
                //   res(true)
                // }).catch(err=>{
                //   console.error(err)
                //   rej(err)
                // })
              })
              res(true)
              
              
            }).catch(err=>{
              console.error(err)
              rej(err)
            })
          }else{
            //if there are child comments
            console.log("kid has no child comments")
            res(true)
          }
        }else{
          //if there are no comments
          console.log("no kid comments")
          res(true)
        }
      }catch(err){
        console.error(err)
        throw err
      }
    })
  }
  
  
  useEffect(()=>{
    fetchData()
  },[])
  return <Box className="holder" sx={{ flexGrow: 1 }} >
    <Grid container spacing={2}>

      <Paper sx={{
        width:"100%",
        padding:"0rem",
        marginBottom:"2rem"
      }}>
        <Grid container spacing={0}>
            {
              /**
               * 
               * title
               * 
               */
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
               * comments
               * 
               */
              !isLoading && 
                <Grid item xs={12}>
                  <Card className={"customCard"}>
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <Card className={"customCard"}>
                          <Grid container spacing={2} className={"newsItem detailsItem"}>
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
                    </Grid>
                    
                  </Card>
                </Grid>
              
            }
        </Grid>
      </Paper>


      <Paper sx={{
        width:"100%",
        padding:"0rem"
      }}>
        <Grid container spacing={0}>
            {
              /**
               * 
               * title
               * 
               */
              <Grid item xs={12}>
                <Card className={"customCard"}>
                  <Typography variant="h6" sx={{
                    fontWeight:700,
                    padding:"1rem 1.5rem",
                    textAlign:"left"
                  }} gutterBottom>
                    Comments
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
               * comments
               * 
               */
              !isLoading && 
                <Grid item xs={12}>
                  <Card className={"customCard"}>
                    <Grid container spacing={0}>
                      {
                        comments.length ? comments.map((c,k)=>
                          <Grid item xs={12} key={k} className="comment" >
                            <div >
                              <div className="userDetails">
                                <Typography variant="overline" gutterBottom>
                                  <PersonIcon className="vertical-align" sx={{
                                    marginRight:2
                                  }}></PersonIcon>
                                  <span className="vertical-align">{c.by}</span>
                                </Typography>

                                <Typography className={"fromNow"} variant="overline" gutterBottom>
                                  {moment(c.time*1000).from(moment())}
                                </Typography>
                              </div>
                              <div dangerouslySetInnerHTML={{ __html: c.text }}></div>
                            </div>

                          </Grid>
                        ) : <div style={{padding:"1.5rem"}}>No comments loaded</div>
                      }
                    </Grid>
                    
                  </Card>
                </Grid>
              
            }
        </Grid>
      </Paper>
    </Grid>
  </Box>
  
};

export default DetailsPage;