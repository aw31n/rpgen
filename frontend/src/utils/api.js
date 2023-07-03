import { enqueueSnackbar } from "notistack";
import useAxios from "./useAxios";

const api = useAxios()

export const getCharacters = async () => {
    try {
        const { data, status } = await api.get('characters/');
        console.log(status, data)
        if (status == 200)
            return data

    } catch (error) {
        console.log(error)
    }
};

export const saveCharacter = async (character) => {
    let result
    if (character.id)
        result = await api.put(('characters/' + character.id) + "/", character)
    else
        result = await api.post('characters/', character)

    const {data, status} = result
    console.log(status, data)

    if (status == 200)
        return data
    enqueueSnackbar(JSON.stringify(data), { variant: "error"})
};
