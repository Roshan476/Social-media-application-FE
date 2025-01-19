import React, { useDebugValue, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EditProfile, FriendCard, Loading, PostCard, ProfileCard, TopBar } from '../components';
import { deletePost, fetchPosts, getUserInfo, likePost } from '../utils';
// import { posts } from '../assets/data';

const Profile = () => {
  const { id } = useParams(); // Extracts dynamic parameters from the URL
  const dispatch = useDispatch(); // Used to dispatch actions to the Redux store
  const { user, edit } = useSelector((state) => state.user); // Extracts the user state from the Redux store
  const [userInfo, setUserInfo] = useState(user); // Local state for user information
  const [loading, setLoading] = useState(false); // Loading state
  
  const uri ="/posts/get-user-post/" + id;
  
  const {posts} = useSelector((state)=>state.posts);
  
  const getUser = async()=>{
    const res = await getUserInfo(user?.token,id);
    setUserInfo(res);
  };
  const getPosts = async()=>{
  await fetchPosts(user.token,dispatch,uri);
    setLoading(false);
  };


  const handleDelete = async (id) => {
    await deletePost(id,user.token);
    await getPosts();
  };

  const handleLikePost = async(uri) => {
  await likePost({uri: uri,token:user?.token});
  await getPosts();
  };

  useEffect(()=>{
  setLoading(true);
  getUser();
  getPosts();
},[id]);

  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />
        <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={userInfo} />
            <div className='block lg:hidden'>
              <FriendCard friends={userInfo?.friends} />
            </div>
          </div>
          {/* CENTER */}
          <div className=' flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>
          {/* RIGHT*/}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendCard friends={userInfo?.friends} />
          </div>
          {/* Add center section content here if required */}
        </div>
      </div>
      { edit && <EditProfile/>}
    </>
  );
};

export default Profile;
