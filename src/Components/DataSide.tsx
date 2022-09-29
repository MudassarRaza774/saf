import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

const columns = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'dob', headerName: 'Date of Birth', width: 130 },
    { field: 'groups', headerName: 'Groups', width: 200 },
];

interface Props {
    search: string,
    checkBoxFilter: string[]
}

interface dialogChangingInfo {
    title: string,
    description: string,
    buttonName: string
}

type objectShape = { id?: number, name: string, gender: string, dob: string, groups: string[] }
type studentDataFormat = objectShape[]

const initialData: objectShape = { name: "", gender: "", dob: "2000-01-01", groups: [""] }
let checkBoxes: string[] = []

const DataSide: React.FC<Props> = (props) => {
    let totalStudents: number, checkCount: GridRowId[] = []
    const [studentData, setStudentData] = useState<studentDataFormat>([{ id: 1, name: "", gender: "", dob: "2000-01-01", groups: [""] }]);
    const [open, setOpen] = useState<boolean>(false);
    const [newStudent, setNewStudent] = useState<objectShape>(initialData)
    const [reload, setRelaod] = useState<boolean>(true)
    const [popupInfo, setPopupInfo] = useState<dialogChangingInfo>({
        title: "New Student",
        description: "Add new Student in database",
        buttonName: "Add Student"
    })
    const [showButtons, setShowButtons] = useState(checkCount)


    useEffect(() => {
        fetch('http://localhost:3001/students')
            .then(res => res.json())
            .then(data => setStudentData(data))
    }, [reload])

    totalStudents = studentData.length
    const { search, checkBoxFilter } = props
    const checkBoxData: string[] = ["Typography", "Biologist", "Chemistry Capitals", "Web Designers", "Black Magicians", "Lame Gamer Boys"]

    const filteredData = studentData.filter((value) => {
        return value.name.toLowerCase().includes(search.toLowerCase())
    }).filter((values) => {
        let answer = false
        if (checkBoxFilter.length > 0) {
            for (let i = 0; i < checkBoxFilter.length; i++) {
                answer = values.groups.includes(checkBoxFilter[i])
                if (!answer) {
                    return false
                }
            }
        }
        return values
    })


    const handleClose = () => {
        setNewStudent(initialData)
        setOpen(false);
    };

    const setNewStudentTextFeilds = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { id, value } = e.target
        let groupString: string[] = ['']
        if (id === "groups") {
            if (checkBoxes.includes(value)) {
                checkBoxes.splice(checkBoxes.indexOf(value), 1)
            } else {
                checkBoxes.push(value)
                groupString = checkBoxes
            }
            setNewStudent({ ...newStudent, [id]: groupString })
        } else {
            setNewStudent({ ...newStudent, [id]: value })
        }

    }
    const setNewStudentSelectFeild = (e: SelectChangeEvent) => {
        const { value } = e.target
        setNewStudent({ ...newStudent, 'gender': value })
    }

    const handleSubmit = () => {

        if (newStudent.id) {
            setOpen(false);
            fetch(`http://localhost:3001/students/${newStudent.id}`, {
                method: "PATCH",
                body: JSON.stringify(newStudent),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    console.log("data update successfully")
                    reload ? setRelaod(false) : setRelaod(true)
                    setNewStudent(initialData)
                })
                .catch(() => {
                    console.log("data update false")
                })
        } else {
            fetch("http://localhost:3001/students", {
                method: "POST",
                body: JSON.stringify(newStudent),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(() => {
                    reload ? setRelaod(false) : setRelaod(true)
                    handleClose()
                    setNewStudent(initialData)
                    checkBoxes = []
                }
                )
        }
    }

    const updataRecord = () => {
        const answer = studentData.filter((values) => {
            return values.id === showButtons[0]
        })
        setNewStudent(answer[0])
        handleClickOpen("Update Student")
    }

    const handleClickOpen = (value: string) => {
        if (value === "New Student") {
            setPopupInfo({
                title: "New Student",
                description: "Add new Student in database",
                buttonName: "Add Student"
            })
        } else if (value === "Update Student") {
            setPopupInfo({
                title: "Update Student",
                description: "Update the Selected Student",
                buttonName: "Update Student"
            })
        }
        setOpen(true);
    };

    const deleteRecord = () => {
        const confirm = window.confirm("Are you sure you want to Delete selected record?")
        if (confirm) {
            showButtons.map(element => {
                return (
                    fetch(`http://localhost:3001/students/${element}`, {
                        method: 'DELETE'
                    })
                        .then(() => {
                            console.log("Data deletion Successfully")
                            reload ? setRelaod(false) : setRelaod(true)
                        })
                        .catch(() => {
                            console.log("Data deletion failed")
                        })
                )
            });
        }

    }

    const { dob, gender, name } = newStudent

    return (
        <div>
            <div style={{ margin: "15px 0px 20px 0px", display: "flex", justifyContent: "space-between" }}>
                <div>
                    <PersonOutlineIcon style={{ marginBottom: "-6" }} /> {totalStudents} students
                    <Button variant='contained' onClick={() => handleClickOpen("New Student")} startIcon={<CreateOutlinedIcon />} style={{ marginLeft: "7px" }} > New student </Button>
                </div>
                {showButtons.length > 0 ?
                    <div>
                        {showButtons.length === 1 ? <Button variant='outlined' color='success' onClick={updataRecord} >Update</Button> : ""}
                        <span> </span>
                        <Button variant='outlined' color='error' onClick={deleteRecord} >Delete</Button>
                    </div> : <div></div>
                }
            </div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    onSelectionModelChange={value => {
                        setShowButtons(value)
                    }
                    }
                />
            </div>
            <div>
                <Dialog open={open} maxWidth="xl" fullWidth={true}>
                    <DialogTitle>{popupInfo.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {popupInfo.description}
                        </DialogContentText>
                        <TextField
                            onChange={setNewStudentTextFeilds}
                            autoFocus
                            value={name}
                            margin="dense"
                            id="name"
                            label="Name"
                            type="email"
                            fullWidth
                            variant="outlined"
                        />
                        <FormControl fullWidth margin='dense' >
                            <InputLabel id="gender">Gender</InputLabel>
                            <Select
                                value={gender}
                                label="Gender"
                                onChange={setNewStudentSelectFeild}
                            >
                                <MenuItem value={'Male'} >Male</MenuItem>
                                <MenuItem value={"Female"} >Female</MenuItem>
                                <MenuItem value={"Other"} >Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            onChange={setNewStudentTextFeilds}
                            margin="dense"
                            id="dob"
                            value={dob}
                            label="Date of Birth"
                            fullWidth
                            type="date"
                            variant="outlined"
                        />
                        <Typography marginTop='5px' variant='body1'>Groups</Typography>
                        <FormGroup>
                            <Grid container spacing={0}>
                                {
                                    checkBoxData.map((value) => {
                                        return (
                                            <Grid item xl={2} lg={2} md={3} sm={4} >
                                                <FormControlLabel control={<Checkbox size='small' value={value} id='groups' onChange={setNewStudentTextFeilds} />} label={<Typography variant="body2">{value}</Typography>} />
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>{popupInfo.buttonName}</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div >

    );
}
export default DataSide
