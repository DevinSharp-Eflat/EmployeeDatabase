import * as React from 'react';
import { Button, Divider, Stack } from '@mui/material';

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  return (
    <>
    <div>Nav</div><Stack direction={"row"} spacing={20} sx={{ alignContent: 'center' }}>
        <Button variant='outlined'
        onClick={() => { window.location.href = "./";
        }}>Candidate Search</Button>
        <Divider orientation="vertical" variant="middle" />
        <Button variant='outlined'
        onClick={() => { window.location.href = "./SavedCandidates";
        }}>Saved Candidates</Button>
    </Stack>
    </>
  )
};

export default Nav;
