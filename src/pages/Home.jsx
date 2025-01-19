import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import TopBar from '../components/TopBar';
import { CustomButton, EditProfile, FriendCard, Loading, PostCard, ProfileCard, TextInput } from '../components';
import { NoProfile, } from '../assets';
// import { requests, suggest} from '../assets/data';
import { Link } from 'react-router-dom';
import { BsFiletypeGif, BsPersonFillAdd, BsPostcard } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, likePost, sendFriendRequest } from '../utils';
import { UserLogin } from '../redux/userSlice';

const Home = () => {
  const {posts} = useSelector((state)=>state.posts);
   const {user,edit}=useSelector((state)=>state.user);
   const [friendRequest,setFriendRequest] = useState([]);
   const [suggestedFriends, setSuggestedFriends] = useState([]);
   const [errMsg, setErrMsg] = useState("");
   const [posting,setPosting] = useState(false);
   const [loading,setLoading] = useState(false);
   const {register,reset, handleSubmit,formState:{errors},} = useForm();
   const [file,setFile] = useState(null);
  
   const dispatch =useDispatch();

   const handlePostSubmit = async(data)=>{
    setPosting(true);
    setErrMsg("");
    try{
      const url =file && (await handleFileUpload(file));
      const newData = url ? {...data,image:url}:data;
        
      
      const res = await apiRequest({
                url : "/posts/create-post",
                data : newData,
                token: user?.token,
                method : "POST",
              });
              if(res?.status === "failed"){
                setErrMsg(res);
              }else{
                reset({
             description:"",
                });
                setFile(null);
                setErrMsg("");
                await fetchPost();
              }
              setPosting(false);
    }catch(error){
      console.log(error);
      setPosting(false);
    }
   };

   const  fetchPost = async ()=>{
    await fetchPosts(user?.token,dispatch);
    setLoading(false);
   };
   const  handlePostLike = async (uri)=>{
    await likePost({uri:uri,token: user?.token});
    await fetchPost;
   };
   const  handleDlete = async (id)=>{
    await deletePost(id, user.token);
    await fetchPost();
   };
   const  fetchFriendRequests = async ()=>{
    try{
      const res =await apiRequest({
      url: "/users/get-friend-request",
      token : user?.token,
      method: "POST",
      });

      setFriendRequest(res?.data);
    }catch(error){
      console.log(error);
    }
   };
   const  fetchSuggestedFriends = async ()=>{
    try{
    const res =await apiRequest({
      url: "/users/suggested-friends",
      token : user?.token,
      method: "POST",
      });

        setSuggestedFriends(res?.data);
        }catch(error){
      console.log(error);
    }
   };
   const  handleFriendRequests = async (id)=>{
    try{
    
         const res = sendFriendRequest(user?.token,id);
         await fetchFriendRequests();
          }catch(error){
        console.log(error);
      }
   };
   const  acceptFriendRequests = async (id,status)=>{
    try{
      const res =await apiRequest({
        url: "/users/accept-request",
        token : user?.token,
        method: "POST",
        data: {rid:id, status},
        });
  
          setSuggestedFriends(res?.data);
          }catch(error){
        console.log(error);
      }
   };
   const  getUser = async ()=>{
    const res = await getUserInfo(user?.token);
    const newData = {token: user?.token, ...res};
    dispatch(UserLogin(newData));
   };

    useEffect(()=>{
      setLoading(true);
      getUser();
      fetchPost();
      fetchFriendRequests();
      fetchSuggestedFriends();
    },[]);

  return (
   <>
   
   <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor
    lg:rounded-lg h-screen overflow-hidden'>
      <TopBar/>
      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6
        overflow-y-auto'>
          <ProfileCard user={user}/>
         <FriendCard friends={user?.friends}/>
        </div>
         {/* CENTER */}
        <div className='flex-1 h-full  pt-0 p-4 flex flex-col gap-6
        overflow-y-auto'>
          <form onSubmit={handleSubmit(handlePostSubmit)} className='bg-primary px-4 rounded-lg' 
          >
            <div className='w-full flex items-center gap-2 py-4 border-b
            border-[#66666645]'>
              <img 
              src={user?.profileUrl ?? NoProfile} 
              alt="User image"
              className='w-14 h-14 rounded-full object-cover' />
              <TextInput
              styles="w-full rounded-full py-5"
              placeholder=" What's on your mind...."
              name="description"
              register={register("description",{
                required :"Write something about post",
              })}
              error={errors.description ? errors.description.message :""}
              />
            </div>
            {errMsg?.message &&(
              <span 
              role='aler'
              className={`text-sm ${
                errMsg?.status === "failed"?"text-[#f64940fe]":"text-[#2ba150fe]"
              } mt-0.5`}>

              </span>
            )}
            <div className='flex items-center justify-between
            py-4'>
              <label htmlFor="imgUpload"
              className='flex items-center gap-1 text-base text-ascent-2
              hover:text-ascent-1 cursor-pointer'
              >
                <input type="file"
                onChange={(e)=> setFile(e.target.files[0])} 
                className='hidden'
                id='imgUpload'
                data-max-size='5120'
                accept='.jpg,.jpg, .jpeg'/>
                <BiImages />
                <span>Image</span>
              </label>

              <label 
              className='flex items-center gap-1 text-base text-ascent-2
              hover:text-ascent-1 cursor-pointer'
              htmlFor="videoUpload">
                <input type="file" 
                data-max-size='5120'
                onChange={(e)=>setFile(e.target.files[0])}
                className='hidden'
                id='videoUpload'
                accept='.mp4, .wav'/>
                <BiSolidVideo/>
                <span>Video</span>
              </label>

              <label 
              className='flex items-center gap-1 text-base text-ascent-2
              hover:text-ascent-1 cursor-pointer'
              htmlFor="vgifUpload">
                <input type="file" 
                data-max-size='5120'
                onChange={(e)=>setFile(e.target.files[0])}
                className='hidden'
                id='vgifUpload'
                accept='.gift'/>
                <BsFiletypeGif/>
                <span>Gif</span>
              </label>

              <div>
              {posting ? (<Loading/>):(
                <CustomButton
                type='submit'
                title="Post"
                containerStyles='bg-[#0444a4] text-white py-1 px-6
                rounded-full font-semibold text-sm'/>
              )}
              </div>
            </div>
          </form>
          {loading ? (<Loading/>):posts?.length > 0 ?(
             posts?.map((post)=>(
              <PostCard 
              key={post?._id} 
              post={post} 
              user={user}
              delete={handleDlete}
              likePost={handlePostLike}/>
            ))
          ):(<p>No post avilable</p>)}
        </div>
        
        {/* RIGHT */}
        <div className='hidden w-1/4 h-full lg:flex flex-col gap-8
        overflow-y-auto'>
          {/* Friend request */}
          <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
            <div className='flex items-center justify-between text-xl
            text-ascent-1 pb-2 border-[#66666645]'>
            <span>Friend Request</span>
            <span className='text-[#f31b1b] text-sm bg-white rounded-full  h-5 w-5 p-3 flex items-center justify-center'>{friendRequest?.length}</span>
            </div>
            <div className='w-full flex flex-col gap-4'>
            {friendRequest?.map(({_id, requestFrom: from})=>(
              <div key={_id} className='flex items-center justify-between'>
                <Link to={"/profile/" + from._id}
                className="w-full flex gap-4 items-center cursor-pointer">
                <img 
                src={from?.profileUrl ?? NoProfile} 
                alt={from?.firstName} 
                className='w-10 h-10 object-cover rounded-full'/>
                <div className='flex-1'>
                <p className='text-base font-medium text-ascent-1'>
                  {from?.firstName}
                </p>
                <span className='text-sm text-ascent-2'>
                {from?.profession ?? "No Proffesion"}
                </span>
                </div>
                </Link>
                <div className='flex gap-1 '>
                  <CustomButton 
                  title="Accept"
                  onClick={()=>acceptFriendRequests(_id, "Accepted")}
                  containerStyles='bg-[#0444a4] text-xs text-white px-1.5
                  py-1 rounded-full'/>
                    <CustomButton 
                  title="Deny"
                  onClick={()=>acceptFriendRequests(_id, "Denied")}
                  containerStyles='bg-[#666] text-xs text-white px-1.5
                  py-1 rounded-full'/>
                </div>
              </div>
            ))}
            </div>
          </div>
          {/* suggested friends */}
          <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
            <div className='flex items-center justify-between text-lg
            text-ascent-1 border-b border-[#66666645]'>
              <span>Friend Suggestion</span>
            </div>
            <div className='w-full flex flex-col gap-4 pt-4'>
            {suggestedFriends?.map((friend)=>(
              <div className='flex items-center justify-between'
              key={friend._id}>
               <Link 
               to={"/profile/" + friend?._id}
                className="w-full flex gap-4 items-center cursor-pointer">
                <img 
                src={friend?.profileUrl ?? NoProfile} 
                alt={friend?.firstName} 
                className='w-10 h-10 object-cover rounded-full'/>
                 <div className='flex-1'>
                <p className='text-base font-medium text-ascent-1'>
                  {friend?.firstName}{friend?.lastName}
                </p>
                <span className='text-sm text-ascent-2'>
                {friend?.profession ?? "No Proffesion"}
                </span>
                </div>
                </Link>
                <div className='flex gap-1'>
                    <button
                      className='bg-[#0444a430] text-sm text-white p-1 rounded'
                       onClick={() => {handleFriendRequests(friend?._id)}}
                        >
                      <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                    </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  { edit && <EditProfile/>}
    </>
  )
}

export default Home;
