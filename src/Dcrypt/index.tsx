import {FC, ChangeEvent} from 'react'
import {BsEye,BsEyeSlash} from 'react-icons/bs'

interface RefObject<T> {
    readonly current: T | null
}

interface IProps {
    input_ref: RefObject<HTMLInputElement | null>
    handleChangeViewPassword: () => void
    ViewPassword: boolean
    handleChangeKeyText: (e:ChangeEvent<HTMLInputElement>) => void
    handleFileChange: (e:ChangeEvent<HTMLInputElement>) => void;
    selectFile: File | null
}

const FormDcrypt:FC<IProps> = ({input_ref,handleChangeViewPassword,ViewPassword,handleChangeKeyText,handleFileChange,selectFile}) => {
    return (
        <>
            <form action="">

                {/* TODO: From-Control */}
                <div className="flex flex-col mb-4 relative">
                <label htmlFor="key_text" className='text-white text-xl'>Key Text Decrypt</label>
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
                <div className=" text-white  flex justify-center items-center w-full h-full bg-gray-800 hover:cursor-pointer  transition duration-300 cursor-pointer group hover:bg-white" onClick={() => input_ref.current?.click()} >
                    <span className='inline-block  text-2xl font-medium tracking-wide text-white transition duration-300  group-hover:text-gray-800 '>{selectFile ? selectFile.name : "Upload File Encrypt" }</span>
                </div>
                </div>
            </form>
        </>
    )
}

export default FormDcrypt