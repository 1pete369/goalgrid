
export function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const result =regex.test(email)
  if(!result){
    return "Enter valid email format!"
  }
  return ""
}

export function validatePassword(password: string){
    if(password.length<8){
        return "Password must be atleast 8 chars"
    }
    return ""
}

export function validateConfirmPassword(password: string, confirmPassword : string){
    if(password!==confirmPassword){
        return "Both passwords must be same"
    }
    return ""
}

