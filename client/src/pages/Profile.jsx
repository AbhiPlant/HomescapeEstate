import { useSelector } from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { useRef, useState, useEffect } from "react"
import { app } from "../firebase";
import { updateUserStart,
  updateUserFailure, 
  updateUserSuccess, 
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {Link} from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [showListingError, setshowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch();
  console.log(formData);

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])
  const handleFileUpload = (file)=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
      setFilePerc(Math.round(progress));
    },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>setFormData({...formData, avatar:downloadURL}));
    });
  };

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart())
      const  res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await  res.json()
      if(!data.success === false){
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserStart())
      const res = await  fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
  }

  const handleShowListings = async ()=>{
    try {
      setshowListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setshowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setshowListingError(true);
    }
  }

  const handleListingDelete = async (listingId)=>{
    try {
      const res = await  fetch(`/api/listing/delete/${listingId}`,{
        method: 'DELETE',
      })
      const data = await res.json();
      if(!data.success === false){
        console.log(data.message);
        return;
      }
      setUserListing((prev)=> prev.filter((listing)=> listing._id !== listingId));
    } catch (error) {
      
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl md:text-4xl font-bold font-serif text-center my-7 text-black '>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile'
        className="rounded-full h-24 w-24 object-cover 
        cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
          {fileUploadError ?
          (<span className="text-red-700">Error Image Upload (image must be less than 2mb)</span>) :
          filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>) : 
            filePerc === 100 ? (
              <span className="text-green-700">Successfully Image Uploaded !</span>) : ('')
          }
        </p>
        <input type="text" placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="email" placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>Create Listing</Link>
        
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError ? 'Error showing listing' : ''}</p>

      {userListing && 
        userListing.length > 0 && 
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-3xl md:text-3xl lg:text-3xl font-bold font-serif text-blue-700">Your Listings:</h1>
          {userListing.map((listing)=> (
          <div key={listing._id} className="border border-blue-400 rounded-lg p-3 flex justify-between items-center gap-4 shadow-md">
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain" />
            </Link>
            <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
        ))}
        </div>}
    </div>
  )
}
