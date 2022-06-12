// import "./index.css";
import "./style.css"
import { useRef, useState } from 'react'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import {  useNavigate   } from 'react-router'

const cloudinarypreset = process.env.REACT_APP_CLOUDINARYPRESET
export const FormComponent = () => {
    const navigate = useNavigate ()
    const inputfile = useRef()
    const [filetype, setfiletype] = useState("audio")
    const [fileerror, setfileerror] = useState("")

    const [locationName, setLocationName] = useState("")
    const [locationError, setLocationError] = useState(false)

    const [address, setAddress] = useState("")
    const [addressError, setAddressError] = useState(false)

    const [googleMapLink, setGoogleMapLink] = useState("")
    const [googleMapError, setgoogleMapError] = useState(false)

    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")

    const [description, setDescription] = useState("")
    const [descriptionError, setDescriptionError] = useState(false)

    const [emailbody, setemailbobody] = useState("")
    const [emailBodyError, setEmailBodyError] = useState(false)

    const [daterange, setdaterange] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: 'selection',
    })


    const setselectedfiletype = (filetype) => {
        setfiletype(filetype)
    }

    const checkFileOnSelectingRadioInput = (curmediatype) => {
        if (inputfile.current.files.length === 1) {
            const selectedfile = inputfile.current.files[0]
            const { type } = selectedfile
            const errorMessage = `Please select file of ${curmediatype} type`
            if (!type.includes(curmediatype)) {
                setfileerror(errorMessage)
            } else {
                setfileerror("")
            }
        }
    }

    const checkAllFieldsAndSetErrors = () => {
        const locationnameerror = setandcheckValueForFieldAndError(locationName, setLocationName, setLocationError)
        const addressError = setandcheckValueForFieldAndError(address, setAddress, setAddressError)
        const googleMapLinkError = setandcheckValueForFieldAndError(googleMapLink, setGoogleMapLink, setgoogleMapError)
        const descriptionError = setandcheckValueForFieldAndError(description, setDescription, setDescriptionError)
        const emailError = setandcheckValueForFieldAndError(email, setEmail, setEmailError, true)
        const emailBodyError = setandcheckValueForFieldAndError(emailbody, setemailbobody, setEmailBodyError)
        const selectedFileError = checkUserCurrentFileError()
        const errorIsThereInForm = locationnameerror || addressError || googleMapLinkError || descriptionError || emailError || emailBodyError || selectedFileError
        return errorIsThereInForm
    }

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
    const saveDetails = async (e) => {
        e.preventDefault()
        const errorIsThereInForm = checkAllFieldsAndSetErrors()
        if (errorIsThereInForm) {
            return
        }
        const filetobeuploaded = inputfile.current.files[0]
        const {startDate, endDate} = daterange
        const data = new FormData()
        data.append("file", filetobeuploaded)
        
        data.append("upload_preset", cloudinarypreset)
        const base64urlmediaurl = await getBase64(filetobeuploaded)
        
        const payloadData = {base64urlmediaurl, locationName, address, googleMapLink, description, email, emailbody, filetype, startDate, endDate}
        const uploadeddataJSON = await fetch('https://details-store.herokuapp.com', { method: "post", body: JSON.stringify(payloadData), headers: {
            'Content-Type': 'application/json'
          } })
        const uploadeddata = await uploadeddataJSON.json()
        const {saveddetails:{_id}} = uploadeddata
        const redirectlink = `/details/${_id}`
        navigate(redirectlink)

    }

    const checkUserCurrentFileError = () => {
        if (inputfile.current.files.length === 0) {
            setfileerror("Please select a media file")
            return true
        }

        const selectedfile = inputfile.current.files[0]

        const { size, type } = selectedfile
        const sizeLimit = 5242880 // 5 MB
        if (size > sizeLimit) {
            setfileerror("You cannot select a file of greater than 5 MB")
            return true
        }

        const errorMessage = `The selected file is not of ${filetype} type`
        if (!type.includes(filetype)) {
            setfileerror(errorMessage)
            return true
        }

        return false
    }

    const setandcheckValueForFieldAndError = (value, setvaluefunction, errorSettingFunction, validateemail) => {
        let isAnyErrorPresent = false
        setvaluefunction(value)
        if (value.trim() === "") {
            const error = validateemail ? "Email is required" : true
            errorSettingFunction(error)
            isAnyErrorPresent = true
        } else {
            if (validateemail) {
                const regx = /^([a-z0-9\.-]+)@([a-z0-9-]+).([a-z]{2,8})(.[a-z]{2,8})?$/
                if (regx.test(value) === false) {
                    errorSettingFunction("Email provided is not proper")
                    return true
                }
            }
            const noeerror = validateemail ? "" : false
            errorSettingFunction(noeerror)
        }

        return isAnyErrorPresent
    }

    return (
        <>
            <div className="text-center mt-3">
                <form onSubmit={saveDetails}>

                    <div className="d-flex justify-content-center">
                        <h3>Form</h3>
                    </div>

                    <div className="d-flex justify-content-center mt-3 align-items-center">

                        <div className="position-relative pb-4">
                            <label>Location Name:</label>
                            <input onBlur={(e) => setandcheckValueForFieldAndError(e.target.value, setLocationName, setLocationError)} onChange={(e) => setandcheckValueForFieldAndError(e.target.value, setLocationName, setLocationError)} value={locationName} placeholder="Enter Location name" type="text" className="form-control" />
                            {locationError && <span className="error-text">Location name is required</span>}
                        </div>

                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <div className="position-relative pb-4">
                            <label>Address:</label>
                            <textarea onBlur={(e) => setandcheckValueForFieldAndError(e.target.value, setAddress, setAddressError)} onChange={(e) => setandcheckValueForFieldAndError(e.target.value, setAddress, setAddressError)} value={address} placeholder="enter address" className="form-control" />
                            {addressError && <span className="error-text">Address name is required</span>}
                        </div>

                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <div className="position-relative pb-4">
                            <label>Google Map Link</label>
                            <input onBlur={(e) => setandcheckValueForFieldAndError(e.target.value, setGoogleMapLink, setgoogleMapError)} onChange={(e) => setandcheckValueForFieldAndError(e.target.value, setGoogleMapLink, setgoogleMapError)} value={googleMapLink} placeholder="Enter Google Map Link" type="text" className="form-control" />
                            {googleMapError && <span className="error-text">Google Map Link is required</span>}

                        </div>
                    </div>

                    <DateRangePicker
                        ranges={[daterange]}
                        onChange={item => setdaterange(item.selection)}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        direction="horizontal"
                        retainEndDateOnFirstSelection={true}
                    />

                    <div className="d-flex justify-content-center mt-3">
                        <div className="position-relative pb-4">
                            <div className="d-flex">
                                <div className="me-3">
                                    Select Media
                                </div>

                                <div className="form-check me-3">
                                    <input onClick={() => checkFileOnSelectingRadioInput("audio")} onChange={() => setselectedfiletype("audio")} className="form-check-input" type="radio" name="media" checked={filetype === "audio"} />
                                    <label className="form-check-label" >
                                        Audio
                                    </label>
                                </div>

                                <div className="form-check me-3">
                                    <input onClick={() => checkFileOnSelectingRadioInput("image")} onChange={() => setselectedfiletype("image")} className="form-check-input" type="radio" name="media" checked={filetype === "image"} />
                                    <label className="form-check-label" >
                                        Image
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input onClick={() => checkFileOnSelectingRadioInput("video")} onChange={() => setselectedfiletype("video")} className="form-check-input" type="radio" name="media" checked={filetype === "video"} />
                                    <label className="form-check-label" >
                                        Video
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <div className="position-relative pb-4">
                            <label className="me-3">Select a file:</label>
                            <input ref={inputfile} onChange={checkUserCurrentFileError} type="file" name="myfile" ></input>
                            <span className="error-text">{fileerror}</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <div className="position-relative pb-4">
                            <label>Description</label>
                            <textarea onBlur={(e) => setandcheckValueForFieldAndError(e.target.value, setDescription, setDescriptionError)} onChange={(e) => setandcheckValueForFieldAndError(e.target.value, setDescription, setDescriptionError)} value={description} placeholder="Enter description" className="form-control" />
                            {descriptionError && <span className="error-text">Description is required</span>}
                        </div>

                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <div className="position-relative pb-4">
                            <label>Email</label>
                            <input onBlur={(e) => setandcheckValueForFieldAndError(e.target.value, setEmail, setEmailError, true)} onChange={(e) => setandcheckValueForFieldAndError(e.target.value, setEmail, setEmailError, true)} value={email} placeholder="Email ID" type="email" className="form-control" />
                            <span className="error-text">{emailError}</span>
                        </div>

                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <div className="position-relative pb-4">
                            <label>Email body:</label>
                            <textarea onBlur={(e) => setandcheckValueForFieldAndError(e.target.value, setemailbobody, setEmailBodyError)} onChange={(e) => setandcheckValueForFieldAndError(e.target.value, setemailbobody, setEmailBodyError)} value={emailbody} placeholder="enter email body" className="form-control" />
                            {emailBodyError && <span className="error-text">Email body is required</span>}

                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 mb-3" >Submit</button>
                </form>
            </div>
        </>
    )
}