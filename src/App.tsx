import React, { useState } from 'react';
import './App.css';
import DataSide from './Components/DataSide';
import FilterBar from './Components/Filterbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const App: React.FC = () => {

  const [search, setSearch] = useState<string>("")
  const [checkBoxFilter, setCheckBoxFilter] = useState<string[]>([])

  return (
    <section>
      <div className="container" >
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FilterBar setSearch={setSearch} checkBoxFilter={checkBoxFilter} setCheckBoxFilter={setCheckBoxFilter} />
            </Grid>
            <Grid item xs={9}>
              <DataSide search={search} checkBoxFilter={checkBoxFilter} />
            </Grid>
          </Grid>
        </Box>
      </div>
    </section>
  );
}

export default App;
