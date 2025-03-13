"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { onBoardingDataType } from "@/types/userTypes"
import { onBoardingStatus, updateOnBoardingDataToUser } from "@/utils/users"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import GetStartedCard from "../../AppComponents/cards/GetStartedCard"
import ProfessionCard from "../../AppComponents/cards/ProfessionCard"
import ReferralSourceCard from "../../AppComponents/cards/ReferralSourceCard"
import UsingForCard from "../../AppComponents/cards/UsingForCard"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useSession } from "next-auth/react"

export function OnBoarding() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { user } = useUserContext()

  const { toast } = useToast()

  const initialStep = parseInt(searchParams.get("step") || "1", 10)

  const [onBoardingData, setOnBoardingData] =
    useState<onBoardingDataType | null>(null)

  const [step, setStep] = useState(initialStep)

  const [onBoardingStatusToMount, setOnBoardingStatusToMount] = useState(null)

  // Initialize state
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [dob, setDob] = useState("")
  const [dobError, setDobError] = useState("")
  const [gender, setGender] = useState("male")
  const [profession, setProfession] = useState("")
  const [professionOption, setProfessionOption] = useState("")
  const [professionError, setProfessionError] = useState("")
  const [referralSource, setReferralSource] = useState("")
  const [referralSourceOption, setReferralSourceOption] = useState("")
  const [referralSourceError, setReferralSourceError] = useState("")
  const [intendedUseCases, setIntendedUseCases] = useState<string[]>([])
  const [proceed, setProceed] = useState(false)
  const {  update } = useSession()

  // Load data from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("onBoardingData")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setName(parsedData.name || "")
        setNameError(parsedData.nameError || "")

        setUsername(parsedData.username || "")
        setUsernameError(parsedData.usernameError || "")

        setDob(parsedData.dob || "")
        setDobError(parsedData.dobError || "")

        setGender(parsedData.gender || "male")

        setProfession(parsedData.profession || "")
        setProfessionError(parsedData.professionError || "")
        setProfessionOption(parsedData.professionOption || "")

        setReferralSource(parsedData.referralSource || "")
        setReferralSourceError(parsedData.referralSourceError || "")
        setReferralSourceOption(parsedData.referralSourceOption || "")

        setIntendedUseCases(parsedData.intendedUseCases || [])
      }
    }
  }, [])

  // Save data to localStorage on state change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const onBoardingData: onBoardingDataType = {
        name,
        username,
        dob,
        gender,
        profession,
        referralSource,
        intendedUseCases
      }

      setOnBoardingData(onBoardingData)

      const onBoardingDataLocalSaved = {
        name,
        nameError,
        username,
        usernameError,
        dob,
        dobError,
        gender,
        profession,
        professionError,
        professionOption,
        referralSource,
        referralSourceError,
        referralSourceOption,
        intendedUseCases
      }
      localStorage.setItem(
        "onBoardingData",
        JSON.stringify(onBoardingDataLocalSaved)
      )
      console.log("onBoardingData saved:", onBoardingDataLocalSaved)
    }
  }, [
    name,
    username,
    dob,
    gender,
    profession,
    referralSource,
    intendedUseCases
  ])

  // Update URL safely
  const updateUrl = (newStep: number) => {
    const currentStepInUrl = parseInt(searchParams.get("step") || "1", 10)
    if (newStep !== currentStepInUrl) {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set("step", newStep.toString())
      router.push(newUrl.toString(), { scroll: false })
    }
  }

  useEffect(() => {
    const currentStep = parseInt(searchParams.get("step") || "1", 10)
    if (currentStep !== step) {
      setStep(currentStep)
    }
  }, [searchParams, step])

  useEffect(() => {
    updateUrl(step)
  }, [step])

  useEffect(() => {
    if (step === 1) {
      setProceed(
        name !== "" &&
          username !== "" &&
          dob !== "" &&
          nameError === "" &&
          usernameError === "" &&
          dobError === ""
      )
    } else if (step === 2) {
      setProceed(
        profession !== "" && profession !== "other" && professionError === ""
      )
    } else if (step === 3) {
      setProceed(referralSource !== "" && referralSourceError === "")
    } else if (step === 4) {
      setProceed(intendedUseCases.length > 0)
    }
  }, [
    name,
    username,
    dob,
    nameError,
    usernameError,
    dobError,
    step,
    profession,
    professionError,
    referralSource,
    referralSourceError,
    intendedUseCases
  ])

  const handleNextStep = async () => {
    if (step < 4) {
      setStep((prev) => prev + 1)
    } else {
      if (onBoardingData && user) {
        await updateOnBoardingDataToUser(onBoardingData, user.uid)
        const onBoardingStatusFlag = await onBoardingStatus(user.uid)
        await update()
        toast({
          description: "OnBoarding Completed🎉",
          className: "bg-success text-white"
        })
        if (onBoardingStatusFlag) {
          redirect("/")
        }
      }
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1)
    }
  }

  useEffect( ()=>{
    const fetchOnBoardingStatus = async () => {
      if (user) {
        const onBoardingStatusFlag = await onBoardingStatus(user.uid)
        setOnBoardingStatusToMount(onBoardingStatusFlag)

        if (onBoardingStatusFlag) {
          // Redirect if the onboarding status flag is true
          redirect('/')
        }
      }
    }

    fetchOnBoardingStatus()
  },[user,onBoardingStatus])

  if(onBoardingStatusToMount===null){
    return <h1>Loading...</h1>
  }

  return (
    // <div className="container mx-auto flex flex-col min-h-[calc(100vh-75px)] p-8 md:p-24 select-none">
    <div className="container mx-auto flex flex-col min-h-[calc(100vh-75px)] p-8 md:p-24 select-none pt-[80px]">
      <Progress value={(step / 4) * 100} />
      {step === 1 && (
        <GetStartedCard
          name={name}
          setName={setName}
          gender={gender}
          setGender={setGender}
          username={username}
          setUsername={setUsername}
          dob={dob}
          setDob={setDob}
          nameError={nameError}
          setNameError={setNameError}
          usernameError={usernameError}
          setUsernameError={setUsernameError}
          dobError={dobError}
          setDobError={setDobError}
        />
      )}
      {step === 2 && (
        <ProfessionCard
          profession={profession}
          professionError={professionError}
          setProfession={setProfession}
          setProfessionError={setProfessionError}
          professionOption={professionOption}
          setProfessionOption={setProfessionOption}
        />
      )}
      {step === 3 && (
        <ReferralSourceCard
          referralSource={referralSource}
          setReferralSource={setReferralSource}
          referralSourceError={referralSourceError}
          setReferralSourceError={setReferralSourceError}
          referralSourceOption={referralSourceOption}
          setReferralSourceOption={setReferralSourceOption}
        />
      )}
      {step === 4 && (
        <UsingForCard
          intendedUseCases={intendedUseCases}
          setIntendedUseCases={setIntendedUseCases}
        />
      )}
      <div className="w-full flex justify-between md:justify-normal md:gap-20 mt-auto">
        <Button className="min-w-[100px]" onClick={handlePrevStep}>
          Prev
        </Button>
        <Button
          className="min-w-[100px]"
          disabled={!proceed}
          onClick={handleNextStep}
        >
          {step === 4 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}
