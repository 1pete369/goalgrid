export function validateGoalDescription(description : string){
    if(description.length>0){
        return ""
    }
    return "Enter Goal description"
}

export function validateGoalName(name : string){
    if(name.length>0){
        return ""
    }
    return "Enter Goal name"
}

