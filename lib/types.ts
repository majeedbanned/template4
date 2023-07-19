import { string } from "zod";

export interface UserProps {
    id: bigint;
    mahd_name: string,
    username: bigint,
    pass: string,
    rooztavalod: string,
    school_code: string,
    maghta: bigint,
    domdom: string,
    maghtatbl:{
      name:string
    }
  }
  export interface StoreProps{
    pelak:string
    nov:string
    name:string
    metraj:number
    bazar:string
    tabagh:string
    rahro:string
    tel1:string
    tel2:string
    cposti:string
    rent:number
    active:boolean
    checkgift:boolean

    checkrol:number
    tahvil:string
    tovzeh:string

  }