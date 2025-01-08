import { checkUserNameExist } from "../users"

export function validateName(name : string) {
    if(name.length<3){
        return "Name should be atleast 3 letters"
    }
    return ""
}

export async function validateUserName(username: string){
    const result = /^[a-zA-Z0-9_]+$/.test(username)
    if(!result){
      return "only alphanumeric chars and _ allowed"
    }
    if(username.length<8){
        return "username should be atleast 8 chars"
    }
    if(username.length>=8){
       if(await checkUserNameExist(username)){
        return "username already exists!"
       } 
    }
    return ""
}

export function validateDob(dob: string){
    const today=new Date()
    const minAge = 13
    today.setFullYear(today.getFullYear()-minAge)
    const [minYear,minMonth,minDay] = [
        today.getFullYear(),
        today.getMonth()+1,
        today.getDate()
    ]
    const [userYear,userMonth,userDay] = dob.split("-").map(Number)

    if(
        userYear<minYear ||
        (userYear=== minYear && userMonth<minMonth)||
        (userYear===minYear && userMonth===minMonth && userDay<=minDay)
    ){
        return ""
    }
    return "Must be at least 13 years old"
}

export function validateProfession(profession : string){
    if(profession.length<3){
        return "Type atleast 3 chars"
    }
    return ""
}

export function validateReferralSource(referralSource : string){
    if(referralSource.length<3){
        return "Type atleast 3 chars"
    }
    return ""
}


