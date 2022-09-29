import React from 'react'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface Props {
    setSearch: (a: string) => void,
    checkBoxFilter: string[],
    setCheckBoxFilter: (a: string[]) => void
}

const FilterBar: React.FC<Props> = (props) => {

    let { setSearch, checkBoxFilter, setCheckBoxFilter } = props

    const checkboxFilter = (value: string) => {
    
        const currentIndex = checkBoxFilter.indexOf(value)
        const newCatagories = [...checkBoxFilter]
        if (currentIndex === -1) {
            newCatagories.push(value)
        } else {
            newCatagories.splice(currentIndex, 1)
        }
        setCheckBoxFilter(newCatagories)
    }

    const checkBoxData: string[] = ["Typography", "Biologist", "Chemistry Capitals", "Web Designers", "Black Magicians", "Lame Gamer Boys"]

    return (
        <div style={{ padding: "10px", textAlign: "center" }}>
            <div>
                Search For Name <br />
                <TextField label="Enter Name " variant="outlined" size='small' margin="dense" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div style={{ marginTop: "10px", padding: "7px" }}>
                Filters For Study Group
                <FormGroup>
                    {
                        checkBoxData.map((value, index) => {
                            return (
                                <FormControlLabel key={index} control={<Checkbox sx={{ '&.Mui-checked': { color: "#ff7961" } }} size="small" />} onChange={() => { checkboxFilter(value) }} label={value} />
                            )
                        })
                    }
                </FormGroup>
            </div>
        </div>
    )
}

export default FilterBar  