import {ChangeEvent, useRef,useState} from 'react'
import {BsEye,BsEyeSlash} from 'react-icons/bs'
import {IoMdClose} from 'react-icons/io'

// Dcrypt Component
import DecryptComponent from './Dcrypt'

function App() {

  const input_ref = useRef<HTMLInputElement>(null)
  const [selectFile, setSelectFile] = useState<File | null>(null)
  const [KeyText, setKeyText] = useState<string | null>(null)
  const [ViewPassword, setViewPassword] = useState<boolean>(false)
  const [StateUpload, setStateUpload] = useState<number>(0)
  const [MessageAlers, setMessageAlerts] = useState< {message:string,show:boolean} | null >(null)
  const [UrlDownload, setUrlDownload] = useState<{url:string,name:string}>({name:'',url:''})
  // State Menu Button 
  const [StateMenuButton, setStateMenuButton] = useState<boolean>(false)


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file  = event.target.files?.[0] || null
    setSelectFile(file)
    
  }

  const handleFileUpload = async () => {

    if (StateUpload == 2){
      const res = await fetch(`http://localhost:8000${UrlDownload?.url}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Replace "example.txt" with the desired file name
      a.download = UrlDownload.name;

      // Append the anchor to the document and click it to trigger the download
      document.body.appendChild(a);
      a.click();

      // Remove the anchor element from the document
      document.body.removeChild(a);

      // Revoke the Blob URL to free up resources
      window.URL.revokeObjectURL(url);

      await fetch(`http://localhost:8000/download/encrypt/success/${UrlDownload.name}`)
      return
    }

   
    if(!KeyText){
      setMessageAlerts({message:"Ingrese la clave de encryptacion",show:true})
      return;
    }
    setStateUpload(1)
    if(selectFile) {

      const formData = new FormData()
      formData.append('file',selectFile)
      formData.append('key_text',KeyText)

      const res = await fetch('http://localhost:8000/upload_file',{
        method:"POST",
        body:formData
      })
      const data = await res.json()
      setStateUpload(2)
      setUrlDownload({
        name:data?.name,
        url:data?.url
      })
      // console.log(data)
    }
  }

  const handleFileUploadDecrypt = async () => {

    if(StateUpload == 2 ){
      const res = await fetch(`http://localhost:8000${UrlDownload?.url}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.download = UrlDownload.name
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      await fetch(`http://localhost:8000/download/decrypt/success/${UrlDownload.name}`)
      return
    }

    if(!KeyText){
      setMessageAlerts({message:"Ingrese la clave de encryptacion",show:true})
      return;
    }
    setStateUpload(1)

    if(selectFile) {

      const formData = new FormData()
      formData.append('file',selectFile)
      formData.append('key_text',KeyText)

      const res = await fetch('http://localhost:8000/decrypt_file',{
        method:"POST",
        body:formData
      })
      const data = await res.json()
      setStateUpload(2)
      setUrlDownload({
        name:data?.name,
        url:data?.url
      })
      // console.log(data)
    }
  }
  
  const handleClickCloseAlert = () => setMessageAlerts(null)
  
  const handleChangeKeyText = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeyText(value)
  }

  // 
  const handleChangeViewPassword = () => {
    setViewPassword(prev => !prev)
  }

  const handleChangeButtonMenu = () => {
    setStateMenuButton(prev => !prev)
    setStateUpload(0)
    setSelectFile(null)
  }


  return (
    <div className="overflow-hidden w-full min-h-screen font-sans bg-gray-900">
      <div className="relative">
        <div className="relative py-10 px-8 mx-auto max-w-7xl">
          <nav className="flex justify-between items-center">
            <a href="#" className="text-2xl font-semibold text-white">{StateMenuButton ? "Decrypt File" : "Encrypt File"}</a>
              <button className="hidden py-3 px-6 font-medium tracking-wider leading-5 text-white rounded-md border-2 border-gray-800 transition md:inline-block hover:bg-teal-300 hover:text-gray-900 hover:shadow-lg" onClick={handleChangeButtonMenu} >
               {!StateMenuButton ? "Decrypt File" : "Encrypt File" }
              </button>
          </nav>
        </div>

        <div className="relative py-10 px-8 mx-auto max-w-7xl">
          <div className="flex flex-col gap-y-12 md:flex-row">
            <div className="md:w-1/2">
              {MessageAlers?.show && (
                <div className="w-full bg-red-500 flex flex-col px-2 py-2 rounded-md mb-4">
                  <div className="flex justify-between flex-row-Jreverse">
                    {/* Icon Close */}
                    <IoMdClose className="text-white/50 text-xl cursor-pointer hover:text-white transition duration-200" onClick={handleClickCloseAlert} />
                    {/* Title */}
                    <span className='text-white font-bold'>Error</span>
                  </div>
                  {/* Body */}
                  <span className='text-white'>{MessageAlers.message}</span>
                </div>
              )}
              {
                StateMenuButton ? (
                  <DecryptComponent ViewPassword={ViewPassword} handleChangeKeyText={handleChangeKeyText} handleChangeViewPassword={handleChangeViewPassword} handleFileChange={handleFileChange}  selectFile={selectFile} input_ref={input_ref} />
                ):(
                  <>
                      {/* Form */}
                      <form action="">
                        {/* TODO: From-Control */}
                        <div className="flex flex-col mb-4 relative">
                          <label htmlFor="key_text" className='text-white text-xl'>Key Text</label>
                          {ViewPassword ? (
                            <BsEyeSlash  className="text-white text-xl absolute bottom-2 right-2 cursor-pointer"  onClick={handleChangeViewPassword} />
                            ):(
                              <BsEye className="text-white text-xl absolute bottom-2 right-2 cursor-pointer" onClick={handleChangeViewPassword} />
                          )}
                          <input type={ViewPassword ? "text" : "password"} name="" id="key_text" className='border-none shadow appearance-none outline-none	 rounded w-full py-2 px-3 pr-8 text-white leading-tight  bg-gray-800' onChange={handleChangeKeyText} />
                        </div>
                        {/* TODO: Control Form */}
                        <div className="md:rounded-md md:w-full md:h-32 rounded-md overflow-hidden mb-4">
                          <input className="hidden" ref={input_ref} type="file" name="file" onChange={handleFileChange} />
                          <div className=" text-white  flex justify-center items-center w-full h-full bg-gray-800 hover:cursor-pointer  transition duration-300 cursor-pointer group hover:bg-white" onClick={() => {
                            input_ref.current?.click()
                          }}>
                            <span className='inline-block  text-2xl font-medium tracking-wide text-white transition duration-300  group-hover:text-gray-800 '>{selectFile ? selectFile.name : "Upload File" }</span>
                          </div>
                        </div>
                        </form>
                  </>
                )
              }
              <div className="w-full ">
                {/* Button Download File */}
                <button type="button" className='inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-green-500 hover:bg-green-400 transition ease-in-out duration-150 hover:cursor-pointer' onClick={StateMenuButton ? handleFileUploadDecrypt : handleFileUpload }>
                  {StateUpload == 1 && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  )}
                
                  {StateUpload == 0 ? "Send File" :  StateUpload == 1 ? "Processing..." : "Download File Encrypted"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
