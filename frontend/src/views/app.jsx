import useAxios from '../utils/useAxios';
import React, { useEffect, useState } from "react";
import { Box, Chip, InputLabel, List, ListItemButton, ListItemText, MenuItem, OutlinedInput, Select, Tab, TextField } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import Character from '../models/Character';
import { enqueueSnackbar } from 'notistack';
import { TabList, TabPanel } from '@mui/lab';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useAuthStore } from '../store/auth';

const App = () => {
    const api = useAxios();
    const [characters, setCharacters] = useState([])
    const [currentCharacter, setCurrentCharacter] = useState(new Character({}))
    const [loading, setLoading] = useState(false)
    const [selectedTab, setSelectedTab] = useState("details")
    const [characterImages, setCharacterImages] = useState([])

    useEffect(() => {
        refreshCharacters()
    }, [])

    useEffect(() => {
        refreshGallery()
    }, [currentCharacter])


    const refreshCharacters = async () => {
        setLoading(true)
        setCharacters(await Character.list())
        setLoading(false)
    }

    const refreshGallery = async (e) => {
        e && e.preventDefault()
        if (!currentCharacter?.id)
            return;
        setLoading(true)
        let result = await api.get("character_images/?" + new URLSearchParams({ "character_id": currentCharacter.id }).toString())
        setCharacterImages(result.data)
        setLoading(false)
    }


    const handleTabChange = (e, index) => {
        setSelectedTab(index)
    }

    const handleCharacterItemClick = (event, character) => {
        setCharacterImages([])
        setCurrentCharacter(new Character(character))
        refreshGallery()
    }

    const handleRaceChange = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value.join(","))
        let filtered = value.filter((str) => str !== '')
        if (filtered.length > 2) {
            enqueueSnackbar("Nur 2 Rassen sind maximal erlaubt", { variant: "warning" })
            return
        }
        setCurrentCharacter(new Character({ ...currentCharacter, race: filtered.join(",") }))
    };

    const handleWeaponChange = (event) => {
        const {
            target: { value },
        } = event;
        let filtered = value.filter((str) => str !== '')
        if (filtered.length > 4) {
            enqueueSnackbar("Nur 4 Waffen sind maximal erlaubt", { variant: "warning" })
            return
        }
        setCurrentCharacter(new Character({ ...currentCharacter, weapon: filtered.join(",") }))
    };


    const handleClassChange = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value.join(","))
        let filtered = value.filter((str) => str !== '')
        if (filtered.length > 2) {
            enqueueSnackbar("Nur 2 Klassen sind maximal erlaubt", { variant: "warning" })
            return
        }
        setCurrentCharacter(new Character({ ...currentCharacter, character_class: filtered.join(",") }))
    };
    const handleGenderChange = (event) => {
        const {
            target: { value },
        } = event;
        setCurrentCharacter(new Character({ ...currentCharacter, gender: value || null }))
    };

    const handleStoryChange = (event) => {
        const {
            target: { value },
        } = event;
        setCurrentCharacter(new Character({ ...currentCharacter, story: value }))
    };

    const handlePromptChange = (event) => {
        const {
            target: { value },
        } = event;
        setCurrentCharacter(new Character({ ...currentCharacter, prompt: value }))
    };

    const handleImagePromptChange = (event) => {
        const {
            target: { value },
        } = event;
        setCurrentCharacter(new Character({ ...currentCharacter, image_prompt: value }))
    };



    const saveCharacter = async (e) => {
        e.preventDefault();
        try {
            // let data = await Api.saveCharacter(currentCharacter)
            // console.log(data)
            // setCurrentCharacter(data)
            await currentCharacter.save()
            enqueueSnackbar("Änderungen gespeichert", { variant: "success" })
            refreshCharacters()
        }
        catch (e) {
            console.log(e)
            enqueueSnackbar(e.response.data.detail, { variant: "error" })
        }
    }

    const createPrompt = async (e) => {
        e.preventDefault();
        try {
            let prompt = currentCharacter.createStoryPrompt()

            setCurrentCharacter(new Character({ ...currentCharacter, prompt: prompt }))
            console.log(prompt)
        }
        catch (e) {
            enqueueSnackbar(e, { variant: "error" })
        }
    }

    const createImagePrompt = async (e) => {
        e.preventDefault();
        try {
            let prompt = currentCharacter.createImagePrompt()
            setCurrentCharacter(new Character({ ...currentCharacter, image_prompt: prompt }))
            console.log(prompt)

        }
        catch (e) {
            enqueueSnackbar(e, { variant: "error" })
        }
    }

    const createStory = async (e) => {
        e.preventDefault();
        let prompt = currentCharacter.prompt
        setLoading(true)
        try {
            let story = await currentCharacter.createStory(prompt)
            console.log(story)
            setCurrentCharacter(new Character({ ...currentCharacter, story: story }))
        }
        catch (e) {
            enqueueSnackbar(e, { variant: "error" })
        }
        setLoading(false)

    }

    const createImage = async (e) => {
        e.preventDefault();
        let prompt = currentCharacter.image_prompt
        setLoading(true)
        try {
            let image = await currentCharacter.createImage(prompt)
            refreshGallery()
            console.log(image)

        }
        catch (e) {
            console.error(e)
            enqueueSnackbar(e, { variant: "error" })
        }

        setLoading(false)
    }

    return (
        <section>
            <div className="relative">

                <div className='py-[80px] px-[40px] h-screen'>
                    <div className="rounded-[20px] w-full h-full flex md:flex-row flex-col ">
                        <div className="bg-black min-w-[200px] min-h-[200px]">
                            <h1 className="text-red-600">CHARACTERS</h1>
                            { /* <button onClick={refreshCharacters}>REFRESH</button> */}
                            <Box>
                                <List component="nav" aria-label="main mailbox folders">
                                    {characters.map((item, index) => {
                                        return <ListItemButton key={item.id} onClick={(event) => handleCharacterItemClick(event, item)}>
                                            <ListItemText primary={item.name} />
                                        </ListItemButton>
                                    })}
                                    <ListItemButton style={{ color: "white", backgroundColor: "green", padding: "5px" }} key="new-character" onClick={(event) => {
                                        setCurrentCharacter(new Character())
                                        setCharacterImages([])
                                    }}>
                                        <ListItemText primary="Create new Character" />
                                    </ListItemButton>
                                </List>
                            </Box>
                        </div>
                        <div className="bg-gray-300 flex-1 text-black flex items-center justify-center">
                            <div className="w-full h-full">
                                <TabContext value={selectedTab}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleTabChange} aria-label="lab API tabs example" centered>
                                            <Tab label="Details" value="details" />
                                            <Tab label="Story" value="story" />
                                            <Tab label="Images" value="images" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="details">
                                        <div className='justify-center flex'>
                                            <form onSubmit={saveCharacter} className="max-w-[600px] min-w-[60%]  p-5">
                                                <div className="flex flex-col space-y-4">
                                                    <input type="hidden" name="id" value={currentCharacter.id} />
                                                    <div>
                                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                                        <input type="text" id="name" name="name" value={currentCharacter.name} onChange={(e) => { setCurrentCharacter(new Character({ ...currentCharacter, name: e.target.value })); }} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required="" />
                                                    </div>
                                                    <div>
                                                        <InputLabel id="gender-label">Geschlecht</InputLabel>
                                                        <Select
                                                            className="bg-white w-full"
                                                            labelId="gender-label"
                                                            id="gender"
                                                            value={currentCharacter.gender}
                                                            onChange={handleGenderChange}
                                                            input={<OutlinedInput id="select-gender-chip" label="Geschlecht" />}
                                                            renderValue={(selected) => (
                                                                <Chip key={selected} label={selected} />
                                                            )}
                                                        >
                                                            {["male", "female"].map((name) => (
                                                                <MenuItem
                                                                    key={name}
                                                                    value={name}
                                                                >
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <InputLabel id="demo-multiple-chip-label">Rasse</InputLabel>
                                                        <Select
                                                            className="bg-white w-full"
                                                            labelId="demo-multiple-chip-label"
                                                            id="demo-multiple-chip"
                                                            multiple
                                                            value={currentCharacter.race ? currentCharacter.race.split(",") : []}
                                                            onChange={handleRaceChange}
                                                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                        >
                                                            {Character.races.map((name) => (
                                                                <MenuItem
                                                                    key={name}
                                                                    value={name}
                                                                >
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <InputLabel id="class-label">Klasse</InputLabel>
                                                        <Select
                                                            className="bg-white w-full"
                                                            labelId="class-label"
                                                            id="class"
                                                            multiple
                                                            value={currentCharacter.character_class ? currentCharacter.character_class.split(",") : []}
                                                            onChange={handleClassChange}
                                                            input={<OutlinedInput id="select-class-chip" label="Klasse" />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                        >
                                                            {Character.characterClasses.map((name) => (
                                                                <MenuItem
                                                                    key={name}
                                                                    value={name}
                                                                >
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <InputLabel id="weapon-label">Waffen</InputLabel>
                                                        <Select
                                                            className="bg-white w-full"
                                                            labelId="weapon-label"
                                                            id="weapon"
                                                            multiple
                                                            value={currentCharacter.weapon ? currentCharacter.weapon.split(",") : []}
                                                            onChange={handleWeaponChange}
                                                            input={<OutlinedInput id="select-weapon-chip" label="Waffen" />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                        >
                                                            {Character.weapons.map((name) => (
                                                                <MenuItem
                                                                    key={name}
                                                                    value={name}
                                                                >
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>

                                                    <div className="flex flex-col space-y-4">
                                                        <button type="submit" className="text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="story">
                                        <form onSubmit={saveCharacter} className="max-w-[1200px] min-w-[60%]  p-5">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex flex-col space-y-4">
                                                    <div>
                                                        <TextField
                                                            style={{ marginBottom: "10px" }}
                                                            id="prompt"
                                                            label="Prompt"
                                                            multiline
                                                            rows={4}
                                                            fullWidth
                                                            value={currentCharacter.prompt}
                                                            onChange={handlePromptChange}
                                                        />

                                                        <TextField
                                                            id="story"
                                                            label="Story"
                                                            multiline
                                                            rows={18}
                                                            fullWidth
                                                            value={currentCharacter.story}
                                                            onChange={handleStoryChange}

                                                        />
                                                    </div>
                                                    <button type="submit" className="text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
                                                    <button onClick={createPrompt} className="text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Prompt</button>
                                                    <button onClick={createStory} className="text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Story</button>
                                                </div>
                                            </div>
                                        </form>
                                    </TabPanel>
                                    <TabPanel value="images">
                                        <form onSubmit={saveCharacter} className="max-w-[1200px] min-w-[60%]  p-5">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex flex-col space-y-4">
                                                    <div>
                                                        <TextField
                                                            style={{ marginBottom: "10px" }}
                                                            id="image_prompt"
                                                            label="Prompt"
                                                            multiline
                                                            rows={4}
                                                            fullWidth
                                                            value={currentCharacter.image_prompt}
                                                            onChange={handleImagePromptChange}
                                                        />
                                                    </div>
                                                    <button type="submit" className="text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
                                                    <button onClick={createImagePrompt} className="text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Prompt</button>
                                                    <button onClick={createImage} className="text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Image</button>
                                                </div>
                                                <div className="flex flex-1 justify-center" >
                                                    <Carousel dynamicHeight={false} style={{ height: "500px" }} onClickItem={(index, item) => { window.open("http://127.0.0.1:8000/images/generated/" + useAuthStore.getState().user().user_id + "/" + characterImages[index].filename) }}>
                                                        {
                                                            characterImages.map((image) => {
                                                                let path = "http://127.0.0.1:8000/images/generated/" + useAuthStore.getState().user().user_id + "/" + image.filename
                                                                return (
                                                                    <div key={"image-" + image.id} title="Open in new tab">
                                                                        <img style={{ objectFit: "cover" }} src={path} />
                                                                        <p className="legend">{image.prompt}</p>
                                                                    </div>
                                                                )
                                                            })}

                                                    </Carousel>
                                                </div>
                                            </div>
                                        </form>
                                    </TabPanel>
                                </TabContext>
                            </div>

                        </div>
                    </div>

                </div>
                <div style={{ visibility: loading ? "visible" : "hidden" }} className="w-full h-full absolute top-0 right-0 bottom-0 left-0 bg-black opacity-50 flex items-center justify-center z-10">
                    <h1 style={{ fontSize: "100px" }}>LOADING...</h1>

                </div>
            </div>
        </section>

    );
};

export default App