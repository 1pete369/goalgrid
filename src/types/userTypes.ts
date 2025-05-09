export type MainUserObject = {
  uid: string,
  personalInfo : {
    email : string,
    name : string,
    username : string,
    photoURL : string,
    provider : string,
    isEmailVerified : boolean,
    dob : string,
    profession ?: string,
    intendedUseCases ?: string[],
    referralSource ?: string,
    gender ?: string
  },
  progress: {
    xp: number,
    tokens: number,
    level: number,
    streak: number,
    dailyRewardsClaimed: [{
      date: Date, // Date of reward claim
      rewards: string[] // Array of rewards claimed that day
    }]
  },
  isOnboardingComplete : boolean,
  customData : {
    timezone : {
      timezoneName: string,
      countryCode : string
    },
    preferences : {
      notification : boolean
    },
    streak : number,
    goals : string[],
    days : string [],
    friends: string[],
    subscription : string
  },
  updates : {
    profileUpdatedAt : Date
  },
  timings : {
    createdAt : string,
    lastLoginAt : string
  }
}

export type onBoardingDataType = {
    name : string,
    username : string,
    dob : string,
    gender : string,
    profession : string,
    referralSource : string,
    intendedUseCases : string[]
}