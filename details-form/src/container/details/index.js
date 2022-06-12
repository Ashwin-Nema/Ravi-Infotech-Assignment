import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import moment from 'moment';
import ReactPlayer from 'react-player'
import './index.css'
export const DetailsComponents = () => {
    const params = useParams();
    const [locationName, setLocationName] = useState("")
    const [googleMapLink, setGoogleMapLink] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [description, setDescription] = useState("")
    const [mediaLink, setMediaLink] = useState('')
    const [mediaType, setMediaType] = useState("")
    useEffect(() => {
        const { id } = params

        document.body.style.backgroundColor = "#82c1d2"

        async function getandsetdata() {
            const Jsondata = await fetch(`https://details-store.herokuapp.com/${id}`)
            const data = await Jsondata.json()
            setLocationName(data.data.locationName)
            setGoogleMapLink(data.data.googleMapLink)
            const startdate = moment(data.data.startDate).format("DD-MM-YYYY");
            setStartDate(startdate)
            const endDate = moment(data.data.endDate).format("DD-MM-YYYY")
            setEndDate(endDate)
            setDescription(data.data.description)
            setMediaLink(data.data.mediaurl)
            setMediaType(data.data.filetype)
        }
        getandsetdata()

        return () => {
            document.body.style.backgroundColor = "white"
        }
    }, [])
    return (
        <>
            <div className="text-white d-flex justify-content-center">
                <div>
                    <div className="my-5 space-between">
                        <div className="fs-1">
                            Pipeline
                        </div>
                        <div className="text-danger">
                            {locationName}
                        </div>
                    </div>

                    <div className="space-between mb-5">
                        <div className="text-primary fs-1 ">
                            <i class="bi bi-geo-alt-fill"></i>
                            <span className="fs-3">Location</span>
                        </div>
                        <div>
                        <a href={googleMapLink} target="_blank">Google Map Link</a>
                        </div>
                    </div>

                    <div className="mb-5 d-flex align-items-center">
                        <div className="text-dark fs-3 me-2">
                        <i class="bi bi-calendar-event"></i>
                        </div>
                        <div>
                            From - {startDate}   To - {endDate}
                        </div>

                    </div>

                    <div className="mb-5">
                        {description}
                    </div>
                    <div className={`player-wrapper ${mediaType == 'audio' && 'audio'}`}>
                        {mediaType !== 'image' && mediaType !== '' &&

                            <ReactPlayer
                                className='react-player'
                                url={mediaLink}
                                width='100%'
                                height='100%'
                                controls={true}
                            />
                        }

                        {mediaType === 'image' &&
                            <img src={mediaLink} alt="media" />

                        }
                    </div>
                </div>


            </div>
        </>
    )
}