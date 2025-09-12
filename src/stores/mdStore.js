import { defineStore } from 'pinia'
import { reactive } from 'vue'

import { magicDice } from "@/assets/md_magicdie"

export const useMagicDice = defineStore('md', () => {
    // THE NEW WAY TO DO THINGS. WE USED TO IMPORT THE MAGIC DICE SCRIPT DIRECTLY AS A GLOBAL VARIABLE BUT THAT SUCKS SO NOW WE USE A PINIA STORE AND JUST USE THAT TO LOAD THE SCRIPT INSTEAD
    // YIPEE

    const md = reactive(magicDice);

    return { md };
})