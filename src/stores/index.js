import{defineStore} from "pinia";
import {reactive} from "vue";
export const useUserStore=defineStore("user", ()=>{
        const user=reactive({
                id:0,
                username:"",
                ico:"",
                email:"",
                roleId:0,
                flag:0
        })
        return {user}
})