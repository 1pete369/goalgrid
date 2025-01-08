export function validateHabitDuration(duration : number){
    if(duration>0){
        return ""
    }
    return "Duration must be atleast 1 day!"
}

export function validateHabitDescription(description : string){
    if(description.length>0){
        return ""
    }
    return "Enter Habit description"
}

export function validateHabitName(name : string){
    if(name.length>0){
        return ""
    }
    return "Enter Habit name"
}

