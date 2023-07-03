import * as Api from '../utils/api';
import useAxios from "../utils/useAxios";

const api = useAxios()

export default class Character {
    constructor(data = {}) {
        this.set(data)
    }

    static races = [
        "Human",
        "Elf",
        "Dwarf",
        "Orc",
        "Troll"
    ]

    static characterClasses = [
        "Warrior",
        "Paladin",
        "Wizard",
        "Bard",
        "Druid",
        "Priest"
    ]

    static weapons = [
        "Sword",
        "Axe",
        "Wizard Staff",
        "Mace",
        "Dagger",
        "Bow",
        "Crossbow",
        "Rapier"
    ]

    set(data) {
        this.id = data.id || ''
        this.name = data.name || ''
        this.story = data.story || ''
        this.race = data.race || ''
        this.gender = data.gender || ''
        this.weapon = data.weapon || ''
        this.prompt = data.prompt || ''
        this.character_class = data.character_class || ''
        if (data.owner) {
            if (typeof data.owner === 'object')
                this.owner = data.owner.id
            else
                this.owner = data.owner
        }
        this.owner = this.owner || ''
    }

    static async list() {
        const { data, status } = await api.get('characters/');
        if (status == 200)
            return data
    }

    async save() {
        try {
            let result
            if (this.id)
                result = await api.put(('characters/' + this.id) + "/", this)
            else
                result = await api.post('characters/', this)
        
            const {data, status} = result
        
            if (status == 200) {
                this.set(data)
                return true
            }
            throw "Could not save: " + JSON.stringify(data)
        }
        catch (e) {
            console.log(e)
            return false
        }
    }

    createStoryPrompt() {

        if (!this.race)
            throw "Can't create story without race"

        if (!this.character_class)
            throw "Can't create story without class"

        if (!this.gender)
            throw "Can't create story without gender"

        prompt = "Create the background story of a " + this.gender + " "
        const pronoun = this.gender == "male" ? "He" : "She"

        let classes = this.character_class.split(",")
        prompt += classes.join(" and ") + " from birth to early adulthood. "

        let races = this.race.split(",")
        if (races.length > 1)
            prompt += "The father is a " + races[0] + ", the mother is a " + races[1] + ". "
        else if (races.length == 1)
            prompt += pronoun + " is a " + races[0] + ". "

        if (this.name)
            prompt += " The name is " + this.name + ". "

        if (this.weapon)
            prompt += pronoun + " is an expert in using " + this.weapon.split(",").join(" and ") + ". "


        return prompt
    }

    async createStory(prompt = null) {
        if (!prompt)
            prompt = this.createStoryPrompt()
        let result = await api.post('openai/story/', new URLSearchParams({ "prompt": prompt }).toString(), )
        console.log(result.data)
        return result.data.story
    }
}