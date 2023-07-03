import React, { useState } from 'react';
import Character from '../../models/Character';
import * as Api from '../../utils/api';
import { enqueueSnackbar } from 'notistack';

const CharacterForm = (props) => {

    const [character, setCharacter] = useState(new Character(props.character))
    console.log("new form", props.character, character)

    // console.log("character", character, JSON.stringify(character))

    const loadCharacters = (e) => {
        e.preventDefault();
        console.log("LOADING", character)
        Api.getCharacters()
    }

    const saveCharacter = async (e) => {
        e.preventDefault();
        console.log("SAVING", character)
        try {
            let data = await Api.saveCharacter(character)
            console.log(data)
            setCharacter(new Character(data))
        }
        catch (e) {
            console.log(e)
            enqueueSnackbar(e.response.data.detail, { variant: "error"} )
        }
    }

console.log("NEW FORM REPAINT", character)
    return (
        <form onSubmit={saveCharacter}>
            <input type="hidden" name="id" value={character.id} />
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input type="text" id="name" name="name" value={character.name} onChange={(e) => setCharacter({ ...character, name: e.target.value}) } className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required="" />
            </div>
            <div className="flex">
            <button onClick={loadCharacters} className="w-full text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Load</button>
            <button type="submit" className="w-full text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
            </div>
        </form>
    )

}


export default CharacterForm