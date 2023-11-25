import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function BasicPagination({count}) {
  return (
    <Stack spacing={2} sx={
      {
        width:"100%",
        padding:"2rem 0",
        display:"flex",
        alignItems:"center"
      }
    }>
      <Pagination count={count} />
      
    </Stack>
  );
}