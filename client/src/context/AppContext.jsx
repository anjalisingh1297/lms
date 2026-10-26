import { createContext } from 'react'
import { useState, useEffect } from 'react'
import { dummyCourses } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import humanizeDuration from 'humanize-duration'

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()


    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])


    // function to caclulate average rating of a course
const calculateRating = (course) => {
    if (!course.courseRating || course.courseRating.length === 0) {
        return 0
    }

    let totalRating = 0

    course.courseRating.forEach((rating) => {
        totalRating += rating.rating
    })

    return totalRating / course.courseRating.length
}

// function to calculate course chapter time
const calculateChapterTime = (chapter)=>{
    let time = 0 
    chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
}

// function to calculate course duration
const calculateCourseDuration = (course)=>{
    let time = 0 

    course.courseContent.map((chapter)=> chapter.chapterContent.map(
        (lecture) => time += lecture.lectureDuration
    ))
    return humanizeDuration(time * 60 * 1000, {units: ["h", "m" ]})
}

// function calculate to no of lectures in the course
const calculateNoOfLectures = (course)=>{
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
        if(Array.isArray(chapter.chapterContent)){
            totalLectures += chapter.chapterContent.length;
        }
    });
    return totalLectures;
}

// fetch user enrolled courses
const fetchUserEnrolledCourses = async ()=>{
    setEnrolledCourses(dummyCourses)
}

    // fetch all courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }

    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, [])

    const value = {
        currency,
        allCourses, 
        navigate, 
        calculateRating, setIsEducator, isEducator, calculateNoOfLectures, calculateCourseDuration, calculateChapterTime, enrolledCourses, fetchUserEnrolledCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

