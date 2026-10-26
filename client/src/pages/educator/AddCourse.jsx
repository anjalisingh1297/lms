import React, { act } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { useEffect, useRef, useState } from 'react'
import { assets } from '../../assets/assets'

const AddCourse = () => {

  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState(
    {
      lectureTitle: '',
      lectureDuration: '',
      lectureURL: '',
      isPreviewFree: false,
    }
  )

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:')
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      )
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1)
          }
          return chapter
        })
      )
    }
  }

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid()
          }
          chapter.chapterContent.push(newLecture)
        }
        return chapter
      })
    )

    setShowPopup(false)

    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureURL: '',
      isPreviewFree: false,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })
    }
  }, [])

  return (
    <div className='min-h-screen overflow-y-auto flex flex-col items-start md:p-8 p-4 pt-8'>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-5 max-w-4xl w-full text-gray-500'
      >

        {/* Course Title */}
        <div className='flex flex-col gap-1'>
          <p className='font-medium text-gray-700'>Course Title</p>

          <input
            onChange={e => setCourseTitle(e.target.value)}
            value={courseTitle}
            type='text'
            placeholder='Type here'
            className='outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-blue-400 w-full'
            required
          />
        </div>

        {/* Course Description */}
        <div className='flex flex-col gap-1'>
          <p className='font-medium text-gray-700'>Course Description</p>

          <div
            ref={editorRef}
            className='border border-gray-300 rounded bg-white min-h-32'
          ></div>
        </div>

        {/* Price + Thumbnail */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>

          <div className='flex flex-col gap-1'>
            <p className='font-medium text-gray-700'>Course Price</p>

            <input
              onChange={e => setCoursePrice(e.target.value)}
              value={coursePrice}
              type='number'
              placeholder='0'
              className='outline-none py-2.5 px-3 rounded border border-gray-300 w-40 focus:border-blue-400'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <p className='font-medium text-gray-700'>Course Thumbnail</p>

            <label
              htmlFor='thumbnailImage'
              className='flex items-center gap-3 cursor-pointer'
            >
              <img
                src={assets.file_upload_icon}
                alt=''
                className='p-3 bg-blue-500 rounded-lg w-12 h-12'
              />

              <input
                type='file'
                id='thumbnailImage'
                onChange={e => setImage(e.target.files[0])}
                accept='image/*'
                hidden
              />

              {image && (
                <img
                  className='h-12 w-20 object-cover rounded border'
                  src={URL.createObjectURL(image)}
                  alt=''
                />
              )}
            </label>
          </div>

        </div>

        {/* Discount */}
        <div className='flex flex-col gap-1'>
          <p className='font-medium text-gray-700'>Discount %</p>

          <input
            onChange={e => setDiscount(e.target.value)}
            value={discount}
            type='number'
            placeholder='0'
            min={0}
            max={100}
            className='outline-none py-2.5 px-3 rounded border border-gray-300 w-40 focus:border-blue-400'
            required
          />
        </div>

        {/* Chapters */}
        <div className='flex flex-col gap-4'>

          {chapters.map((chapter, chapterIndex) => (

            <div
              key={chapterIndex}
              className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm'
            >

              {/* Chapter Header */}
              <div className='flex items-center justify-between gap-3 p-4 border-b border-gray-200'>

                <div className='flex items-center min-w-0'>
                  <img
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.down_icon}
                    width={14}
                    alt=''
                    className={`mr-3 cursor-pointer transition-all ${
                      chapter.collapsed ? '-rotate-90' : ''
                    }`}
                  />

                  <span className='font-semibold text-gray-700 truncate'>
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>

                <div className='flex items-center gap-4 shrink-0'>

                  <span className='text-sm text-gray-500'>
                    {chapter.chapterContent.length} Lectures
                  </span>

                  <img
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                    src={assets.cross_icon}
                    alt=''
                    className='w-4 h-4 cursor-pointer'
                  />

                </div>

              </div>

              {/* Lectures */}
              {!chapter.collapsed && (

                <div className='p-4'>

                  {chapter.chapterContent.map((lecture, lectureIndex) => (

                    <div
                      key={lectureIndex}
                      className='flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0'
                    >

                      <span className='text-sm text-gray-600 truncate'>
                        {lectureIndex + 1}. {lecture.lectureTitle}
                        {' - '}
                        {lecture.lectureDuration} mins
                        {' - '}

                        <a
                          href={lecture.lectureURL}
                          target='_blank'
                          rel='noreferrer'
                          className='text-blue-500 hover:underline'
                        >
                          Link
                        </a>

                        {' - '}
                        {lecture.isPreviewFree
                          ? 'Free Preview'
                          : 'Paid'}
                      </span>

                      <img
                        src={assets.cross_icon}
                        alt=''
                        onClick={() =>
                          handleLecture(
                            'remove',
                            chapter.chapterId,
                            lectureIndex
                          )
                        }
                        className='w-4 h-4 cursor-pointer shrink-0'
                      />

                    </div>

                  ))}

                  {/* Add Lecture */}
                  <div
                    className='inline-flex bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded cursor-pointer mt-3 text-sm'
                    onClick={() =>
                      handleLecture('add', chapter.chapterId)
                    }
                  >
                    + Add Lecture
                  </div>

                </div>

              )}

            </div>

          ))}

          {/* Add Chapter */}
          <div
            className='flex justify-center items-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 p-3 rounded-lg cursor-pointer font-medium transition'
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </div>

          {/* Lecture Popup */}
          {showPopup && (

            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'>

              <div className='bg-white text-gray-700 p-6 rounded-lg relative w-full max-w-md shadow-xl'>

                <h2 className='text-xl font-semibold mb-5'>
                  Add Lecture
                </h2>

                {/* Lecture Title */}
                <div className='mb-3'>
                  <p className='text-sm font-medium'>Lecture Title</p>

                  <input
                    type='text'
                    className='mt-1 block w-full border border-gray-300 rounded py-2 px-3 outline-none focus:border-blue-400'
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value
                      })
                    }
                  />
                </div>

                {/* Duration */}
                <div className='mb-3'>
                  <p className='text-sm font-medium'>Duration (minutes)</p>

                  <input
                    type='text'
                    className='mt-1 block w-full border border-gray-300 rounded py-2 px-3 outline-none focus:border-blue-400'
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value
                      })
                    }
                  />
                </div>

                {/* URL */}
                <div className='mb-3'>
                  <p className='text-sm font-medium'>Lecture URL</p>

                  <input
                    type='text'
                    className='mt-1 block w-full border border-gray-300 rounded py-2 px-3 outline-none focus:border-blue-400'
                    value={lectureDetails.lectureURL}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureURL: e.target.value
                      })
                    }
                  />
                </div>

                {/* Preview */}
                <div className='flex items-center gap-3 my-4'>
                  <p className='text-sm font-medium'>
                    Is Preview Free?
                  </p>

                  <input
                    type='checkbox'
                    className='scale-125 cursor-pointer'
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked
                      })
                    }
                  />
                </div>

                <button
                  type='button'
                  className='w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded transition'
                  onClick={addLecture}
                >
                  Add
                </button>

                <img
                  onClick={() => setShowPopup(false)}
                  src={assets.cross_icon}
                  className='absolute top-5 right-5 w-4 cursor-pointer'
                  alt=''
                />

              </div>

            </div>

          )}

        </div>

        {/* Submit */}
        <button
          type='submit'
          className='bg-black hover:bg-gray-800 text-white w-max py-2.5 px-8 rounded my-4 transition'
        >
          ADD
        </button>

      </form>

    </div>
  )
}

export default AddCourse


